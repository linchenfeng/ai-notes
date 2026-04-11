"""
Day 14：本地 AI 文本助手（阶段整合版）

今天的目标是把 Day 8~13 的核心能力整合到一个可运行工具里。

这个脚本提供 6 个功能入口：
1. 基础问答（Day 8）
2. 文本润色（Day 9）
3. 参数实验（Day 10）
4. 结构化提取为 JSON（Day 11）
5. Prompt 对比总结（Day 12）
6. 3 轮上下文聊天（Day 13）

运行示例：
python3 code/day14_local_ai_text_assistant.py
"""

from __future__ import annotations

import json
import socket
from pathlib import Path
from urllib import error, request

from tool import get_completion


# 默认模型使用本机已安装版本，保证脚本开箱可运行。
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"
OLLAMA_BASE_URL = "http://127.0.0.1:11434"


def show_menu() -> None:
    """
    打印主菜单。
    """
    print("\n" + "=" * 60)
    print("Day 14 本地 AI 文本助手")
    print("=" * 60)
    print("1. 基础问答（Day 8）")
    print("2. 文本润色（Day 9）")
    print("3. 参数实验（Day 10）")
    print("4. 结构化提取为 JSON（Day 11）")
    print("5. Prompt 对比总结（Day 12）")
    print("6. 3 轮上下文聊天（Day 13）")
    print("0. 退出")


def run_basic_qa() -> None:
    """
    功能 1：基础问答。
    """
    question = input("请输入你的问题：").strip()
    if not question:
        print("问题不能为空。")
        return

    answer = get_completion(
        prompt=question,
        system_prompt="你是一个简洁、准确的中文助手。",
        model_name=DEFAULT_MODEL_NAME,
        temperature=0.4,
    )
    print("\n模型回答：")
    print(answer)


def run_polish_text() -> None:
    """
    功能 2：文本润色。
    """
    text = input("请输入你要润色的文本：").strip()
    if not text:
        print("文本不能为空。")
        return

    prompt = (
        "请在不改变原意的前提下润色下面文本，让表达更自然清晰，"
        "输出只保留润色后的正文：\n"
        f"{text}"
    )
    result = get_completion(
        prompt=prompt,
        system_prompt="你是一个中文文本润色助手。",
        model_name=DEFAULT_MODEL_NAME,
        temperature=0.5,
    )
    print("\n润色结果：")
    print(result)


def run_parameter_experiment() -> None:
    """
    功能 3：参数实验（简化版）。

    这里固定同一个任务，改变 temperature，
    让你快速看到参数变化带来的输出差异。
    """
    task = input("请输入要测试的任务（直接回车使用默认任务）：").strip()
    if not task:
        task = "请写一段适合放在简历里的自我介绍，控制在 80 字以内。"

    temperatures = [0.2, 0.7, 1.0]
    print("\n参数实验结果：")

    for t in temperatures:
        output = get_completion(
            prompt=task,
            system_prompt="你是一个中文写作助手。",
            model_name=DEFAULT_MODEL_NAME,
            temperature=t,
        )
        print("\n" + "-" * 40)
        print(f"temperature = {t}")
        print(output)


def extract_json_text(raw_text: str) -> str:
    """
    从模型原始输出中提取 JSON 文本。
    """
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return raw_text.strip()
    return raw_text[start : end + 1].strip()


def run_extract_json() -> None:
    """
    功能 4：结构化提取 JSON。
    """
    text = input("请输入待提取文本：").strip()
    if not text:
        print("输入不能为空。")
        return

    prompt = f"""
请从下面文本提取信息，并只输出合法 JSON。
JSON 字段固定为：name, city, profession, need。
没有信息的字段填空字符串。

文本：
{text}
""".strip()

    raw = get_completion(
        prompt=prompt,
        system_prompt="你是信息抽取助手，只输出 JSON。",
        model_name=DEFAULT_MODEL_NAME,
        temperature=0.2,
    )

    json_text = extract_json_text(raw)
    try:
        data = json.loads(json_text)
    except json.JSONDecodeError:
        print("\n模型原始输出：")
        print(raw)
        print("\n解析失败：模型输出不是合法 JSON。")
        return

    normalized = {
        "name": str(data.get("name", "")).strip(),
        "city": str(data.get("city", "")).strip(),
        "profession": str(data.get("profession", "")).strip(),
        "need": str(data.get("need", "")).strip(),
    }

    print("\n提取结果：")
    print(json.dumps(normalized, ensure_ascii=False, indent=2))


