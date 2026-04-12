from __future__ import annotations

"""
Day 38：本地索引构建脚本（向量入库最小版）

作用：
1. 读取 Day36 本地索引目录中的 chunks.json 和 embeddings.json
2. 校验 chunk 与 embedding 是否一一对应
3. 把两者合并成一个真正可供检索使用的 index.json
4. 同步更新 index_config.json 中的索引状态

运行示例：
source ~/.zshrc
python3 code/day38_build_index.py

指定其他索引目录：
source ~/.zshrc
python3 code/day38_build_index.py --index-dir code/day36_local_index

查看完整索引内容：
source ~/.zshrc
python3 code/day38_build_index.py --show-content
"""

import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

from day37_embed_docs import DEFAULT_INDEX_DIR, DEFAULT_MODEL_NAME


DEFAULT_INDEX_NAME = "day38_local_search_index"


@dataclass
class IndexEntry:
    """
    表示一条真正进入“本地检索索引”的记录。

    Day37 的 embeddings.json 虽然已经有向量，但它更像“向量化结果保存文件”。
    Day38 的目标是把这些结果整理成更明确的索引记录，方便 Day39 直接做检索。

    这里保留三类信息：
    1. 身份信息：chunk_id / doc_id / title / source_path
    2. 定位信息：chunk_index / start_char / end_char / char_count
    3. 检索信息：embedding_model / embedding_dim / vector / chunk_text

    这样后面检索时，只需要读取 index.json，就能同时拿到：
    - 要比对的向量
    - 对应的原始文本
    - 结果展示需要的来源信息
    """

    chunk_id: str
    doc_id: str
    title: str
    source_path: str
    chunk_index: int
    start_char: int
    end_char: int
    char_count: int
    embedding_model: str
    embedding_dim: int
    vector: list[float]
    chunk_text: str


def read_json(path: Path) -> Any:
    """
    统一读取 JSON 文件。

    单独抽出来的原因是：
    Day38 要处理的核心输入就是多个 JSON 文件，
    后面如果要增加更明确的异常提示或 schema 校验，集中在这里改更方便。
    """

    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    """
    统一写 JSON 文件。

    保持和 Day37 一样的输出风格，便于后续人工检查。
    """

    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def build_index_entries(
    chunks: list[dict[str, Any]], embeddings: list[dict[str, Any]]
) -> list[IndexEntry]:
    """
    把 chunks.json 和 embeddings.json 合并成真正的索引条目列表。

    这里的核心不是“简单拼字段”，而是要先确认：
    - 每条 embedding 都能对应到一个 chunk
    - 两边的 chunk_id 一致
    - 向量结果和原始文本没有错位

    当前实现采用“按 chunk_id 建映射”的方式，而不是假设两边顺序永远完全一致。
    这样更稳，也更适合后面继续扩展。
    """

    chunk_map = {chunk["chunk_id"]: chunk for chunk in chunks}
    entries: list[IndexEntry] = []

    for embedding in embeddings:
        chunk_id = embedding["chunk_id"]
        if chunk_id not in chunk_map:
            raise ValueError(f"Embedding chunk_id not found in chunks.json: {chunk_id}")

        chunk = chunk_map[chunk_id]
        entries.append(
            IndexEntry(
                chunk_id=chunk_id,
                doc_id=chunk["doc_id"],
                title=chunk["title"],
                source_path=chunk["source_path"],
                chunk_index=chunk["chunk_index"],
                start_char=chunk["start_char"],
                end_char=chunk["end_char"],
                char_count=chunk["char_count"],
                embedding_model=embedding["embedding_model"],
                embedding_dim=embedding["embedding_dim"],
                vector=embedding["vector"],
                chunk_text=chunk["chunk_text"],
            )
        )

    return entries


def build_index_payload(
    entries: list[IndexEntry], index_name: str, index_dir: Path
) -> dict[str, Any]:
    """
    组装完整 index.json 的输出结构。

    这里不只保存 records，还顺手写入一些元信息，
    这样 Day39 做检索时就能先快速知道：
    - 当前索引名是什么
    - 使用了什么 embedding 方案
    - 向量维度是多少
    - 一共有多少条记录
    """

    if not entries:
        raise ValueError("Cannot build index payload from empty entries.")

    return {
        "index_name": index_name,
        "index_dir": str(index_dir),
        "entry_count": len(entries),
        "embedding_model": entries[0].embedding_model,
        "embedding_dim": entries[0].embedding_dim,
        "records": [asdict(entry) for entry in entries],
    }


