"""
Day 10：本地 Ollama 参数实验脚本

今天这份脚本的学习重点不是“做一个复杂项目”，
而是通过一个非常具体的小实验，真正理解两个常见参数：

1. temperature
   这个参数主要影响“输出的随机性”。
   - 数值低：回答通常更稳、更保守、更像标准答案
   - 数值高：回答通常更活跃，但也更容易发散

2. max_tokens
   在 Ollama 里更常见的对应名字是 num_predict。
   它表示“本次最多允许模型生成多少个 token”。
   对初学者来说，可以先简单理解成：
   “它大致会影响回答能写多长”。

这份脚本会做什么：
1. 固定同一个任务不变
2. 只修改 temperature 和 max_tokens
3. 连续跑 3 组实验
4. 把结果打印到终端
5. 再保存成 Markdown，形成今天的实验记录

运行示例：
python3 code/day10_parameter_experiment.py
python3 code/day10_parameter_experiment.py "请写一段适合放在简历里的自我介绍，控制在 80 字以内。"

如果你已经拉好了更大的模型，也可以改下面这个默认模型名，例如：
- qwen3:8b
- qwen2.5-coder:7b
"""

from __future__ import annotations

import json
import socket
import sys
from pathlib import Path
from urllib import error, request


# 这里是本地 Ollama 服务的默认地址。
# 如果你没有额外改过配置，Ollama 通常就是监听这个端口。
OLLAMA_BASE_URL = "http://127.0.0.1:11434"

# 为了保证这份脚本“尽量开箱即用”，这里先用你本机已经安装过的小模型。
# 等你后面把 qwen3:8b 下载完成后，可以把这里改成 "qwen3:8b"。
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"

# 今天统一测试的任务。
# 这样做的目的是：确保我们对比时，变化来自“参数”，而不是“问题内容”。
DEFAULT_PROMPT = "请用中文写一段适合放在项目 README 里的自我介绍，控制在 80 字以内。"

# 这里预设三组实验参数。
# 初学阶段不建议一上来就测试十几组，
# 先用 3 组有明显差异的组合，最容易观察规律。
EXPERIMENTS = [
    {
        "name": "实验 1：低随机性 + 较短输出",
        "temperature": 0.2,
        "max_tokens": 40,
    },
    {
        "name": "实验 2：中等随机性 + 中等输出",
        "temperature": 0.7,
        "max_tokens": 80,
    },
    {
        "name": "实验 3：高随机性 + 更长输出",
        "temperature": 1.0,
        "max_tokens": 120,
    },
]


def get_prompt_text() -> str:
    """
    获取今天要测试的任务文本。

    为什么要单独写成一个函数？
    因为这样主流程会更清楚，也方便以后扩展。
    比如你以后想把输入改成：
    - 从文件读取
    - 从命令行读取
    - 从网页表单读取
    都可以只改这个函数。

    参数：
        无。

    返回：
        str:
        - 如果命令行里传了文本，就优先使用用户输入
        - 如果没有传，就使用脚本内置的默认任务
    """
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]).strip()

    return DEFAULT_PROMPT


def build_messages(task_text: str) -> list[dict[str, str]]:
    """
    构造要发送给模型的消息列表。

    对聊天模型来说，最常见的输入结构就是 messages。
    你可以先把它理解成“给模型看的对话记录”。

    这里我们只放两条消息：
    1. system：告诉模型应该扮演什么角色
    2. user：告诉模型现在具体要做什么任务

    参数：
        task_text: 本次实验统一使用的任务文本。

    返回：
        list[dict[str, str]]:
        一个消息列表，每一项都包含：
        - role：消息角色
        - content：消息内容
    """
    return [
        {
            "role": "system",
            "content": (
                "你是一个中文写作助手。"
                "请根据用户要求生成简洁、自然、适合展示的中文内容。"
                "如果用户要求控制字数，请尽量遵守。"
            ),
        },
        {
            "role": "user",
            "content": task_text,
        },
    ]


