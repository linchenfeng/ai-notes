"""
测试 tool.get_completion 的最小脚本。

运行方式：
python3 code/test_get_completion.py

说明：
1. 这个脚本会尝试导入 tool.py 中的 get_completion
2. 如果导入失败，会打印清晰的报错提示
3. 如果导入成功，会发送一个简单问题并打印返回结果
"""

from __future__ import annotations


def main() -> None:
    """
    程序入口。
    """
    try:
        from tool import get_completion
    except ImportError as exc:
        print("导入失败：没有找到 `tool.py` 或其中不包含 `get_completion`。")
        print("请确认：")
        print("1. 项目里已经创建了 tool.py")
        print("2. tool.py 里定义了 get_completion 函数")
        print("3. 运行脚本时，tool.py 在当前 Python 路径中")
        print(f"原始错误：{exc}")
        return

    question = "中国的首都是哪里？"
    print(f"测试问题：{question}")

    try:
        response = get_completion(question)
    except Exception as exc:  # pragma: no cover
        print("调用 `get_completion` 时出错。")
        print(f"原始错误：{exc}")
        return

    print("模型返回：")
    print(response)


if __name__ == "__main__":
    main()
