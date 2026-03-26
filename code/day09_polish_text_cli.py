"""
Day 9：CLI 版文本润色器

这个脚本对应今天的学习目标：
1. 理解 Ollama 聊天接口里的 messages 结构
2. 理解 system prompt 和 user prompt 的区别
3. 做出一个可以在终端里使用的文本润色小工具

运行示例：
python3 code/day09_polish_text_cli.py "我最近在学大模型开发，希望表达更专业一点。"
"""

from __future__ import annotations

import json
import sys
from urllib import error, request


# 继续沿用本机已经可用的 Qwen 小模型。
MODEL_NAME = "qwen2.5:0.5b"
OLLAMA_URL = "http://localhost:11434/api/chat"


def get_input_text() -> str:
    """
    获取用户输入的原始文本。

    为了让命令行体验更自然，这里支持两种方式：
    1. 直接在命令后面传入文本
    2. 不传参数时，程序运行后在终端里交互输入

    参数：
        无。
        这个函数直接从命令行参数或终端输入中取值。

    返回：
        str: 用户输入的原始文本。
        如果用户什么都没输入，返回的会是空字符串。
    """
    if len(sys.argv) > 1:
        # 把命令行里后续的所有参数拼接成一句完整文本。
        return " ".join(sys.argv[1:]).strip()

    return input("请输入你想润色的文本：").strip()


def build_messages(text: str) -> list[dict[str, str]]:
    """
    组装发送给模型的消息列表。

    messages 是聊天接口最核心的结构：
    - system：告诉模型“你应该以什么角色和规则工作”
    - user：告诉模型“我现在具体要你处理什么内容”

    参数：
        text: 用户想要润色的原始文本。
        这段文本会被放进 user prompt，作为模型真正要处理的内容。

    返回：
        list[dict[str, str]]: 一个消息列表。
        列表里的每一项都代表一条消息，常见字段有：
        - role: 消息角色，比如 system 或 user
        - content: 这条消息的具体内容
    """
    return [
        {
            "role": "system",
            "content": (
                "你是一个中文文本润色助手。"
                "请在不改变原意的前提下，让用户输入更自然、更清晰、更适合展示。"
                "输出时只返回润色后的文本，不要额外解释。"
            ),
        },
        {
            "role": "user",
            "content": f"请帮我润色这段文本：{text}",
        },
    ]


def build_payload(text: str) -> dict:
    """
    把模型名、消息列表和其他参数组合成请求体。

    参数：
        text: 用户输入的原始文本。
        这个参数会进一步传给 build_messages(text)，
        最终进入 user prompt。

    返回：
        dict: 一个可直接发送给 Ollama /api/chat 的请求体字典。
    """
    return {
        "model": MODEL_NAME,
        "messages": build_messages(text),
        # 对初学者来说，先关闭流式输出，更容易理解返回结构。
        "stream": False,
        # 这里先不加太多参数，保持最小闭环。
    }


def call_ollama(payload: dict) -> dict | None:
    """
    向本地 Ollama 发送请求。

    参数：
        payload: 要发送给本地模型的请求体。
        一般是 build_payload() 返回的字典，里面包含 model、messages、stream 等字段。

    返回：
        dict | None:
        - 成功时返回模型响应对应的 Python 字典
        - 失败时返回 None
    """
    body = json.dumps(payload).encode("utf-8")
    http_request = request.Request(
        OLLAMA_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=60) as response:
            response_text = response.read().decode("utf-8")
            return json.loads(response_text)
    except error.URLError as exc:
        print("调用本地 Qwen 失败。")
        print("请检查 Ollama 是否正在运行，以及模型是否已经拉取完成。")
        print(f"原始错误：{exc}")
        return None
    except json.JSONDecodeError as exc:
        print("模型返回的内容不是合法 JSON。")
        print(f"原始错误：{exc}")
        return None


def extract_content(data: dict | None) -> str:
    """
    从 Ollama 返回结果里提取模型生成的文本。

    参数：
        data: Ollama 返回的响应数据。
        如果请求成功，通常会包含 message -> content 这样的结构；
        如果请求失败，这里可能是 None。

    返回：
        str:
        - 成功提取到内容时，返回模型生成的文本
        - 没有提取到内容时，返回空字符串
    """
    if not data:
        return ""

    message = data.get("message", {})
    content = message.get("content", "")
    return content.strip()


def print_result(original_text: str, polished_text: str) -> None:
    """
    打印原文和润色后的结果。

    参数：
        original_text: 用户最开始输入的原始文本。
        polished_text: 模型返回的润色结果文本。

    返回：
        None
        这个函数只负责把信息展示到终端。
    """
    print("\n原始文本：")
    print(original_text)

    print("\n润色结果：")
    if polished_text:
        print(polished_text)
    else:
        print("没有拿到可用的润色结果。")


def main() -> None:
    """
    程序入口。

    主流程如下：
    1. 获取用户输入
    2. 校验输入是否为空
    3. 构造请求体并调用本地模型
    4. 提取并打印润色结果
    """
    original_text = get_input_text()

    if not original_text:
        print("输入不能为空，请重新运行脚本并提供一段文本。")
        return

    payload = build_payload(original_text)
    result = call_ollama(payload)
    polished_text = extract_content(result)
    print_result(original_text, polished_text)


if __name__ == "__main__":
    main()
