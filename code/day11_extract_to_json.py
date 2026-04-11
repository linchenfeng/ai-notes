"""
Day 11：把文本提取成固定 JSON

今天的核心目标是理解“结构化输出”。

什么叫结构化输出？
你可以先把它理解成：
不是让模型随便回答一大段话，
而是要求它按照我们规定好的字段格式返回结果。

比如今天我们希望模型输出这样的 JSON：

{
  "name": "张三",
  "city": "上海",
  "profession": "产品经理",
  "need": "想学习 Python 和大模型开发"
}

这样做的好处是：
1. 后续程序更容易继续处理
2. 不需要再从一大段自然语言里手动找信息
3. 这是以后做 RAG、工具调用、工作流编排时非常常见的基础能力

运行示例：
python3 code/day11_extract_to_json.py
python3 code/day11_extract_to_json.py "我叫李明，现在在杭州做后端开发，最近想系统学习大模型应用开发。"
"""

from __future__ import annotations

import json
import sys

from tool import get_completion


# 为了保证这份脚本在你当前机器上尽量直接可运行，
# 这里先使用你已经安装好的本地模型。
# 如果你后面已经安装了更强一点的模型，也可以改成：
# - qwen3:8b
# - qwen2.5-coder:7b
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"

# 这里是一段默认测试文本。
# 如果用户没有从命令行传入文本，程序就用这段内容做演示。
DEFAULT_TEXT = (
    "我叫王小雨，住在上海，目前是一名前端开发工程师。"
    "我最近想学习 Python、Prompt 工程和本地大模型部署。"
)


def get_input_text() -> str:
    """
    获取要提取信息的原始文本。

    为什么要单独写成函数？
    因为这样主流程会更清楚，
    以后如果你想把输入来源改成文件、网页表单或数据库，
    只需要改这里，不需要动后面的提取逻辑。

    参数：
        无。

    返回：
        str:
        - 如果命令行里传了文本，就优先使用命令行参数
        - 如果没有传，就使用脚本里的默认测试文本
    """
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]).strip()

    return DEFAULT_TEXT


def build_extraction_prompt(text: str) -> str:
    """
    构造发给模型的用户提示词。

    这一步非常关键。
    因为“结构化输出”并不是模型天然一定会做好的事情，
    我们通常要明确告诉模型：
    1. 你要抽取哪些字段
    2. 输出必须是什么格式
    3. 如果没有信息，要怎么填

    这里我们要求模型严格返回 JSON，
    并且固定只包含这 4 个字段：
    - name
    - city
    - profession
    - need

    参数：
        text: 用户提供的原始自然语言文本。

    返回：
        str:
        一段清晰的提取任务提示词。
    """
    return f"""
请从下面这段中文文本中提取信息，并严格输出为 JSON。

要求：
1. 只能输出 JSON，不要输出解释，不要输出 Markdown 代码块。
2. JSON 必须包含以下 4 个字段：
   - name
   - city
   - profession
   - need
3. 如果某个字段没有明确提到，请填空字符串。
4. 输出必须是合法 JSON。

待提取文本：
{text}
""".strip()


def build_system_prompt() -> str:
    """
    构造系统提示词。

    system prompt 的作用是先给模型设定一个稳定角色。
    今天我们让它扮演“信息抽取助手”，
    并且反复强调：
    - 只输出 JSON
    - 不要额外解释

    参数：
        无。

    返回：
        str:
        适合做结构化抽取任务的系统提示词。
    """
    return (
        "你是一个信息抽取助手。"
        "你的任务是从用户提供的中文文本中提取固定字段。"
        "你必须只返回合法 JSON，不能返回解释、标题、代码块或额外文字。"
    )


