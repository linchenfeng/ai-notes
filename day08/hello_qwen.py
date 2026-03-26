"""
Day 8：第一次用 Python 调本地 Qwen

这个脚本的目标很简单：
1. 向本地运行的 Ollama 发送一条消息
2. 让本地 Qwen 模型返回一句回答
3. 把结果打印到终端

运行前请先确认两件事：
1. Ollama 已经安装完成
2. 你已经拉取了一个可用的 Qwen 模型，比如：
   ollama pull qwen2.5:0.5b
"""

from __future__ import annotations

import json
from urllib import error, request


# 这里填写 Ollama 在本机提供服务的地址。
# 默认情况下，Ollama 的 HTTP 服务就是这个地址。
OLLAMA_URL = "http://localhost:11434/api/chat"

# 这里填写要调用的模型名称。
# 我这里默认用本机已经存在的 qwen2.5:0.5b，这样脚本能直接跑起来。
MODEL_NAME = "qwen2.5:0.5b"


def build_payload() -> dict:
    """构造发送给 Ollama 的请求体。"""
    return {
        "model": MODEL_NAME,
        # messages 是聊天接口最核心的字段。
        # 它是一个列表，里面每一项都是一条消息。
        "messages": [
            {
                "role": "system",
                "content": "你是一个简洁、友好的中文学习助手。",
            },
            {
                "role": "user",
                "content": "请用三句话向初学者介绍 Python 为什么适合学习 LLM 开发。",
            },
        ],
        # stream=False 表示等模型一次性生成完整结果后再返回。
        # 对初学者来说，这样最容易看懂返回数据结构。
        "stream": False,
    }


def call_ollama(payload: dict) -> dict | None:
    """向本地 Ollama 发送请求，并返回 JSON 结果。"""
    # 先把 Python 字典转成 JSON 字符串，再编码成 bytes。
    body = json.dumps(payload).encode("utf-8")

    # Content-Type 告诉服务端：我发送的是 JSON。
    http_request = request.Request(
        OLLAMA_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        # timeout 可以避免服务长时间无响应时程序一直卡住。
        with request.urlopen(http_request, timeout=60) as response:
            response_text = response.read().decode("utf-8")
            return json.loads(response_text)
    except error.URLError as exc:
        print("请求本地 Ollama 失败。")
        print("请检查：")
        print("1. Ollama 服务是否已经启动")
        print(f"2. 本地地址是否可访问：{OLLAMA_URL}")
        print(f"3. 模型是否已存在：{MODEL_NAME}")
        print(f"原始错误：{exc}")
        return None
    except json.JSONDecodeError as exc:
        print("返回结果不是合法的 JSON，无法继续解析。")
        print(f"原始错误：{exc}")
        return None


def print_result(data: dict | None) -> None:
    """从 Ollama 返回结果里取出模型回答并打印。"""
    if not data:
        print("没有拿到可用结果。")
        return

    # Ollama /api/chat 在 stream=False 时，常见结构里会有 message 字段。
    # message 里面再包含 role 和 content。
    message = data.get("message", {})
    content = message.get("content", "").strip()

    if not content:
        print("接口调用成功，但没有拿到模型内容。")
        print("完整返回数据如下：")
        print(json.dumps(data, ensure_ascii=False, indent=2))
        return

    print("Qwen 的回答：")
    print(content)


def main() -> None:
    """程序入口。"""
    print("开始请求本地 Qwen 模型...")
    payload = build_payload()
    result = call_ollama(payload)
    print_result(result)


if __name__ == "__main__":
    main()