def build_index_preview(entry: IndexEntry, preview_dims: int) -> dict[str, Any]:
    """
    构造适合命令行查看的索引摘要。

    Day38 主要想验证：
    - 索引记录是否真的构建成功
    - 记录里是否同时包含来源信息和向量信息
    所以默认模式下不打印完整向量，而是只展示前几个维度。
    """

    return {
        "chunk_id": entry.chunk_id,
        "doc_id": entry.doc_id,
        "title": entry.title,
        "embedding_model": entry.embedding_model,
        "embedding_dim": entry.embedding_dim,
        "vector_preview": entry.vector[:preview_dims],
        "char_count": entry.char_count,
    }


def update_index_config(
    config_path: Path,
    *,
    index_name: str,
    index_file: Path,
    entry_count: int,
    embedding_model: str,
    embedding_dim: int,
) -> None:
    """
    更新本地索引配置文件中的状态信息。

    Day36 先把索引环境骨架搭出来。
    Day37 把 chunk 和 embedding 写进去。
    到 Day38，这里要把“index_ready”正式标成 true，
    表示本地检索索引已经可供下一步检索脚本使用。
    """

    if config_path.exists():
        config = read_json(config_path)
    else:
        config = {}

    config["index_name"] = index_name
    config["index_file"] = str(index_file)
    config["embedding_model"] = embedding_model
    config["embedding_dim"] = embedding_dim
    config["status"] = {
        "chunks_ready": True,
        "embeddings_ready": True,
        "index_ready": True,
    }
    config["stats"] = {
        "chunk_count": entry_count,
        "embedding_count": entry_count,
        "index_entry_count": entry_count,
    }

    write_json(config_path, config)


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。

    Day38 当前最关心的是：
    - index-dir: 本地索引工作区在哪
    - index-name: 这次构建出来的索引叫什么
    - preview-dims: 摘要模式下看多少个向量维度
    - show-content: 是否打印完整 index payload
    """

    parser = argparse.ArgumentParser(
        description="Build a local searchable index from chunks and embeddings for Day38."
    )
    parser.add_argument(
        "--index-dir",
        type=Path,
        default=DEFAULT_INDEX_DIR,
        help="Directory used as the local index workspace.",
    )
    parser.add_argument(
        "--index-name",
        type=str,
        default=DEFAULT_INDEX_NAME,
        help="Name written into the generated local index file.",
    )
    parser.add_argument(
        "--preview-dims",
        type=int,
        default=8,
        help="Number of vector values to show in summary mode.",
    )
    parser.add_argument(
        "--show-content",
        action="store_true",
        help="Print full index JSON instead of summary previews.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。

    执行流程：
    1. 解析参数
    2. 读取 chunks.json 和 embeddings.json
    3. 构建索引记录
    4. 写入 index.json
    5. 更新 index_config.json
    6. 输出索引摘要

    到这里为止，RAG 的上游链路已经推进到：
    文档 -> chunk -> vector -> index
    Day39 就可以在这个 index.json 基础上直接做相似度检索。
    """

    args = parse_args()
    index_dir = args.index_dir.resolve()

    if not index_dir.exists():
        raise SystemExit(f"Index directory does not exist: {index_dir}")
    if not index_dir.is_dir():
        raise SystemExit(f"Index path is not a directory: {index_dir}")

    chunks_file = index_dir / "chunks.json"
    embeddings_file = index_dir / "embeddings.json"
    index_file = index_dir / "index.json"
    config_file = index_dir / "index_config.json"

    for required_file in (chunks_file, embeddings_file):
        if not required_file.exists():
            raise SystemExit(f"Required file does not exist: {required_file}")

    chunks = read_json(chunks_file)
    embeddings = read_json(embeddings_file)

    if not chunks:
        raise SystemExit("chunks.json is empty. Please run Day37 embedding first.")
    if not embeddings:
        raise SystemExit("embeddings.json is empty. Please run Day37 embedding first.")

    entries = build_index_entries(chunks, embeddings)
    if not entries:
        raise SystemExit("No index entries were built from current chunk and embedding files.")

    payload = build_index_payload(entries, index_name=args.index_name, index_dir=index_dir)
    write_json(index_file, payload)
    update_index_config(
        config_file,
        index_name=args.index_name,
        index_file=index_file,
        entry_count=len(entries),
        embedding_model=entries[0].embedding_model,
        embedding_dim=entries[0].embedding_dim,
    )

    print(
        f"Built local index '{args.index_name}' with {len(entries)} entries at {index_file}"
    )
    if args.show_content:
        output = payload
    else:
        output = [
            build_index_preview(entry, preview_dims=args.preview_dims)
            for entry in entries
        ]
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
