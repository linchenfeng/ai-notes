from __future__ import annotations

"""
Day 34：文档切分脚本（最小可运行版）

作用：
1. 调用 Day33 的文档读取脚本逻辑，先加载 docs 目录中的文档
2. 把每篇文档按固定字符窗口切成多个 chunk
3. 支持 overlap，减少切分边界导致的上下文断裂
4. 以 JSON 形式输出 chunk 结果，供后续 embedding 和索引构建继续使用

运行示例：
source ~/.zshrc
python3 code/day34_split_docs.py

调整 chunk 大小与 overlap：
source ~/.zshrc
python3 code/day34_split_docs.py --chunk-size 220 --overlap 40

查看完整 chunk 正文：
source ~/.zshrc
python3 code/day34_split_docs.py --show-content
"""

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path

from day33_load_docs import DEFAULT_DOCS_DIR, LoadedDocument, load_documents


# 这里先用“固定字符窗口 + overlap”的方式做最小可运行版本。
# 之所以这样选，是因为：
# 1. 实现简单，适合 Day34 先跑通
# 2. 对任意 md/txt 文档都可直接使用
# 3. 后面如果要扩展为按段落切、按标题切，可以在这个脚本基础上继续演进
DEFAULT_CHUNK_SIZE = 300
DEFAULT_OVERLAP = 50


@dataclass
class DocumentChunk:
    """
    表示一条切分后的 chunk。

    这个结构会成为 Day37 以后 embedding 的直接上游输入，所以这里保留了两类信息：
    1. 内容信息：chunk_text、char_count
    2. 来源信息：doc_id、title、source_path、chunk_index、start_char、end_char

    这样做的价值在于：
    - 后续做向量化时，直接拿 chunk_text 即可
    - 后续做检索结果展示和引用来源时，可以知道它来自哪篇文档、文中的哪个区间
    """

    chunk_id: str
    doc_id: str
    title: str
    source_path: str
    chunk_index: int
    start_char: int
    end_char: int
    char_count: int
    chunk_text: str


def split_text(text: str, chunk_size: int, overlap: int) -> list[tuple[int, int, str]]:
    """
    把单篇文档正文按固定字符窗口切成多个片段。

    返回结果是一个列表，每项都是：
    - start: 该 chunk 在原文中的起始字符位置
    - end: 该 chunk 在原文中的结束字符位置
    - piece: 该 chunk 的实际正文

    这里使用 overlap 的原因是：
    当一个概念正好落在切分边界附近时，前后两个 chunk 都保留一部分重叠区域，
    能降低“前一个 chunk 没说完、后一个 chunk 缺上下文”的问题。
    """

    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0")
    if overlap < 0:
        raise ValueError("overlap must be greater than or equal to 0")
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks: list[tuple[int, int, str]] = []
    text_length = len(text)
    start = 0

    while start < text_length:
        end = min(start + chunk_size, text_length)
        piece = text[start:end].strip()
        if piece:
            chunks.append((start, end, piece))

        # 下一段从“当前窗口终点减去 overlap”开始，
        # 这样前后 chunk 会共享一部分文本，降低硬切断风险。
        if end == text_length:
            break
        start = end - overlap

    return chunks


def split_document(
    document: LoadedDocument, chunk_size: int, overlap: int
) -> list[DocumentChunk]:
    """
    对单篇 LoadedDocument 执行切分，并补齐 chunk 元信息。

    这里不只是简单返回字符串列表，而是把 chunk 和来源信息一起打包，
    是为了后续检索阶段能同时保留“文本内容”和“引用线索”。
    """

    raw_chunks = split_text(document.content, chunk_size=chunk_size, overlap=overlap)
    chunks: list[DocumentChunk] = []

    for chunk_index, (start, end, piece) in enumerate(raw_chunks):
        chunks.append(
            DocumentChunk(
                chunk_id=f"{document.doc_id}_chunk_{chunk_index:03d}",
                doc_id=document.doc_id,
                title=document.title,
                source_path=document.source_path,
                chunk_index=chunk_index,
                start_char=start,
                end_char=end,
                char_count=len(piece),
                chunk_text=piece,
            )
        )

    return chunks


