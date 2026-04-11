"""
Day 18：后端初版（FastAPI + Ollama）

本文件提供 3 个接口：
1. GET /ping
   用于健康检查，确认后端服务是否启动。
2. GET /styles
   返回可选总结风格列表，方便前端渲染下拉框。
3. POST /generate
   核心接口：接收文章文本和风格，调用 Ollama 返回总结结果。

运行方式（先安装依赖）：
python3 -m pip install -r backend/day18_requirements.txt
uvicorn backend.day18_main:app --reload --port 8000
"""

from __future__ import annotations

import json
import logging
import os
import socket
import ssl
import time
import uuid
from typing import Literal
from urllib import error, request

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

try:
    import certifi
except ImportError:
    certifi = None


REMOTE_API_BASE_URL = os.getenv(
    "REMOTE_API_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1"
).rstrip("/")
REMOTE_API_KEY = os.getenv("REMOTE_API_KEY", "").strip() or os.getenv(
    "DASHSCOPE_API_KEY", ""
).strip()
DEFAULT_MODEL_NAME = os.getenv("REMOTE_MODEL_NAME", "qwen-turbo")
SYSTEM_PROMPT_V2 = (
    "你是一个严谨的中文总结助手。"
    "请只根据用户提供的原文输出，不要补充原文之外的信息。"
    "严格遵守用户指定格式，不要输出额外解释、标题或代码块。"
)
RETRYABLE_HTTP_STATUS = {429, 500, 502, 503, 504}

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("day26_backend")


class GenerateRequest(BaseModel):
    """
    前端请求体结构。

    text: 用户输入原文。
    style: 总结风格（brief/bullets/structured）。
    """

    text: str = Field(min_length=1, description="待总结原文")
    style: Literal["brief", "bullets", "structured"] = "brief"


class GenerateResponse(BaseModel):
    """
    统一响应结构。
    """

    ok: bool
    summary: str = ""
    style: str = ""
    model: str = DEFAULT_MODEL_NAME
    error: str = ""
    input_length: int = 0
    output_length: int = 0


app = FastAPI(title="Day16-20 AI Summary Backend", version="0.1.0")

# 开发阶段先放开 CORS，便于本地前端页面直接联调。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
def handle_validation_error(_, exc: RequestValidationError) -> JSONResponse:
    logger.warning("request_validation_error detail=%s", exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "ok": False,
            "summary": "",
            "style": "",
            "model": DEFAULT_MODEL_NAME,
            "error": "请求参数不合法，请检查 text 和 style。",
        },
    )


@app.exception_handler(Exception)
def handle_unexpected_error(_, exc: Exception) -> JSONResponse:
    logger.exception("unexpected_server_error error=%s", exc)
    return JSONResponse(
        status_code=500,
        content={
            "ok": False,
            "summary": "",
            "style": "",
            "model": DEFAULT_MODEL_NAME,
            "error": "服务内部异常，请稍后重试。",
        },
    )


def create_ssl_context() -> ssl.SSLContext | None:
    """
    为 HTTPS 请求创建证书上下文。
    """
    if certifi is None:
        return None
    return ssl.create_default_context(cafile=certifi.where())


def build_summary_prompt(text: str, style: str) -> str:
    """
    根据风格生成 Prompt。

    这样做的意义是：
    同一个接口可以支持多种输出风格，前端只需要传 style。
    """
    if style == "brief":
        return (
            "任务：生成简洁摘要。\n"
            "格式约束：\n"
            "1. 仅输出一段正文，不要分点。\n"
            "2. 字数 80~120 字。\n"
            "3. 不要出现“根据原文”“以下是总结”等引导语。\n"
            "4. 不要输出 Markdown 代码块。\n"
            "内容约束：\n"
            "1. 只使用原文事实。\n"
            "2. 不编造数据与结论。\n\n"
            f"原文：\n{text}\n\n输出："
        )

    if style == "bullets":
        return (
            "任务：生成要点摘要。\n"
            "格式约束：\n"
            "1. 只输出 3~5 条要点。\n"
            "2. 每条必须以“- ”开头。\n"
            "3. 每条不超过 35 字。\n"
            "4. 不要输出额外说明、标题、编号或代码块。\n"
            "内容约束：\n"
            "1. 只使用原文事实。\n"
            "2. 不编造数据与结论。\n\n"
            f"原文：\n{text}\n\n输出："
        )

    return (
        "任务：生成结构化摘要，严格按指定键输出。\n"
        "格式约束：\n"
        "1. 只输出以下三行，且键名必须完全一致：\n"
        "背景：...\n"
        "关键动作：...\n"
        "结果：...\n"
        "2. 每行不超过 40 字。\n"
        "3. 除这三行外不要输出任何其他内容。\n"
        "4. 不要输出代码块。\n"
        "内容约束：\n"
        "1. 只使用原文事实。\n"
        "2. 不编造数据与结论。\n\n"
        f"原文：\n{text}\n\n输出："
    )


