"""
Day 12：Prompt 对比实验（文章总结）

今天的学习目标是：
学习 Prompt 的基本写法：角色、目标、限制、输出格式。

这份脚本会做 3 件事：
1. 用同一篇文章内容，分别测试 3 版 Prompt
2. 调用本地模型生成 3 份总结结果
3. 自动输出一份对比文档：day12_prompt_compare.md

运行示例：
python3 code/day12_prompt_compare.py
python3 code/day12_prompt_compare.py "这里粘贴你自己的文章内容"
"""

from __future__ import annotations

import sys
from pathlib import Path

from tool import get_completion


# 默认模型先使用你本机已经存在的版本，保证脚本开箱可跑。
DEFAULT_MODEL_NAME = "qwen2.5:0.5b"

# 如果命令行没有传入文章，就使用这段默认文章来做实验。
DEFAULT_ARTICLE = (
    "过去一年，我们团队把一个内部数据看板从每周人工汇总升级为实时系统。"
    "项目初期最大的问题是需求反复变化，研发和业务对指标定义不一致。"
    "我们先用两周统一指标口径，再分三阶段上线：先只做核心指标，再补权限和告警，最后做移动端适配。"
    "上线后，业务同学查询数据的平均等待时间从 2 天降到 10 分钟。"
    "虽然首版还有稳定性问题，但通过增加监控和错误重试机制，系统可用性在两个月后达到 99.9%。"
)


def get_article_text() -> str:
    """
    获取要总结的文章内容。

    返回：
        str:
        - 如果命令行传入了文本，就优先使用用户输入
        - 如果没有传入，则使用脚本内置示例文章
    """
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]).strip()
    return DEFAULT_ARTICLE


def build_prompt_versions(article: str) -> list[dict[str, str]]:
    """
    生成 3 版 Prompt，用于同一任务对比。

    每一版都体现不同的 Prompt 设计重点：
    1. 基础版：只说“帮我总结”
    2. 约束版：增加长度、语气等限制
    3. 结构化版：明确输出格式，便于后续程序处理
    """
    prompt_v1 = f"""
请阅读下面文章，并写一段简短总结：
{article}
""".strip()

    prompt_v2 = f"""
你是一名项目复盘助手。
目标：帮助读者在 30 秒内理解文章核心信息。
限制：
1. 总结控制在 80~120 字。
2. 用中文，语气专业、清晰。
3. 不要加入原文没有提到的数据。

文章内容：
{article}
""".strip()

    prompt_v3 = f"""
你是一名项目管理教练。
请阅读下面文章，并按照固定格式输出。

输出格式要求：
1. 只输出以下 3 行，每行一个字段。
2. 字段名必须保持不变：背景、关键动作、结果。
3. 每个字段不超过 40 字。

示例格式：
背景：xxxx
关键动作：xxxx
结果：xxxx

文章内容：
{article}
""".strip()

    return [
        {
            "name": "Prompt 版本 1（基础版）",
            "focus": "只有任务目标，几乎没有限制条件。",
            "prompt": prompt_v1,
        },
        {
            "name": "Prompt 版本 2（角色+目标+限制）",
            "focus": "补充角色、目标和长度限制，输出通常更稳定。",
            "prompt": prompt_v2,
        },
        {
            "name": "Prompt 版本 3（结构化输出）",
            "focus": "显式约束输出格式，便于后续自动处理。",
            "prompt": prompt_v3,
        },
    ]


def run_prompt_compare(article: str) -> list[dict[str, str]]:
    """
    逐个执行 3 版 Prompt，并收集结果。

    返回：
        list[dict[str, str]]:
        每一项包含：
        - name：Prompt 名称
        - focus：这版 Prompt 的设计意图
        - prompt：完整 Prompt 文本
        - output：模型输出
        - error：出错时的错误文本（成功时为空）
    """
    versions = build_prompt_versions(article)
    results: list[dict[str, str]] = []

    for item in versions:
        print(f"正在执行：{item['name']}")
        try:
            output = get_completion(
                prompt=item["prompt"],
                system_prompt="你是一个可靠的中文总结助手。",
                model_name=DEFAULT_MODEL_NAME,
                temperature=0.3,
            )
            error_text = ""
        except Exception as exc:  # pragma: no cover
            output = ""
            error_text = str(exc)

        results.append(
            {
                "name": item["name"],
                "focus": item["focus"],
                "prompt": item["prompt"],
                "output": output,
                "error": error_text,
            }
        )

    return results


def build_markdown_report(article: str, results: list[dict[str, str]]) -> str:
    """
    构建 Day 12 的对比报告 Markdown 文本。
    """
    lines = [
        "# Day 12 Prompt 对比实验",
        "",
        "## 实验目标",
        "给“文章总结”写 3 版 Prompt，并比较输出效果差异。",
        "",
        "## 使用模型",
        DEFAULT_MODEL_NAME,
        "",
        "## 原始文章",
        article,
        "",
        "## 对比结果",
    ]

    for item in results:
        lines.extend(
            [
                "",
                f"### {item['name']}",
                f"- 设计重点：{item['focus']}",
                "",
                "#### Prompt",
                "```text",
                item["prompt"],
                "```",
                "",
                "#### 模型输出",
            ]
        )

        if item["output"]:
            lines.extend(
                [
                    "```text",
                    item["output"],
                    "```",
                ]
            )
        else:
            lines.append(f"- 无输出。错误信息：{item['error']}")

    lines.extend(
        [
            "",
            "## 结论",
            "- Prompt 越具体，输出通常越稳定、越接近预期。",
            "- 加上角色、目标、限制后，模型更不容易跑题。",
            "- 指定固定输出格式后，结果更适合后续程序处理。",
        ]
    )

    return "\n".join(lines)


def save_report(markdown_text: str, output_path: Path) -> None:
    """
    保存报告到 Markdown 文件。
    """
    output_path.write_text(markdown_text, encoding="utf-8")


def main() -> None:
    """
    程序入口：
    1. 读取文章
    2. 运行 3 版 Prompt
    3. 生成并保存对比报告
    """
    article = get_article_text()
    if not article:
        print("输入文章不能为空。")
        return

    results = run_prompt_compare(article)
    report = build_markdown_report(article, results)

    output_path = Path("code/day12_prompt_compare.md")
    save_report(report, output_path)

    print(f"\n对比报告已保存到：{output_path}")


if __name__ == "__main__":
    main()