def build_payload(task_text: str, temperature: float, max_tokens: int) -> dict:
    """
    构造发送给本地 Ollama 的请求体。

    这里最值得关注的是两个位置：

    1. messages
       这里放的是模型真正看到的对话内容。

    2. options
       这里放的是一些控制生成行为的参数。
       在今天的实验里，我们只先关注两个：
       - temperature
       - num_predict

    为什么这里写 num_predict 而不是 max_tokens？
    因为我们前面学习时习惯叫 max_tokens，
    但 Ollama 在接口层更常用的字段名是 num_predict。
    为了帮助初学者建立映射关系，
    我们在代码外部继续用 max_tokens 这个更容易理解的名字，
    真正发请求时再转换成 num_predict。

    参数：
        task_text: 本轮实验的任务文本。
        temperature: 控制输出随机性的参数。
        max_tokens: 逻辑上表示“最大输出长度”，
            在发送给 Ollama 时会映射成 num_predict。

    返回：
        dict:
        一个可以直接发给 Ollama `/api/chat` 接口的字典。
    """
    return {
        "model": DEFAULT_MODEL_NAME,
        "messages": build_messages(task_text),
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }


def call_ollama_chat(payload: dict) -> dict:
    """
    调用本地 Ollama 聊天接口。

    这里使用的是 Python 标准库里的 urllib，
    好处是：初学阶段不需要额外安装第三方包，也能完成 HTTP 请求。

    参数：
        payload: 已经构造好的请求体字典。

    返回：
        dict:
        返回 Ollama 的 JSON 响应字典。

    异常说明：
        这个函数在失败时会抛出更容易读懂的 RuntimeError，
        方便初学者快速定位问题。
    """
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
            return json.loads(response_text)
    except error.HTTPError as exc:
        error_text = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Ollama 请求失败：{error_text or exc.reason}") from exc
    except error.URLError as exc:
        raise RuntimeError(
            "无法连接本地 Ollama 服务，请先确认 Ollama 已启动。"
        ) from exc
    except (TimeoutError, socket.timeout) as exc:
        raise RuntimeError("请求本地模型超时，请稍后重试。") from exc
    except json.JSONDecodeError as exc:
        raise RuntimeError("Ollama 返回结果不是合法 JSON。") from exc


def extract_content(data: dict | None) -> str:
    """
    从 Ollama 返回结果中提取模型正文。

    Ollama `/api/chat` 在非流式模式下，
    常见结构会长这样：

    {
      "message": {
        "role": "assistant",
        "content": "这里是真正的回答"
      }
    }

    参数：
        data: 接口返回的响应字典。

    返回：
        str:
        - 提取成功时，返回模型正文
        - 提取失败时，返回空字符串
    """
    if not data:
        return ""

    message = data.get("message", {})
    return message.get("content", "").strip()


def run_experiment(task_text: str, experiment: dict) -> dict:
    """
    执行一组参数实验。

    你可以把它理解成：
    “拿同一个问题，套用一组参数，跑一次，然后把结果整理好返回。”

    参数：
        task_text: 本轮统一测试的问题。
        experiment: 一组实验配置，通常包含：
            - name
            - temperature
            - max_tokens

    返回：
        dict:
        一个整理好的实验结果字典，里面包含：
        - name：实验名称
        - temperature：本轮温度
        - max_tokens：本轮最大输出长度
        - result：模型回答
        - error：如果调用失败，会把错误信息保存下来
    """
    print(f"正在执行：{experiment['name']}")

    payload = build_payload(
        task_text=task_text,
        temperature=experiment["temperature"],
        max_tokens=experiment["max_tokens"],
    )

    try:
        response_data = call_ollama_chat(payload)
        content = extract_content(response_data)
        error_message = ""
    except Exception as exc:
        content = ""
        error_message = str(exc)

    return {
        "name": experiment["name"],
        "temperature": experiment["temperature"],
        "max_tokens": experiment["max_tokens"],
        "result": content,
        "error": error_message,
    }