def split_documents(
    documents: list[LoadedDocument], chunk_size: int, overlap: int
) -> list[DocumentChunk]:
    """
    批量切分所有已加载文档。

    这一步是把 Day33 的“文档对象列表”继续推进到 Day34 的“chunk 对象列表”。
    后面 embedding、建索引、检索都会以这里的结果作为输入。
    """

    all_chunks: list[DocumentChunk] = []
    for document in documents:
        all_chunks.extend(
            split_document(document, chunk_size=chunk_size, overlap=overlap)
        )
    return all_chunks


def build_chunk_preview(chunk: DocumentChunk, preview_chars: int) -> dict[str, str | int]:
    """
    构造适合命令行查看的 chunk 摘要。

    默认不直接打印完整 chunk 文本，是为了让终端输出更容易扫读。
    如果需要完整内容，可以通过 --show-content 切换。
    """

    preview = chunk.chunk_text[:preview_chars].replace("\n", " ")
    return {
        "chunk_id": chunk.chunk_id,
        "doc_id": chunk.doc_id,
        "title": chunk.title,
        "chunk_index": chunk.chunk_index,
        "start_char": chunk.start_char,
        "end_char": chunk.end_char,
        "char_count": chunk.char_count,
        "preview": preview,
    }


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。

    Day34 先暴露最关键的几个开关：
    - docs-dir: 从哪个资料库目录读取文档
    - chunk-size: 每个 chunk 的目标字符窗口大小
    - overlap: 相邻 chunk 的重叠字符数
    - preview-chars: 摘要模式下预览多少字符
    - show-content: 是否输出完整 chunk 正文
    """

    parser = argparse.ArgumentParser(
        description="Split loaded documents into chunks for the Day34 RAG pipeline."
    )
    parser.add_argument(
        "--docs-dir",
        type=Path,
        default=DEFAULT_DOCS_DIR,
        help="Directory containing source documents. Defaults to code/docs.",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=DEFAULT_CHUNK_SIZE,
        help="Target character window size for each chunk.",
    )
    parser.add_argument(
        "--overlap",
        type=int,
        default=DEFAULT_OVERLAP,
        help="Number of overlapping characters between adjacent chunks.",
    )
    parser.add_argument(
        "--preview-chars",
        type=int,
        default=80,
        help="Number of characters to show in each chunk preview.",
    )
    parser.add_argument(
        "--show-content",
        action="store_true",
        help="Print full chunk JSON instead of summary previews.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。

    执行流程：
    1. 解析参数
    2. 调用 Day33 的读取逻辑加载文档
    3. 将文档切成多个 chunk
    4. 输出 chunk 数量和 JSON 预览

    到这里为止，RAG 的数据链路已经完成了：
    文档目录 -> LoadedDocument -> DocumentChunk
    下一步就可以接 embedding 了。
    """

    args = parse_args()
    docs_dir = args.docs_dir.resolve()

    if not docs_dir.exists():
        raise SystemExit(f"Docs directory does not exist: {docs_dir}")
    if not docs_dir.is_dir():
        raise SystemExit(f"Docs path is not a directory: {docs_dir}")

    documents = load_documents(docs_dir)
    if not documents:
        raise SystemExit(
            f"No supported documents found in {docs_dir}. Please prepare .md/.txt files first."
        )

    chunks = split_documents(
        documents, chunk_size=args.chunk_size, overlap=args.overlap
    )
    if not chunks:
        raise SystemExit("No chunks were produced. Please check input documents.")

    print(
        f"Loaded {len(documents)} documents from {docs_dir} and split them into {len(chunks)} chunks"
    )
    if args.show_content:
        payload = [asdict(chunk) for chunk in chunks]
    else:
        payload = [
            build_chunk_preview(chunk, preview_chars=args.preview_chars)
            for chunk in chunks
        ]
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
