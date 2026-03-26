"""
Day 10：参数实验脚本

今天的目标是对比同一个任务在不同参数下的输出差异。
这里我们重点观察两个参数：
1. temperature：控制回答的随机性和发散程度
2. num_predict：控制模型最多生成多少个 token

运行示例：
python3 code/day10_parameter_experiment.py
python3 code/day10_parameter_experiment.py "请帮我写一段简短的自我介绍，风格专业一点。"
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib import error, request


# 继续使用本机已经存在的本地 Qwen 模型。
MODEL_NAME = "qwen2.5:0.5b"
OLLAMA_URL = "http://localhost:11434/api/chat"

# 这里是今天统一测试的默认任务。
# 如果你在命令行里额外传入一句文本，程序会优先使用你传入的内容。
DEFAULT_PROMPT = "请用中文写一段适合放在项目 README 里的自我介绍，控制在 80 字以内。"

# 这里定义今天要测试的参数组合。
# name 只是为了让实验结果更容易看懂。
EXPERIMENTS = [
    {
        "name": "实验 1：低随机性 + 较短输出",
        "temperature": 0.2,
        "num_predict": 80,
    },
    {
        "name": "实验 2：中等随机性 + 中等输出",
        "temperature": 0.7,
        "num_predict": 120,
    },
    {
        "name": "实验 3：高随机性 + 更长输出",
        "temperature": 1.0,
        "num_predict": 180,
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


def build_payload(task_text: str, temperature: float, num_predict: int) -> dict:
    """
    组装发送给 Ollama 的请求体。

    参数：
        task_text: 本次实验要执行的任务文本。
        temperature: 采样温度，数值越高，输出通常越发散；
            数值越低，输出通常越稳定。
        num_predict: 最多生成多少个 token。
            在 Ollama 里，这个参数常用来控制输出长度。

    返回：
        dict:
        一个可直接发送给 Ollama /api/chat 的 Python 字典。
    """
    return {
        "model": MODEL_NAME,
        "messages": build_messages(task_text),
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": num_predict,
        },
    }


def call_ollama(payload: dict) -> dict | None:
    """
    向本地 Ollama 发送请求。

    参数：
        payload: 要发送的请求体字典。
        通常由 build_payload() 构造，里面会包含 model、messages 和 options。

    返回：
        dict | None:
        - 请求成功时，返回解析后的 JSON 字典
        - 请求失败或解析失败时，返回 None
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
    从模型返回结果里提取正文内容。

    参数：
        data: Ollama 返回的响应字典。
        如果请求失败，这里可能是 None。

    返回：
        str:
        - 成功时返回模型回答内容
        - 失败时返回空字符串
    """
    if not data:
        return ""

    message = data.get("message", {})
    return message.get("content", "").strip()


def run_experiment(task_text: str, experiment: dict) -> dict:
    """
    执行单组参数实验。

    参数：
        task_text: 本轮实验的任务文本。
        experiment: 单组实验配置字典。
        里面至少包含：
        - name: 实验名称
        - temperature: 本轮温度
        - num_predict: 本轮最大生成长度

    返回：
        dict:
        返回整理好的实验结果，方便后续打印和写入 Markdown。
    """
    payload = build_payload(
        task_text=task_text,
        temperature=experiment["temperature"],
        num_predict=experiment["num_predict"],
    )
    response_data = call_ollama(payload)
    content = extract_content(response_data)

    return {
        "name": experiment["name"],
        "temperature": experiment["temperature"],
        "num_predict": experiment["num_predict"],
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
        print(f"num_predict: {item['num_predict']}")
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
                f"- num_predict: {item['num_predict']}",
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
            "- num_predict 越大，模型通常越容易生成更长内容。",
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
    2. 按预设参数组合逐个调用本地模型
    3. 打印实验结果
    4. 保存为 Markdown 记录
    """
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
