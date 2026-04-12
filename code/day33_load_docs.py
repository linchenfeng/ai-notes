from __future__ import annotations

"""
Day 33：文档读取脚本（先支持 md / txt）

作用：
1. 扫描 docs 目录中的 Markdown / TXT 文档
2. 读取文档正文并做最小标准化
3. 提取标题、路径、字符数等基础信息
4. 以 JSON 形式输出，供后续切分脚本继续使用

运行示例：
source ~/.zshrc
python3 code/day33_load_docs.py

查看完整正文输出：
source ~/.zshrc
python3 code/day33_load_docs.py --show-content

指定其他目录：
source ~/.zshrc
python3 code/day33_load_docs.py --docs-dir code/docs
"""

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path


# 当前 Day33 先只支持最常见、最容易处理的两类文本资料：
# 1. Markdown：适合承载结构化学习笔记、技术文档、项目说明
# 2. TXT：适合作为最朴素的纯文本资料输入
# 后面如果进入 PDF、HTML、网页正文等格式，再在这里继续扩展即可。
SUPPORTED_SUFFIXES = {".md", ".txt"}

# 默认资料库目录放在 code/docs。
# 这样后续 Day32 准备的文档集可以直接接到 Day33 的读取脚本上，
# 不需要用户每次手动传路径也能马上跑通最小闭环。
DEFAULT_DOCS_DIR = Path(__file__).resolve().parent / "docs"


@dataclass
class LoadedDocument:
    """
    表示一篇已经被读取进内存、并完成基础标准化的文档。

    这里故意把字段设计得比较直接，因为它会成为后续几天的上游输入：
    - Day34 会基于 content 做切分
    - Day37 会基于 chunk 文本做 embedding
    - Day39 以后会依赖 title/source_path 等信息做检索结果展示和来源引用

    字段说明：
    - doc_id: 文档内部标识，当前先直接使用文件名（不带后缀）
    - title: 文档标题。Markdown 优先取首个标题，其他格式退回文件名
    - source_path: 原始文件路径，后面做引用来源时很有价值
    - file_type: 文档格式类型，如 md / txt
    - char_count: 字符长度。当前先做最基础的长度记录，后面也能辅助成本意识
    - content: 标准化后的完整文本正文
    """
    doc_id: str
    title: str
    source_path: str
    file_type: str
    char_count: int
    content: str


def normalize_text(text: str) -> str:
    """
    对原始文本做最小标准化处理。

    这里先只做三件事：
    1. 把 Windows 风格换行（\\r\\n）统一成 \\n
    2. 把旧式 Mac 风格换行（\\r）统一成 \\n
    3. 去掉首尾空白，避免后续统计长度和预览时出现噪音

    之所以现在先保持“最小处理”，是因为 Day33 的目标是先跑通读取链路。
    更激进的清洗（比如去多余空行、去 Markdown 标记、清理噪声）可以在后续按需求增加。
    """
    normalized = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    return normalized


def infer_title(path: Path, content: str) -> str:
    """
    推断文档标题。

    设计思路：
    - 对 Markdown：优先取第一个标题行（以 # 开头），因为这通常最贴近人类阅读时的文档标题
    - 对 TXT 或没有标题的 Markdown：退回到文件名

    这样做的好处是，后面即使没有复杂 metadata，也能先得到一个比较可读的标题，
    用于预览输出、日志、检索结果展示和来源引用。
    """
    if path.suffix.lower() == ".md":
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                return stripped.lstrip("#").strip()
    return path.stem


def load_document(path: Path) -> LoadedDocument:
    """
    读取单个文档文件，并返回统一结构的 LoadedDocument。

    这是 Day33 的核心原子操作：
    - 读文件
    - 做最小标准化
    - 提取基础元信息
    - 返回后续流程可继续消费的数据结构

    这里先默认使用 utf-8 读取，是因为当前 Day32 准备的资料库全部是本地 Markdown 文档。
    如果后面接入更复杂来源，可能需要在这里补编码兜底逻辑。
    """
    raw_text = path.read_text(encoding="utf-8")
    content = normalize_text(raw_text)
    return LoadedDocument(
        doc_id=path.stem,
        title=infer_title(path, content),
        source_path=str(path),
        file_type=path.suffix.lower().lstrip("."),
        char_count=len(content),
        content=content,
    )