def run_prompt_compare() -> None:
    """
    功能 5：Prompt 对比总结（简化版）。
    """
    article = input("请输入待总结文章（建议 100~300 字）：").strip()
    if not article:
        print("文章不能为空。")
        return

    prompts = [
        {
            "name": "版本 1：基础提示",
            "text": f"请总结这段文章：{article}",
        },
        {
            "name": "版本 2：角色+限制",
            "text": (
                "你是项目复盘助手。"
                "请用 80~120 字中文总结下面文章，语气专业，不能添加原文没有的信息。\n"
                f"{article}"
            ),
        },
        {
            "name": "版本 3：结构化格式",
            "text": (
                "请按以下三行格式输出总结：\n"
                "背景：...\n关键动作：...\n结果：...\n"
                "每行不超过 40 字。\n"
                f"文章：{article}"
            ),
        },
    ]

    lines = [
        "# Day 14 Prompt 对比记录",
        "",
        "## 原文",
        article,
        "",
    ]

    for item in prompts:
        output = get_completion(
            prompt=item["text"],
            system_prompt="你是一个可靠的中文总结助手。",
            model_name=DEFAULT_MODEL_NAME,
            temperature=0.3,
        )
        print("\n" + "-" * 40)
        print(item["name"])
        print(output)

        lines.extend(
            [
                f"## {item['name']}",
                "",
                "### Prompt",
                "```text",
                item["text"],
                "```",
                "",
                "### 输出",
                "```text",
                output,
                "```",
                "",
            ]
        )

    output_path = Path("code/day14_prompt_compare.md")
    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nPrompt 对比已保存：{output_path}")


def call_ollama_chat(messages: list[dict[str, str]]) -> str:
    """
    直接调用 Ollama 聊天接口（用于多轮记忆聊天）。
    """
    payload = {
        "model": DEFAULT_MODEL_NAME,
        "messages": messages,
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
        raise RuntimeError("无法连接本地 Ollama 服务。") from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("请求超时。") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("返回结果不是合法 JSON。") from exc

    content = data.get("message", {}).get("content", "").strip()
    if not content:
        raise RuntimeError("模型返回为空。")
    return content


def keep_last_rounds(messages: list[dict[str, str]], max_rounds: int) -> list[dict[str, str]]:
    """
    只保留最近 max_rounds 轮 user/assistant 对话，system 始终保留。
    """
    system_messages = [m for m in messages if m.get("role") == "system"]
    dialog_messages = [m for m in messages if m.get("role") in {"user", "assistant"}]
    return system_messages + dialog_messages[-max_rounds * 2 :]


def run_memory_chat() -> None:
    """
    功能 6：3 轮上下文聊天。
    """
    print("\n进入 3 轮上下文聊天模式。")
    print("你可以连续输入 3 个问题，我会带着上下文回答。")

    messages: list[dict[str, str]] = [
        {
            "role": "system",
            "content": "你是一个耐心的中文学习助手，回答简洁清晰。",
        }
    ]

    for round_index in range(1, 4):
        user_text = input(f"\n第 {round_index} 轮，请输入：").strip()
        if not user_text:
            print("输入为空，跳过本轮。")
            continue

        messages.append({"role": "user", "content": user_text})
        answer = call_ollama_chat(messages)
        messages.append({"role": "assistant", "content": answer})

        # 保留最近 3 轮上下文。
        messages = keep_last_rounds(messages, max_rounds=3)

        print("助手：")
        print(answer)

    print("\n3 轮上下文聊天结束。")


def main() -> None:
    """
    程序入口：循环显示菜单，直到用户选择退出。
    """
    print(f"当前默认模型：{DEFAULT_MODEL_NAME}")

    while True:
        show_menu()
        choice = input("请输入功能编号：").strip()

        try:
            if choice == "1":
                run_basic_qa()
            elif choice == "2":
                run_polish_text()
            elif choice == "3":
                run_parameter_experiment()
            elif choice == "4":
                run_extract_json()
            elif choice == "5":
                run_prompt_compare()
            elif choice == "6":
                run_memory_chat()
            elif choice == "0":
                print("已退出 Day 14 本地 AI 文本助手。")
                break
            else:
                print("无效编号，请输入 0~6。")
        except Exception as exc:
            print("执行功能时出错。")
            print(f"原始错误：{exc}")


if __name__ == "__main__":
    main()
