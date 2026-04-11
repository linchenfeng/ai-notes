"""
Day 22：Token 与上下文窗口演示脚本

这个脚本做两件事：
1. 估算一段文本大概会占多少 token（粗略估算）
2. 当文本过长时，按目标 token 上限切成多个片段

说明：
- 这里是“教学用估算”，不是模型真实分词结果。
- 目的是帮助初学者理解“窗口预算”思维。

运行方式：
python3 code/day22_token_window_demo.py
python3 code/day22_token_window_demo.py "这里放你自己的长文本"
"""

from __future__ import annotations

import math
import sys


# 这个值是假设你的请求总预算（仅演示用）。
# 真正可用上限要看具体模型文档。
MAX_CONTEXT_TOKENS = 4096

# 我们预留一部分 token 给系统提示、历史对话和模型输出。
# 这样输入文本不会把窗口塞满。
RESERVED_TOKENS = 1200

# 输入文本可用预算 = 总预算 - 预留预算
INPUT_TOKEN_BUDGET = MAX_CONTEXT_TOKENS - RESERVED_TOKENS


DEFAULT_LONG_TEXT = (
    "在一个真实的 AI 产品中，用户往往会直接粘贴非常长的材料，比如会议纪要、项目方案、"
    "行业报告、产品说明书等。如果后端没有做 token 预算控制，就可能出现几类问题："
    "第一，请求总长度超出模型上下文窗口，接口直接失败；第二，虽然请求没有超限，但输入占满了窗口，"
    "导致模型没有足够输出空间，返回内容被截断；第三，文本过长会增加请求时延和推理成本，"
    "让用户明显感觉页面“卡住”；第四，长文本中低价值信息过多会干扰模型注意力，反而让输出质量下降。"
    "因此，工程上通常会先做长度限制，然后对超长文本做分段摘要，再进行二次汇总，"
    "同时保留必要上下文并尽量控制无关历史对话，这样才能在质量、速度和成本之间保持平衡。"
)


def get_input_text() -> str:
    """
    获取待分析文本。

    返回：
        str:
        - 若命令行传入文本，使用用户输入
        - 否则使用默认演示文本
    """
    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]).strip()
    return DEFAULT_LONG_TEXT


def estimate_tokens(text: str) -> int:
    """
    粗略估算 token 数。

    这里使用一个简单近似：
    - 中文/英文混合场景下，平均 1 token 约等于 1~2 个字符。
    - 为了保守，我们用“字符数 / 1.5”向上取整。

    注意：
        这是教学估算，不等于模型真实计费 token。
    """
    if not text:
        return 0
    return math.ceil(len(text) / 1.5)


def split_text_by_token_budget(text: str, budget_tokens: int) -> list[str]:
    """
    按 token 预算把长文本切成多个片段。

    实现思路（教学简化版）：
    1. 先把 token 预算换算成“每段可容纳字符数”
    2. 再按字符长度切片

    参数：
        text: 原始文本
        budget_tokens: 每段 token 预算

    返回：
        list[str]:
        切分后的文本片段列表
    """
    if not text:
        return []

    # 反向使用上面的估算比率：token * 1.5 约等于字符数
    max_chars_per_chunk = max(int(budget_tokens * 1.5), 1)
    chunks: list[str] = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = min(start + max_chars_per_chunk, text_length)
        chunks.append(text[start:end])
        start = end

    return chunks


def print_report(text: str, estimated_tokens: int, chunks: list[str]) -> None:
    """
    打印演示报告。
    """
    print("=== Day 22 Token / 上下文窗口演示 ===")
    print(f"文本字符数：{len(text)}")
    print(f"估算 token 数：{estimated_tokens}")
    print(f"总窗口预算：{MAX_CONTEXT_TOKENS}")
    print(f"预留预算：{RESERVED_TOKENS}")
    print(f"输入预算：{INPUT_TOKEN_BUDGET}")
    print("-" * 48)

    if estimated_tokens <= INPUT_TOKEN_BUDGET:
        print("结论：这段文本可以直接放入输入，不需要分段。")
        return

    print("结论：文本过长，不建议无脑全塞，建议分段处理。")
    print(f"建议切分片段数：{len(chunks)}")
    print("-" * 48)

    for idx, chunk in enumerate(chunks, start=1):
        chunk_tokens = estimate_tokens(chunk)
        print(f"片段 {idx}：字符数={len(chunk)}，估算 token={chunk_tokens}")

    print("-" * 48)
    print("下一步建议：先逐段总结，再把每段总结结果做二次汇总。")


def main() -> None:
    """
    程序入口。
    """
    text = get_input_text()
    if not text:
        print("输入不能为空。")
        return

    estimated_tokens = estimate_tokens(text)
    chunks = split_text_by_token_budget(text, INPUT_TOKEN_BUDGET)
    print_report(text, estimated_tokens, chunks)


if __name__ == "__main__":
    main()