def extract_json_text(raw_text: str) -> str:
    """
    从模型原始输出中尽量提取出 JSON 字符串。

    为什么需要这一步？
    因为小模型有时不够稳定，
    即使我们已经明确要求“只输出 JSON”，
    它仍然可能多输出一点说明文字，
    或者把 JSON 包在别的内容里面。

    所以这里做一个简单容错：
    - 找到第一个 `{`
    - 找到最后一个 `}`
    - 把中间这一段切出来

    注意：
    这不是最完美的方法，
    但对 Day 11 这种初学阶段来说已经足够实用。

    参数：
        raw_text: 模型返回的原始文本。

    返回：
        str:
        尽量提取出的 JSON 字符串。
        如果没找到花括号，就原样返回。
    """
    start = raw_text.find("{")
    end = raw_text.rfind("}")

    if start == -1 or end == -1 or end < start:
        return raw_text.strip()

    return raw_text[start : end + 1].strip()


def parse_extracted_json(raw_text: str) -> dict:
    """
    把模型输出解析成 Python 字典。

    主流程分两步：
    1. 先用 extract_json_text() 做一次简单清洗
    2. 再用 json.loads() 把 JSON 字符串转成 Python 字典

    这里还有一个很重要的动作：
    即使模型返回了 JSON，我们也会重新整理字段，
    确保最后一定只保留 Day 11 规定的 4 个字段。

    参数：
        raw_text: 模型返回的原始文本。

    返回：
        dict:
        包含固定字段的 Python 字典。

    异常：
        如果模型输出不是合法 JSON，就抛出 ValueError。
    """
    json_text = extract_json_text(raw_text)

    try:
        parsed_data = json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise ValueError("模型返回内容不是合法 JSON，暂时无法解析。") from exc

    return {
        "name": str(parsed_data.get("name", "")).strip(),
        "city": str(parsed_data.get("city", "")).strip(),
        "profession": str(parsed_data.get("profession", "")).strip(),
        "need": str(parsed_data.get("need", "")).strip(),
    }


def run_extraction(text: str) -> tuple[str, dict]:
    """
    调用本地模型执行信息抽取。

    这一步会：
    1. 构造 system prompt
    2. 构造 user prompt
    3. 调用 get_completion()
    4. 把返回结果解析成字典

    参数：
        text: 待提取的原始文本。

    返回：
        tuple[str, dict]:
        - 第一个值是模型原始输出文本
        - 第二个值是解析后的 Python 字典
    """
    raw_response = get_completion(
        prompt=build_extraction_prompt(text),
        system_prompt=build_system_prompt(),
        model_name=DEFAULT_MODEL_NAME,
        temperature=0.2,
    )
    parsed_data = parse_extracted_json(raw_response)
    return raw_response, parsed_data


def print_result(original_text: str, raw_response: str, parsed_data: dict) -> None:
    """
    把结果打印到终端。

    为什么这里要同时打印“原始输出”和“解析后的结果”？
    因为 Day 11 的重点不仅是“最后拿到字典”，
    还要帮助你看清楚：
    - 模型原始到底说了什么
    - 程序最终又是如何把它变成结构化数据的

    参数：
        original_text: 原始输入文本。
        raw_response: 模型原始输出文本。
        parsed_data: 解析后的结构化结果。

    返回：
        None
    """
    print("原始文本：")
    print(original_text)

    print("\n模型原始输出：")
    print(raw_response)

    print("\n解析后的 JSON：")
    print(json.dumps(parsed_data, ensure_ascii=False, indent=2))


def main() -> None:
    """
    程序入口。

    主流程如下：
    1. 获取输入文本
    2. 调用模型做结构化抽取
    3. 解析 JSON
    4. 打印结果

    如果中间出错，就把错误信息打印出来，
    方便初学者知道问题出在哪一步。
    """
    text = get_input_text()

    if not text:
        print("输入文本不能为空。")
        return

    try:
        raw_response, parsed_data = run_extraction(text)
    except Exception as exc:
        print("执行结构化抽取时出错。")
        print(f"原始错误：{exc}")
        return

    print_result(text, raw_response, parsed_data)


if __name__ == "__main__":
    main()