def load_documents(directory: Path) -> list[LoadedDocument]:
    """
    扫描目录，批量读取所有支持的文档。

    这里使用 rglob("*")，是为了让脚本天然支持“docs/ 下再分子目录”的情况，
    这样以后资料库按主题继续拆分时，不需要重写读取逻辑。

    过滤逻辑保持简单明确：
    - 不是文件：跳过
    - 后缀不在支持范围内：跳过
    - 其余文件：交给 load_document 统一处理

    sorted(...) 的作用是保证读取顺序稳定。
    对学习、调试和后续实验来说，稳定顺序会让输出更可复现。
    """
    documents: list[LoadedDocument] = []
    for path in sorted(directory.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in SUPPORTED_SUFFIXES:
            continue
        documents.append(load_document(path))
    return documents


def build_preview(document: LoadedDocument, preview_chars: int) -> dict[str, str | int]:
    """
    把完整文档压缩成一条适合命令行查看的预览信息。

    这样设计的原因是：
    Day33 主要想先验证“文档有没有被正确读进来”，而不是一上来把所有正文完整打印到终端。
    所以默认模式下输出的是摘要视图：
    - 文档 ID
    - 标题
    - 类型
    - 字符数
    - 开头预览

    预览时把换行替换成空格，是为了让一条记录在终端里更紧凑、更容易快速扫读。
    """
    preview = document.content[:preview_chars].replace("\n", " ")
    return {
        "doc_id": document.doc_id,
        "title": document.title,
        "file_type": document.file_type,
        "char_count": document.char_count,
        "preview": preview,
    }


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。

    当前暴露的参数尽量只保留和 Day33 目标直接相关的三类：
    - docs-dir: 指定读取哪个目录
    - preview-chars: 控制摘要模式下的预览长度
    - show-content: 是否输出完整正文 JSON

    这能让脚本既保持最小可运行，又预留出后续实验的灵活度。
    """
    parser = argparse.ArgumentParser(
        description="Load .md/.txt documents for the Day33 RAG docs pipeline."
    )
    parser.add_argument(
        "--docs-dir",
        type=Path,
        default=DEFAULT_DOCS_DIR,
        help="Directory containing source documents. Defaults to code/docs.",
    )
    parser.add_argument(
        "--preview-chars",
        type=int,
        default=80,
        help="Number of characters to show in each preview line.",
    )
    parser.add_argument(
        "--show-content",
        action="store_true",
        help="Print full loaded JSON instead of summary previews.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。

    执行流程很简单，但它已经对应了一个最小的 RAG 上游数据准备链路：
    1. 读取用户参数
    2. 校验 docs 目录是否存在且合法
    3. 批量加载支持的文档
    4. 按“摘要模式”或“完整内容模式”输出 JSON

    这样后面无论是人工检查、还是交给下一步切分脚本继续处理，都已经有了统一入口。
    """
    args = parse_args()
    docs_dir = args.docs_dir.resolve()

    # 先尽早失败，而不是让后面的读取逻辑报出更模糊的错误。
    if not docs_dir.exists():
        raise SystemExit(f"Docs directory does not exist: {docs_dir}")
    if not docs_dir.is_dir():
        raise SystemExit(f"Docs path is not a directory: {docs_dir}")

    documents = load_documents(docs_dir)
    if not documents:
        # 如果目录里一个支持的文档都没有，继续往下走也没有意义，
        # 这里直接给出明确提示，方便快速发现是路径错了还是文件类型不对。
        raise SystemExit(
            f"No supported documents found in {docs_dir}. Supported: {sorted(SUPPORTED_SUFFIXES)}"
        )

    print(f"Loaded {len(documents)} documents from {docs_dir}")
    if args.show_content:
        # 完整模式更适合后续脚本消费，或者人工查看单篇文档是否被正确读取。
        payload = [asdict(document) for document in documents]
    else:
        # 默认使用摘要模式，避免一次性把所有正文都打到终端里。
        payload = [
            build_preview(document, preview_chars=args.preview_chars)
            for document in documents
        ]
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
