"""
Day 13：3 轮上下文聊天脚本（对话历史管理）

今天的任务是：
做一个带 3 轮上下文的聊天脚本。

这份脚本重点演示两件事：
1. 如何用 messages 列表保存聊天历史
2. 如何只保留“最近 3 轮”对话，避免上下文无限增长

运行示例：
python3 code/day13_chat_memory_demo.py
"""

from __future__ import annotations

import json
import socket
from urllib import error, request


# 本地 Ollama 服务地址。
OLLAMA_BASE_URL = "http://127.0.0.1:11434"

# 为了保证脚本开箱可跑，这里使用你本机已经安装过的小模型。
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"

# 只保留最近 3 轮对话。
# 1 轮 = 1 条用户消息 + 1 条助手消息
MAX_HISTORY_ROUNDS = 3


def call_ollama_chat(messages: list[dict[str, str]], model_name: str = DEFAULT_MODEL_NAME) -> str:
    """
    调用 Ollama 的聊天接口，并返回助手回复。

    参数：
        messages: 完整对话历史（包含 system / user / assistant）。
        model_name: 要调用的本地模型名。

    返回：
        str: 助手回复内容。
    """
    payload = {
        "model": model_name,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.3,
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
        raise RuntimeError(f"Ollama 请求失败：{error_text or exc.reason}") from exc
    except error.URLError as exc:
        raise RuntimeError("无法连接本地 Ollama 服务，请先确认 Ollama 已启动。") from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("请求本地模型超时，请稍后重试。") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Ollama 返回内容不是合法 JSON。") from exc

    content = data.get("message", {}).get("content", "").strip()
    if not content:
        raise RuntimeError("模型返回为空。")

    return content


def keep_last_rounds(messages: list[dict[str, str]], max_rounds: int) -> list[dict[str, str]]:
    """
    只保留最近 max_rounds 轮对话历史。

    注意：
    - system 消息始终保留在开头
    - user/assistant 消息按时间顺序成对裁剪

    参数：
        messages: 当前完整消息列表。
        max_rounds: 最多保留多少轮历史。

    返回：
        list[dict[str, str]]: 裁剪后的消息列表。
    """
    if not messages:
        return messages

    system_messages = [msg for msg in messages if msg.get("role") == "system"]
    dialog_messages = [msg for msg in messages if msg.get("role") in {"user", "assistant"}]

    # 每轮按 2 条消息计算：user + assistant。
    keep_count = max_rounds * 2
    trimmed_dialog = dialog_messages[-keep_count:]

    return system_messages + trimmed_dialog


def run_demo() -> None:
    """
    运行一个固定 3 轮的上下文聊天演示。

    为什么用固定问题？
    因为固定输入更方便初学者复现和对比。
    """
    messages: list[dict[str, str]] = [
        {
            "role": "system",
            "content": "你是一个耐心的中文学习助手。请回答简洁、清晰。",
        }
    ]

    # 这里设计 3 个连续问题，第二和第三问会依赖前文信息，
    # 方便观察“上下文记忆”是否生效。
    user_questions = [
        "我叫小林，是一名前端工程师，最近在学 AI 开发。请记住这些信息。",
        "我叫什么？",
        "基于你记住的信息，给我 3 条接下来两周的学习建议。",
    ]

    print(f"当前模型：{DEFAULT_MODEL_NAME}")
    print(f"最大历史轮数：{MAX_HISTORY_ROUNDS}\n")

    for index, question in enumerate(user_questions, start=1):
        messages.append({"role": "user", "content": question})

        answer = call_ollama_chat(messages=messages, model_name=DEFAULT_MODEL_NAME)
        messages.append({"role": "assistant", "content": answer})

        # 每轮结束后都做一次历史裁剪，防止上下文无限增长。
        messages = keep_last_rounds(messages, max_rounds=MAX_HISTORY_ROUNDS)

        print(f"第 {index} 轮 - 用户：{question}")
        print(f"第 {index} 轮 - 助手：{answer}\n")

    print("演示结束：已完成 3 轮上下文对话。")


def main() -> None:
    """
    程序入口。
    """
    try:
        run_demo()
    except Exception as exc:
        print("运行 Day 13 对话脚本时出错。")
        print(f"原始错误：{exc}")


if __name__ == "__main__":
    main()
