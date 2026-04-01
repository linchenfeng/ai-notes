"""
阿里百炼云端调用公共工具

这个文件的作用：
1. 统一读取 API Key
2. 统一处理 HTTPS 证书
3. 统一发送聊天请求
4. 统一提取模型返回文本

这样 Day 8、Day 9、Day 10 的脚本就不用重复写一大段网络请求代码。
"""

from __future__ import annotations

import json
import os
import socket
import ssl
from urllib import error, request

try:
    import certifi
except ImportError:
    certifi = None


BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
DEFAULT_MODEL_NAME = "qwen-turbo"


def get_api_key() -> str:
    """
    读取阿里百炼的 API Key。

    参数：
        无。
        这个函数会直接从环境变量 DASHSCOPE_API_KEY 里读取密钥。

    返回：
        str:
        - 如果读取成功，返回 API Key 字符串
        - 如果没有配置，返回空字符串
    """
    return os.getenv("DASHSCOPE_API_KEY", "").strip()


def create_ssl_context() -> ssl.SSLContext | None:
    """
    创建 HTTPS 请求使用的证书上下文。

    参数：
        无。

    返回：
        ssl.SSLContext | None:
        - 如果本机安装了 certifi，就返回带 certifi 证书链的 SSL 上下文
        - 如果没有安装 certifi，就返回 None，让 urllib 使用系统默认配置
    """
    if certifi is None:
        return None

    return ssl.create_default_context(cafile=certifi.where())


def build_chat_payload(
    messages: list[dict[str, str]],
    model_name: str = DEFAULT_MODEL_NAME,
    temperature: float = 0.7,
    max_tokens: int | None = None,
) -> dict:
    """
    构造发送给阿里百炼聊天接口的请求体。

    参数：
        messages: 聊天消息列表。
        列表里的每一项通常包含：
        - role: system / user / assistant
        - content: 对应消息文本

        model_name: 要调用的模型名称。
        默认是 qwen-turbo。

        temperature: 输出随机性参数。
        数值越低通常越稳定，数值越高通常越发散。

        max_tokens: 本次请求允许模型最多生成多少个 token。
        如果传 None，就不主动限制这个字段。

    返回：
        dict:
        一个符合 OpenAI Chat Completions 兼容格式的请求体字典。
    """
    payload = {
        "model": model_name,
        "messages": messages,
        "temperature": temperature,
    }

    if max_tokens is not None:
        payload["max_tokens"] = max_tokens

    return payload


def call_chat_api(api_key: str, payload: dict, timeout_seconds: int = 120) -> dict | None:
    """
    调用阿里百炼聊天接口。

    参数：
        api_key: 阿里百炼 API Key。
        一般来自环境变量 DASHSCOPE_API_KEY。

        payload: 要发送给接口的请求体。
        通常由 build_chat_payload() 构造。

        timeout_seconds: 请求超时时间，单位是秒。
        如果模型响应较慢，可以适当调大。

    返回：
        dict | None:
        - 请求成功时，返回解析后的 JSON 字典
        - 请求失败时，返回 None
    """
    endpoint = f"{BASE_URL}/chat/completions"
    body = json.dumps(payload).encode("utf-8")

    http_request = request.Request(
        endpoint,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with request.urlopen(
            http_request,
            timeout=timeout_seconds,
            context=create_ssl_context(),
        ) as response:
            response_text = response.read().decode("utf-8")
            return json.loads(response_text)
    except error.HTTPError as exc:
        error_text = exc.read().decode("utf-8", errors="ignore")
        print("请求阿里百炼失败。")
        print(f"HTTP 状态码：{exc.code}")
        print("错误详情：")
        print(error_text)
        return None
    except error.URLError as exc:
        print("网络请求失败。")
        print("请检查网络连接、BASE_URL 是否正确，以及本机 HTTPS 证书配置。")
        print(f"原始错误：{exc}")
        return None
    except (TimeoutError, socket.timeout):
        print("请求超时。")
        print(f"当前等待时间是 {timeout_seconds} 秒。")
        print("你可以稍后重试，或者换一个更快的模型。")
        return None
    except json.JSONDecodeError as exc:
        print("返回结果不是合法 JSON，无法解析。")
        print(f"原始错误：{exc}")
        return None


def extract_chat_content(data: dict | None) -> str:
    """
    从阿里百炼聊天接口返回结果里提取正文内容。

    参数：
        data: 接口返回的响应数据。
        如果请求失败，这里可能是 None。

    返回：
        str:
        - 成功时返回 choices[0].message.content
        - 失败时返回空字符串
    """
    if not data:
        return ""

    choices = data.get("choices", [])
    if not choices:
        return ""

    first_choice = choices[0]
    message = first_choice.get("message", {})
    return message.get("content", "").strip()