def normalize_summary_output(style: str, summary: str) -> str:
    """
    对模型输出做轻量规范化，减少格式漂移。
    """
    cleaned = summary.replace("```", "").strip()

    if style == "brief":
        return cleaned.replace("\n", " ").strip()

    if style == "bullets":
        lines = [line.strip() for line in cleaned.splitlines() if line.strip()]
        bullet_lines: list[str] = []
        for line in lines:
            if line.startswith("- "):
                bullet_lines.append(line)
            elif line.startswith("• "):
                bullet_lines.append("- " + line[2:].strip())
            elif line[0].isdigit() and "." in line:
                bullet_lines.append("- " + line.split(".", 1)[1].strip())
            else:
                bullet_lines.append("- " + line)
            if len(bullet_lines) >= 5:
                break
        return "\n".join(bullet_lines[:5])

    lines = [line.strip() for line in cleaned.splitlines() if line.strip()]
    required = {"背景": "", "关键动作": "", "结果": ""}
    for line in lines:
        for key in required:
            if line.startswith(f"{key}："):
                required[key] = line.split("：", 1)[1].strip()
    for key in required:
        if not required[key]:
            required[key] = "未提取到明确信息"
    return "\n".join([f"背景：{required['背景']}", f"关键动作：{required['关键动作']}", f"结果：{required['结果']}"])


def call_remote_chat(
    prompt: str,
    model_name: str = DEFAULT_MODEL_NAME,
    timeout_seconds: int = 120,
    max_retries: int = 2,
) -> str:
    """
    调用远程 OpenAI 兼容聊天接口，返回模型文本。
    """
    if not REMOTE_API_KEY:
        raise RuntimeError(
            "缺少远程 API Key。请配置 REMOTE_API_KEY 或 DASHSCOPE_API_KEY。"
        )

    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT_V2},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,
    }

    endpoint = f"{REMOTE_API_BASE_URL}/chat/completions"
    body = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        endpoint,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {REMOTE_API_KEY}",
        },
        method="POST",
    )

    for attempt in range(max_retries + 1):
        try:
            with request.urlopen(
                http_request,
                timeout=timeout_seconds,
                context=create_ssl_context(),
            ) as response:
                data = json.loads(response.read().decode("utf-8"))
            break
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")
            should_retry = exc.code in RETRYABLE_HTTP_STATUS and attempt < max_retries
            if should_retry:
                backoff_seconds = min(2**attempt, 4)
                logger.warning(
                    "remote_call_retry attempt=%s code=%s backoff=%ss reason=%s",
                    attempt + 1,
                    exc.code,
                    backoff_seconds,
                    exc.reason,
                )
                time.sleep(backoff_seconds)
                continue
            raise RuntimeError(f"远程 API 请求失败：{detail or exc.reason}") from exc
        except (error.URLError, TimeoutError, socket.timeout) as exc:
            should_retry = attempt < max_retries
            if should_retry:
                backoff_seconds = min(2**attempt, 4)
                logger.warning(
                    "remote_call_retry attempt=%s backoff=%ss error=%s",
                    attempt + 1,
                    backoff_seconds,
                    exc,
                )
                time.sleep(backoff_seconds)
                continue
            raise RuntimeError(
                f"无法连接远程 API，请检查网络或 API 地址配置。原始错误：{exc}"
            ) from exc
        except json.JSONDecodeError as exc:
            raise RuntimeError("远程 API 返回结果不是合法 JSON。") from exc

    choices = data.get("choices", [])
    content = ""
    if choices:
        content = choices[0].get("message", {}).get("content", "").strip()
    if not content:
        raise RuntimeError("模型返回为空。")
    return content


@app.get("/ping")
def ping() -> dict[str, str]:
    """
    健康检查接口。
    """
    return {"status": "ok"}


@app.get("/styles")
def styles() -> dict[str, list[dict[str, str]]]:
    """
    前端可用风格列表。
    """
    return {
        "items": [
            {"value": "brief", "label": "简洁版"},
            {"value": "bullets", "label": "要点版"},
            {"value": "structured", "label": "结构化版"},
        ]
    }


@app.post("/generate", response_model=GenerateResponse)
def generate(payload: GenerateRequest) -> GenerateResponse:
    """
    核心接口：
    1. 校验文本长度
    2. 根据 style 组装 Prompt
    3. 调用本地 Ollama
    4. 返回统一 JSON
    """
    text = payload.text.strip()
    request_id = str(uuid.uuid4())[:8]
    start_time = time.perf_counter()
    logger.info(
        "generate_start request_id=%s style=%s text_len=%s",
        request_id,
        payload.style,
        len(text),
    )
    if len(text) > 4000:
        raise HTTPException(status_code=400, detail="输入文本过长，请控制在 4000 字以内。")

    prompt = build_summary_prompt(text=text, style=payload.style)

    try:
        summary = call_remote_chat(
            prompt=prompt,
            model_name=DEFAULT_MODEL_NAME,
            timeout_seconds=90,
            max_retries=2,
        )
        summary = normalize_summary_output(payload.style, summary)
        used_model = DEFAULT_MODEL_NAME
    except RuntimeError as exc:
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        logger.error(
            "generate_fail request_id=%s style=%s duration_ms=%s error=%s",
            request_id,
            payload.style,
            duration_ms,
            exc,
        )
        return GenerateResponse(
            ok=False,
            style=payload.style,
            error=str(exc),
            input_length=len(text),
            output_length=0,
        )

    duration_ms = int((time.perf_counter() - start_time) * 1000)
    logger.info(
        "generate_success request_id=%s style=%s duration_ms=%s input_length=%s output_length=%s",
        request_id,
        payload.style,
        duration_ms,
        len(text),
        len(summary),
    )
    return GenerateResponse(
        ok=True,
        summary=summary,
        style=payload.style,
        model=used_model,
        input_length=len(text),
        output_length=len(summary),
    )
