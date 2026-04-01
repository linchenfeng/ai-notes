"""
Day 10：参数实验脚本

今天的目标是对比同一个任务在不同参数下的输出差异。
这里我们重点观察两个参数：
1. temperature：控制回答的随机性和发散程度
2. max_tokens：控制模型最多生成多少个 token

运行示例：
source ~/.zshrc
python3 code/day10_parameter_experiment.py
python3 code/day10_parameter_experiment.py "请帮我写一段简短的自我介绍，风格专业一点。"
"""

from __future__ import annotations

import sys
from pathlib import Path

from bailian_client import (
    DEFAULT_MODEL_NAME,
    build_chat_payload,
    call_chat_api,
    extract_chat_content,
    get_api_key,
)

# 这里是今天统一测试的默认任务。
# 如果你在命令行里额外传入一句文本，程序会优先使用你传入的内容。
DEFAULT_PROMPT = "请用中文写一段适合放在项目 README 里的自我介绍，控制在 80 字以内。"

# 这里定义今天要测试的参数组合。
# name 只是为了让实验结果更容易看懂。
EXPERIMENTS = [
    {
        "name": "实验 1：低随机性 + 较短输出",
        "temperature": 0.2,
        "max_tokens": 40,
    },
    {
        "name": "实验 2：中等随机性 + 中等输出",
        "temperature": 0.7,
        "max_tokens": 60,
    },
    {
        "name": "实验 3：高随机性 + 更长输出",
        "temperature": 1.0,
        "max_tokens": 90,
    },
]


def get_prompt_text() -> str:
    """
    获取今天要拿来做参数实验的原始任务。

    参数：
        无。
        这个函数直接从命令行参数里读取用户输入。

    返回：
        str:
        - 如果用户在运行命令时传入了文本，就返回那段文本
        - 如果用户没有传入文本，就返回脚本内置的 DEFAULT_PROMPT
    """
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]).strip()

    return DEFAULT_PROMPT


def build_messages(task_text: str) -> list[dict[str, str]]:
    """
    构造发送给模型的消息列表。

    参数：
        task_text: 今天要测试的任务文本。
        比如“请写一段自我介绍”或“请总结下面这段话”。
        这段文本会被放进 user prompt，要求模型去处理。

    返回：
        list[dict[str, str]]:
        一个符合聊天接口格式的消息列表。
        其中：
        - system 负责规定模型角色和输出风格
        - user 负责给出具体任务
    """
    return [
        {
            "role": "system",
            "content": (
                "你是一个中文写作助手。"
                "请根据用户要求生成简洁、自然、适合展示的中文内容。"
            ),
        },
        {
            "role": "user",
            "content": task_text,
        },
    ]


def build_payload(task_text: str, temperature: float, max_tokens: int) -> dict:
    """
    组装发送给阿里百炼的请求体。

    参数：
        task_text: 本次实验要执行的任务文本。
        temperature: 采样温度，数值越高，输出通常越发散；
            数值越低，输出通常越稳定。
        max_tokens: 最多生成多少个 token。
            在阿里百炼兼容接口里，这个参数常用来控制输出长度。

    返回：
        dict:
        一个可直接发送给阿里百炼聊天接口的 Python 字典。
    """
    return build_chat_payload(
        messages=build_messages(task_text),
        model_name=DEFAULT_MODEL_NAME,
        temperature=temperature,
        max_tokens=max_tokens,
    )

def extract_content(data: dict | None) -> str:
    """
    从模型返回结果里提取正文内容。

    参数：
        data: 阿里百炼返回的响应字典。
        如果请求失败，这里可能是 None。

    返回：
        str:
        - 成功时返回模型回答内容
        - 失败时返回空字符串
    """
    return extract_chat_content(data)


def run_experiment(task_text: str, experiment: dict) -> dict:
    """
    执行单组参数实验。

    参数：
        task_text: 本轮实验的任务文本。
        experiment: 单组实验配置字典。
        里面至少包含：
        - name: 实验名称
        - temperature: 本轮温度
        - max_tokens: 本轮最大生成长度

    返回：
        dict:
        返回整理好的实验结果，方便后续打印和写入 Markdown。
    """
    print(f"正在执行：{experiment['name']}")
    payload = build_payload(
        task_text=task_text,
        temperature=experiment["temperature"],
        max_tokens=experiment["max_tokens"],
    )
    api_key = get_api_key()
    response_data = call_chat_api(api_key, payload)
    content = extract_content(response_data)

    return {
        "name": experiment["name"],
        "temperature": experiment["temperature"],
        "max_tokens": experiment["max_tokens"],
        "result": content,
    }


def print_results(task_text: str, results: list[dict]) -> None:
    """
    把实验结果打印到终端。

    参数：
        task_text: 本次统一测试的任务文本。
        results: 所有实验结果组成的列表。
        列表里的每一项都是 run_experiment() 返回的结果字典。

    返回：
        None
    """
    print("今天测试的任务：")
    print(task_text)
    print("\n" + "=" * 50)

    for item in results:
        print(item["name"])
        print(f"temperature: {item['temperature']}")
        print(f"max_tokens: {item['max_tokens']}")
        print("输出结果：")
        print(item["result"] or "没有拿到可用结果。")
        print("=" * 50)


def build_report_markdown(task_text: str, results: list[dict]) -> str:
    """
    把实验结果整理成 Markdown 文本。

    参数：
        task_text: 本次实验统一使用的任务文本。
        results: 所有实验结果组成的列表。

    返回：
        str:
        一段可直接写入 .md 文件的 Markdown 内容。
    """
    lines = [
        "# Day 10 参数实验记录",
        "",
        "## 测试任务",
        task_text,
        "",
        "## 实验结果",
    ]

    for item in results:
        lines.extend(
            [
                "",
                f"### {item['name']}",
                f"- temperature: {item['temperature']}",
                f"- max_tokens: {item['max_tokens']}",
                "- 输出结果：",
                "",
                item["result"] or "没有拿到可用结果。",
            ]
        )

    lines.extend(
        [
            "",
            "## 我的观察",
            "- 低 temperature 的输出通常更稳，更接近常规答案。",
            "- 高 temperature 的输出通常更活跃，但也更容易发散。",
            "- max_tokens 越大，模型通常越容易生成更长内容。",
        ]
    )

    return "\n".join(lines)


def save_report(markdown_text: str, output_path: Path) -> None:
    """
    把实验记录保存成 Markdown 文件。

    参数：
        markdown_text: 已经整理好的 Markdown 内容。
        output_path: 输出文件路径。
        例如：Path(\"code/day10_parameter_report.md\")

    返回：
        None
    """
    output_path.write_text(markdown_text, encoding="utf-8")


def main() -> None:
    """
    程序入口。

    主流程如下：
    1. 获取今天统一测试的任务文本
    2. 检查阿里百炼 API Key 是否可用
    3. 按预设参数组合逐个调用云端模型
    4. 打印实验结果
    5. 保存为 Markdown 记录
    """
    api_key = get_api_key()
    if not api_key:
        print("没有读取到 DASHSCOPE_API_KEY。")
        print("请先执行：source ~/.zshrc")
        return

    task_text = get_prompt_text()
    results: list[dict] = []

    for experiment in EXPERIMENTS:
        results.append(run_experiment(task_text, experiment))

    print_results(task_text, results)

    report_text = build_report_markdown(task_text, results)
    output_path = Path("code/day10_parameter_report.md")
    save_report(report_text, output_path)
    print(f"\n实验记录已保存到：{output_path}")


if __name__ == "__main__":
    main()