def print_results(task_text: str, results: list[dict]) -> None:
    """
    把实验结果打印到终端。

    参数：
        task_text: 本次实验统一使用的任务文本。
        results: 所有实验结果组成的列表。

    返回：
        None
    """
    print("今天测试的任务：")
    print(task_text)
    print(f"当前使用模型：{DEFAULT_MODEL_NAME}")
    print("\n" + "=" * 60)

    for item in results:
        print(item["name"])
        print(f"temperature: {item['temperature']}")
        print(f"max_tokens: {item['max_tokens']}")
        print("输出结果：")

        if item["result"]:
            print(item["result"])
        else:
            print("没有拿到可用结果。")
            if item["error"]:
                print(f"错误信息：{item['error']}")

        print("=" * 60)


def build_observation(results: list[dict]) -> list[str]:
    """
    根据实验结果生成一组基础观察结论。

    这里的结论不是“绝对正确的理论”，
    而是为了帮助初学者在第一次实验后有东西可总结。

    参数：
        results: 所有实验结果。

    返回：
        list[str]:
        一组适合写进 Markdown 里的观察结论。
    """
    observations = [
        "低 temperature 的输出通常更稳，更接近常规答案。",
        "高 temperature 的输出通常更活跃，但也更容易发散。",
        "max_tokens 越大，模型通常越有空间生成更长的内容。",
    ]

    if any(not item["result"] for item in results):
        observations.append("如果某一组没有结果，先检查本地模型、Ollama 服务状态和参数设置。")

    return observations


def build_report_markdown(task_text: str, results: list[dict]) -> str:
    """
    把实验结果整理成 Markdown 文本。

    为什么要单独保存成 Markdown？
    因为这样今天的学习不会只停留在“我跑过一次”，
    而是会留下一个可展示、可复盘、可回看的产出。

    参数：
        task_text: 本次实验的统一任务文本。
        results: 所有实验结果。

    返回：
        str:
        可直接写入 `.md` 文件的 Markdown 内容。
    """
    lines = [
        "# Day 10 参数实验记录",
        "",
        "## 使用模型",
        DEFAULT_MODEL_NAME,
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

        if item["error"]:
            lines.extend(
                [
                    "",
                    f"- 错误信息：{item['error']}",
                ]
            )

    lines.extend(
        [
            "",
            "## 我的观察",
        ]
    )

    for observation in build_observation(results):
        lines.append(f"- {observation}")

    return "\n".join(lines)


def save_report(markdown_text: str, output_path: Path) -> None:
    """
    把实验记录保存成 Markdown 文件。

    参数：
        markdown_text: 已经整理好的 Markdown 内容。
        output_path: 输出文件路径。

    返回：
        None
    """
    output_path.write_text(markdown_text, encoding="utf-8")


def check_ollama_model_exists(model_name: str) -> bool:
    """
    检查目标模型是否已经存在于本地 Ollama 中。

    这里为什么要提前检查？
    因为对初学者来说，
    “模型没下载”是一个非常常见、但也非常容易忽略的问题。
    先检查一次，可以让报错更友好。

    参数：
        model_name: 要检查的模型名。

    返回：
        bool:
        - True：本地已存在
        - False：本地不存在
    """
    endpoint = f"{OLLAMA_BASE_URL}/api/tags"
    http_request = request.Request(endpoint, method="GET")

    try:
        with request.urlopen(http_request, timeout=30) as response:
            response_text = response.read().decode("utf-8")
            data = json.loads(response_text)
    except Exception:
        return False

    models = data.get("models", [])
    model_names = [item.get("name", "") for item in models]
    return model_name in model_names


def main() -> None:
    """
    程序入口。

    主流程如下：
    1. 获取今天要测试的任务文本
    2. 检查本地 Ollama 模型是否存在
    3. 按预设参数组合逐组实验
    4. 打印实验结果
    5. 保存 Markdown 实验记录
    """
    task_text = get_prompt_text()

    if not check_ollama_model_exists(DEFAULT_MODEL_NAME):
        print(f"本地没有找到模型：{DEFAULT_MODEL_NAME}")
        print("请先执行以下命令之一：")
        print(f"ollama pull {DEFAULT_MODEL_NAME}")
        print("或者把脚本里的 DEFAULT_MODEL_NAME 改成你本机已经安装的模型。")
        return

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
