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
import socket
from typing import Literal
from urllib import error, request

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


OLLAMA_BASE_URL = "http://127.0.0.1:11434"
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"


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


def call_ollama_chat(prompt: str, model_name: str = DEFAULT_MODEL_NAME) -> str:
    """
    调用本地 Ollama /api/chat，返回模型文本。
    """
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": "你是一个可靠的中文总结助手。"},
            {"role": "user", "content": prompt},
        ],
        "stream": False,
        "options": {"temperature": 0.3},
    }

    endpoint = f"{OLLAMA_BASE_URL}/api/chat"
    body = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        endpoint,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=300) as response:
            data = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Ollama 请求失败：{detail or exc.reason}") from exc
    except error.URLError as exc:
        raise RuntimeError("无法连接本地 Ollama 服务，请先确认 Ollama 已启动。") from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("请求本地模型超时，请稍后再试。") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Ollama 返回结果不是合法 JSON。") from exc

    content = data.get("message", {}).get("content", "").strip()
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
        summary = call_ollama_chat(prompt=prompt, model_name=DEFAULT_MODEL_NAME)
    except RuntimeError as exc:
        return GenerateResponse(ok=False, style=payload.style, error=str(exc))

    return GenerateResponse(ok=True, summary=summary, style=payload.style)
