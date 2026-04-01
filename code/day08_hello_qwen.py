"""
Day 8：第一次用 Python 调云端 Qwen

这个脚本的目标很简单：
1. 学会使用阿里百炼 API Key 调用云端 Qwen
2. 让云端 Qwen 返回一句回答
3. 把结果打印到终端

运行前请先确认两件事：
1. 你已经在阿里百炼控制台创建了 API Key
2. 你已经在环境变量里配置了 DASHSCOPE_API_KEY

运行示例：
source ~/.zshrc
python3 code/day08_hello_qwen.py
"""

from __future__ import annotations

import json

from bailian_client import (
    DEFAULT_MODEL_NAME,
    build_chat_payload,
    call_chat_api,
    extract_chat_content,
    get_api_key,
)


def build_messages() -> list[dict[str, str]]:
    """
    构造发送给云端 Qwen 的消息列表。

    参数：
        无。
        Day 8 先固定写死最小示例消息，目的是帮助初学者先跑通第一次线上调用。

    返回：
        list[dict[str, str]]:
        一个符合聊天接口格式的消息列表。
        每一项都包含：
        - role: 消息角色，比如 system 或 user
        - content: 对应消息的文本内容
    """
    return [
        {
            "role": "system",
            "content": "你是一个简洁、友好的中文学习助手。",
        },
        {
            "role": "user",
            "content": "请用三句话向初学者介绍 Python 为什么适合学习 LLM 开发。",
        },
    ]


def build_payload() -> dict:
    """
    构造发送给阿里百炼的请求体。

    参数：
        无。
        这个函数会直接组合模型名称、消息列表和基础参数。

    返回：
        dict:
        一个可直接发送给阿里百炼聊天接口的 Python 字典。
    """
    return build_chat_payload(
        messages=build_messages(),
        model_name=DEFAULT_MODEL_NAME,
        temperature=0.7,
    )


def print_result(content: str, raw_data: dict | None) -> None:
    """
    打印模型结果。

    参数：
        content: 已经从返回结果里提取出的模型正文。
        raw_data: 接口返回的完整原始数据。
        如果没有成功提取到 content，可以用 raw_data 排查问题。

    返回：
        None
        这个函数只负责把信息打印到终端。
    """
    if content:
        print("Qwen 的回答：")
        print(content)
        return

    print("接口调用成功，但没有提取到可用内容。")
    if raw_data:
        print("完整返回数据如下：")
        print(json.dumps(raw_data, ensure_ascii=False, indent=2))


def main() -> None:
    """
    程序入口。

    主流程如下：
    1. 读取 API Key
    2. 构造请求体
    3. 调用阿里百炼云端模型
    4. 提取并打印模型回答
    """
    api_key = get_api_key()
    if not api_key:
        print("没有读取到 DASHSCOPE_API_KEY。")
        print("请先在终端里配置环境变量，例如：")
        print('export DASHSCOPE_API_KEY="sk-你的百炼密钥"')
        return

    print("开始请求阿里百炼云端 Qwen 模型...")
    payload = build_payload()
    raw_data = call_chat_api(api_key, payload)
    content = extract_chat_content(raw_data)
    print_result(content, raw_data)


if __name__ == "__main__":
    main()
