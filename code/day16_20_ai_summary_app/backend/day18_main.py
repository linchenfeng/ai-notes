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
import os
import socket
import ssl
from typing import Literal
from urllib import error, request

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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


app = FastAPI(title="Day16-20 AI Summary Backend", version="0.1.0")

# 开发阶段先放开 CORS，便于本地前端页面直接联调。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
            "请总结下面文章，要求：\n"
            "1. 中文输出\n"
            "2. 80~120 字\n"
            "3. 语气专业清晰\n"
            "4. 不要添加原文没有的信息\n"
            "5. 只输出总结正文，不要复述规则\n\n"
            f"文章：\n{text}\n\n总结："
        )

    if style == "bullets":
        return (
            "请总结下面文章，要求：\n"
            "1. 中文输出\n"
            "2. 用 3~5 条要点列表\n"
            "3. 每条不超过 35 字\n"
            "4. 不要添加原文没有的信息\n"
            "5. 只输出要点列表，不要复述规则\n\n"
            f"文章：\n{text}\n\n要点："
        )

    return (
        "请总结下面文章，严格按以下格式输出：\n"
        "背景：...\n"
        "关键动作：...\n"
        "结果：...\n"
        "每行不超过 40 字。\n"
        "除了这三行，不要输出其他内容。\n\n"
        f"文章：\n{text}\n\n输出："
    )


def call_remote_chat(
    prompt: str,
    model_name: str = DEFAULT_MODEL_NAME,
    timeout_seconds: int = 120,
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
            {"role": "system", "content": "你是一个可靠的中文总结助手。"},
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

    try:
        with request.urlopen(
            http_request,
            timeout=timeout_seconds,
            context=create_ssl_context(),
        ) as response:
            data = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"远程 API 请求失败：{detail or exc.reason}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            f"无法连接远程 API，请检查网络或 API 地址配置。原始错误：{exc}"
        ) from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError(f"请求模型超时（{model_name}）。") from exc
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
    if len(text) > 4000:
        raise HTTPException(status_code=400, detail="输入文本过长，请控制在 4000 字以内。")

    prompt = build_summary_prompt(text=text, style=payload.style)

    try:
        summary = call_remote_chat(
            prompt=prompt,
            model_name=DEFAULT_MODEL_NAME,
            timeout_seconds=90,
        )
        used_model = DEFAULT_MODEL_NAME
    except RuntimeError as exc:
        return GenerateResponse(ok=False, style=payload.style, error=str(exc))

    return GenerateResponse(ok=True, summary=summary, style=payload.style, model=used_model)
