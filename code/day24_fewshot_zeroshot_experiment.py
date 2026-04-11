"""
Day 24：few-shot vs zero-shot 对比实验

今日目标：
对比同一任务在 zero-shot 和 few-shot 下的效果差异。

实验任务：
把用户反馈文本分类为：
- positive
- neutral
- negative

输出要求：
只输出 JSON，包含三个字段：
{
  "label": "...",
  "reason": "...",
  "confidence": 0.0
}

运行方式：
python3 code/day24_fewshot_zeroshot_experiment.py
"""

from __future__ import annotations

import json
from pathlib import Path

from tool import get_completion


# 这里优先使用你当前机器稳定可用的小模型，方便快速跑通实验。
MODEL_NAME = "qwen2.5:0.5b"

TEST_SAMPLES = [
    "这个功能太好用了，界面也很顺手，我愿意推荐给同事。",
    "还可以吧，能用，但是速度一般，没有特别惊喜。",
    "这次更新之后经常报错，操作还卡顿，体验很差。",
]


def build_zero_shot_prompt(text: str) -> str:
    """
    zero-shot：只给任务说明，不给示例。
    """
    return f"""
请完成情感分类任务。

可选标签只有三个：
- positive
- neutral
- negative

输出要求：
1. 只输出 JSON，不要输出解释文字。
2. JSON 必须包含字段：label, reason, confidence。
3. confidence 为 0~1 的小数。

待分类文本：
{text}
""".strip()


def build_few_shot_prompt(text: str) -> str:
    """
    few-shot：给任务说明 + 少量示例，帮助模型对齐输出风格和判断标准。
    """
    return f"""
请完成情感分类任务。

可选标签只有三个：
- positive
- neutral
- negative

下面是示例：
示例1：
文本：这个产品非常好用，效率提升明显，我很满意。
输出：{{"label":"positive","reason":"明确表达满意与正向评价","confidence":0.93}}

示例2：
文本：一般般吧，能完成基本需求，但没有太多亮点。
输出：{{"label":"neutral","reason":"评价中性，既有可用性也有保留","confidence":0.72}}

示例3：
文本：体验很糟糕，经常崩溃，完全不想再用。
输出：{{"label":"negative","reason":"明确表达强烈负面体验","confidence":0.96}}

输出要求：
1. 只输出 JSON，不要输出解释文字。
2. JSON 必须包含字段：label, reason, confidence。
3. confidence 为 0~1 的小数。

待分类文本：
{text}
""".strip()


def extract_json_text(raw_text: str) -> str:
    """
    从模型原始输出中提取 JSON 片段。
    """
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return raw_text.strip()
    return raw_text[start : end + 1].strip()


def parse_output(raw_text: str) -> dict:
    """
    尝试把模型输出解析为结构化字典。
    """
    json_text = extract_json_text(raw_text)
    try:
        data = json.loads(json_text)
    except json.JSONDecodeError:
        return {
            "label": "",
            "reason": "",
            "confidence": "",
            "raw": raw_text,
            "valid_json": False,
        }

    return {
        "label": str(data.get("label", "")).strip(),
        "reason": str(data.get("reason", "")).strip(),
        "confidence": data.get("confidence", ""),
        "raw": raw_text,
        "valid_json": True,
    }


def run_single(text: str, mode: str) -> dict:
    """
    执行单次实验（zero-shot 或 few-shot）。
    """
    if mode == "zero-shot":
        prompt = build_zero_shot_prompt(text)
    else:
        prompt = build_few_shot_prompt(text)

    try:
        raw = get_completion(
            prompt=prompt,
            system_prompt="你是一个严格按格式输出的中文分类助手。",
            model_name=MODEL_NAME,
            temperature=0.2,
        )
        parsed = parse_output(raw)
        parsed["error"] = ""
    except Exception as exc:
        parsed = {
            "label": "",
            "reason": "",
            "confidence": "",
            "raw": "",
            "valid_json": False,
            "error": str(exc),
        }

    return {
        "mode": mode,
        "input": text,
        "prompt": prompt,
        "result": parsed,
    }


def build_markdown(results: list[dict]) -> str:
    """
    生成 Day24 实验记录 Markdown。
    """
    lines = [
        "# Day 24 实验记录：few-shot vs zero-shot",
        "",
        "## 实验目标",
        "对比同一任务在 zero-shot 与 few-shot 下的输出差异。",
        "",
        "## 实验任务",
        "情感分类（positive / neutral / negative），并输出 JSON。",
        "",
        "## 使用模型",
        MODEL_NAME,
        "",
        "## 实验结果",
    ]

    for i in range(0, len(results), 2):
        zero_item = results[i]
        few_item = results[i + 1]

        lines.extend(
            [
                "",
                f"### 样本 {i // 2 + 1}",
                f"- 输入文本：{zero_item['input']}",
                "",
                "#### zero-shot",
                f"- valid_json: {zero_item['result']['valid_json']}",
                f"- label: {zero_item['result']['label']}",
                f"- reason: {zero_item['result']['reason']}",
                f"- confidence: {zero_item['result']['confidence']}",
                f"- error: {zero_item['result']['error']}",
                "",
                "#### few-shot",
                f"- valid_json: {few_item['result']['valid_json']}",
                f"- label: {few_item['result']['label']}",
                f"- reason: {few_item['result']['reason']}",
                f"- confidence: {few_item['result']['confidence']}",
                f"- error: {few_item['result']['error']}",
            ]
        )

    lines.extend(
        [
            "",
            "## 观察结论（模板）",
            "- few-shot 通常更容易遵守固定输出格式（JSON 字段更完整）。",
            "- few-shot 通常在标签判断标准上更稳定，输出波动更小。",
            "- zero-shot 更快上手，但在格式约束严格的任务里更容易偏离要求。",
            "",
            "## 一句话总结",
            "当任务需要稳定格式和一致判断标准时，few-shot 往往比 zero-shot 更可靠。",
        ]
    )

    return "\n".join(lines)


def main() -> None:
    """
    程序入口：
    1. 对每个样本执行 zero-shot
    2. 对每个样本执行 few-shot
    3. 保存实验记录
    """
    all_results: list[dict] = []

    for text in TEST_SAMPLES:
        print("正在执行样本（zero-shot）...")
        all_results.append(run_single(text=text, mode="zero-shot"))

        print("正在执行样本（few-shot）...")
        all_results.append(run_single(text=text, mode="few-shot"))

    report = build_markdown(all_results)
    output_path = Path("code/day24_fewshot_zeroshot_report.md")
    output_path.write_text(report, encoding="utf-8")
    print(f"\n实验记录已保存：{output_path}")


if __name__ == "__main__":
    main()
