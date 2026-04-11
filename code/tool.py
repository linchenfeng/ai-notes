"""
提供一个最小可用的本地 Ollama 工具函数。

目标用法：

from tool import get_completion

response = get_completion("中国的首都是哪里？")
print(response)
"""

from __future__ import annotations

import json
import socket
from urllib import error, request


OLLAMA_BASE_URL = "http://127.0.0.1:11434"
DEFAULT_MODEL_NAME = "qwen2.5-coder:7b"


def get_completion(
    prompt: str,
    system_prompt: str = "你是一个简洁、准确的中文助手。",
    model_name: str = DEFAULT_MODEL_NAME,
    temperature: float = 0.7,
) -> str:
    """
    发送一个简单问题给本地 Ollama，并返回字符串结果。

    参数：
        prompt: 用户问题。
        system_prompt: 系统提示词。
        model_name: 本地 Ollama 模型名称。
        temperature: 输出随机性。

    返回：
        str:
        - 成功时返回模型生成的文本
        - 失败时抛出更易理解的异常
    """
    if not prompt or not prompt.strip():
        raise ValueError("prompt 不能为空。")

    payload = {
        "model": model_name,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": prompt.strip(),
            },
        ],
        "stream": False,
        "options": {
            "temperature": temperature,
        },
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
            response_text = response.read().decode("utf-8")
            data = json.loads(response_text)
    except error.HTTPError as exc:
        error_text = exc.read().decode("utf-8", errors="ignore")
        if "model" in error_text.lower() and "not found" in error_text.lower():
            raise RuntimeError(
                f"本地模型 `{model_name}` 不存在，请先执行：ollama pull {model_name}"
            ) from exc
        raise RuntimeError(f"Ollama 请求失败：{error_text or exc.reason}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            "无法连接本地 Ollama 服务，请先确认 Ollama 已启动。"
        ) from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("请求本地 Ollama 超时，请稍后重试。") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Ollama 返回结果不是合法 JSON。") from exc

    message = data.get("message", {})
    content = message.get("content", "").strip()
    if not content:
        raise RuntimeError("模型调用完成，但没有返回可用内容。")

    return content
