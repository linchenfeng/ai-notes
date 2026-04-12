from __future__ import annotations

"""
Day 37：文档 Embedding 脚本（本地轻量基线版）

作用：
1. 调用 Day34 的切分逻辑，先拿到所有 chunk
2. 使用一个“本地可运行、无额外依赖”的轻量 embedding 基线方案，把 chunk 转成向量
3. 把 chunk 元信息写入本地索引目录中的 chunks.json
4. 把向量结果写入本地索引目录中的 embeddings.json
5. 同步更新 index_config.json 中的状态标记

运行示例：
source ~/.zshrc
python3 code/day37_embed_docs.py

调整向量维度：
source ~/.zshrc
python3 code/day37_embed_docs.py --embedding-dim 96

查看完整 embedding 输出：
source ~/.zshrc
python3 code/day37_embed_docs.py --show-content
"""

import argparse
import hashlib
import json
import math
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from day33_load_docs import DEFAULT_DOCS_DIR, load_documents
from day34_split_docs import DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, DocumentChunk, split_documents


# 这里使用“本地哈希向量”作为 Day37 的最小 embedding 基线方案。
# 这样设计的原因是：
# 1. 不依赖外部 embedding 服务，也不依赖额外 Python 三方库
# 2. 可以在当前机器上直接运行，保证 Day37 当天就有可见产出
# 3. 向量是稳定可复现的，后面 Day38、Day39 可以继续基于它做索引和检索实验
# 4. 等以后要升级成真实 embedding 模型时，只需要替换 embed_text 这一层实现
DEFAULT_EMBEDDING_DIM = 64
DEFAULT_INDEX_DIR = Path(__file__).resolve().parent / "day36_local_index"
DEFAULT_MODEL_NAME = "local_hash_embedding_v1"


@dataclass
class EmbeddedChunk:
    """
    表示一条已经完成向量化的 chunk。

    这个结构的设计目标是：
    不只是保存“向量值”，还要保留足够的来源信息，方便后续做：
    - 建立索引
    - 相似度检索
    - 结果回溯
    - 引用来源展示

    字段说明：
    - chunk_id/doc_id/title/source_path: 保留这条向量来自哪篇文档、哪个 chunk
    - chunk_index/start_char/end_char/char_count: 保留它在原文中的位置边界
    - embedding_model: 记录当前使用的 embedding 方案名称
    - embedding_dim: 向量维度，后续检索时需要知道
    - vector: 真正的向量结果
    - chunk_text: 暂时保留正文，便于后面调试与快速验证
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


def tokenize_text(text: str) -> list[str]:
    """
    把 chunk 文本切成较适合本地哈希向量使用的 token 列表。

    当前采用的是一个“轻量但够用”的分词方式：
    - 英文 / 数字：按连续单词切
    - 中文：按单个汉字切

    之所以不在 Day37 一开始就引入复杂分词，是因为当前目标是：
    先让“chunk -> 向量”这条链路跑通。

    后面如果需要提升中文检索效果，可以再替换成更细致的中文分词方案。
    """

    lowered = text.lower()
    return re.findall(r"[\u4e00-\u9fff]|[a-z0-9_]+", lowered)


def l2_normalize(vector: list[float]) -> list[float]:
    """
    对向量做 L2 归一化。

    这样做的主要价值是：
    - 不同长度文本得到的向量更容易在同一尺度上比较
    - 后面做余弦相似度时更方便
    """

    norm = math.sqrt(sum(value * value for value in vector))
    if norm == 0:
        return vector
    return [value / norm for value in vector]


def embed_text(text: str, embedding_dim: int) -> list[float]:
    """
    使用“哈希技巧 + 归一化”把文本映射成固定维度向量。

    这不是严格意义上的高质量生产 embedding 模型，但它满足 Day37 当前阶段最重要的要求：
    - 可以把 chunk 真实转成向量
    - 结果稳定、可复现
    - 本地就能运行
    - 后续可以继续用于建索引和做最小检索实验

    实现思路：
    1. 先把文本切成 token
    2. 对每个 token 做哈希
    3. 用哈希结果决定它落到向量的哪个维度
    4. 再根据哈希结果给该维度加正负权重
    5. 最后做归一化

    这类做法可以粗略模拟“相似 token 分布 -> 相似向量分布”的效果，
    虽然不如真实 embedding 模型强，但非常适合当前学习阶段。
    """

    if embedding_dim <= 0:
        raise ValueError("embedding_dim must be greater than 0")

    vector = [0.0] * embedding_dim
    tokens = tokenize_text(text)
    if not tokens:
        return vector

    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()

        # 用哈希前 4 个字节决定 token 落到哪个维度。
        index = int.from_bytes(digest[:4], byteorder="big") % embedding_dim

        # 用第 5 个字节决定正负号，让不同 token 的分布更分散一些。
        sign = 1.0 if digest[4] % 2 == 0 else -1.0

        # 用第 6 个字节生成一个轻量权重，避免所有 token 贡献完全一样。
        weight = 1.0 + (digest[5] / 255.0)

        vector[index] += sign * weight

    return l2_normalize(vector)


def embed_chunk(
    chunk: DocumentChunk, embedding_dim: int, model_name: str
) -> EmbeddedChunk:
    """
    对单条 chunk 执行向量化，并补齐 embedding 元信息。

    这里相当于把 Day34 的 DocumentChunk，推进成 Day37 的 EmbeddedChunk。
    """

    return EmbeddedChunk(
        chunk_id=chunk.chunk_id,
        doc_id=chunk.doc_id,
        title=chunk.title,
        source_path=chunk.source_path,
        chunk_index=chunk.chunk_index,
        start_char=chunk.start_char,
        end_char=chunk.end_char,
        char_count=chunk.char_count,
        embedding_model=model_name,
        embedding_dim=embedding_dim,
        vector=embed_text(chunk.chunk_text, embedding_dim=embedding_dim),
        chunk_text=chunk.chunk_text,
    )


def embed_chunks(
    chunks: list[DocumentChunk], embedding_dim: int, model_name: str
) -> list[EmbeddedChunk]:
    """
    批量对所有 chunk 执行向量化。

    这一步之后，RAG 上游链路会从：
    文档 -> chunk
    推进到：
    文档 -> chunk -> vector
    """

    return [
        embed_chunk(chunk, embedding_dim=embedding_dim, model_name=model_name)
        for chunk in chunks
    ]


def build_embedding_preview(
    embedded_chunk: EmbeddedChunk, preview_dims: int
) -> dict[str, Any]:
    """
    构造适合命令行查看的 embedding 摘要。

    默认不一次性打印完整向量，是因为完整向量列表通常较长，
    人工快速验收时更关心：
    - 这条 embedding 属于哪个 chunk
    - 向量维度是多少
    - 前几个数值看起来是不是成功生成了
    """

    return {
        "chunk_id": embedded_chunk.chunk_id,
        "doc_id": embedded_chunk.doc_id,
        "title": embedded_chunk.title,
        "embedding_model": embedded_chunk.embedding_model,
        "embedding_dim": embedded_chunk.embedding_dim,
        "vector_preview": embedded_chunk.vector[:preview_dims],
        "char_count": embedded_chunk.char_count,
    }


def write_json(path: Path, payload: Any) -> None:
    """
    统一写 JSON 文件。

    单独抽这个函数，是为了让 Day37 的输出逻辑更清晰。
    后面如果要增加写入日志、原子替换、目录自动创建等能力，也更容易扩展。
    """

    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def update_index_config(
    config_path: Path,
    *,
    chunk_count: int,
    embedding_count: int,
    embedding_dim: int,
    embedding_model: str,
) -> None:
    """
    更新 Day36 本地索引配置文件中的状态信息。

    这样后面回头看 index_config.json 时，不只是知道“这个目录存在”，
    还知道当前索引环境已经推进到了哪一步。
    """

    if config_path.exists():
        config = json.loads(config_path.read_text(encoding="utf-8"))
    else:
        config = {}

    config["embedding_model"] = embedding_model
    config["embedding_dim"] = embedding_dim
    config["status"] = {
        "chunks_ready": chunk_count > 0,
        "embeddings_ready": embedding_count > 0,
        "index_ready": False,
    }
    config["stats"] = {
        "chunk_count": chunk_count,
        "embedding_count": embedding_count,
    }

    write_json(config_path, config)


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。

    Day37 先暴露最关键的几个开关：
    - docs-dir: 从哪个目录读取原始资料
    - index-dir: 把 chunk / embeddings / 配置写到哪个本地索引目录
    - chunk-size / overlap: 复用 Day34 的切分参数
    - embedding-dim: 当前向量维度
    - preview-dims: 摘要模式下显示多少个向量数值
    - show-content: 是否打印完整 embedding JSON
    """

    parser = argparse.ArgumentParser(
        description="Embed document chunks into vectors for the Day37 RAG pipeline."
    )
    parser.add_argument(
        "--docs-dir",
        type=Path,
        default=DEFAULT_DOCS_DIR,
        help="Directory containing source documents. Defaults to code/docs.",
    )
    parser.add_argument(
        "--index-dir",
        type=Path,
        default=DEFAULT_INDEX_DIR,
        help="Directory used as the local index workspace.",
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
        "--embedding-dim",
        type=int,
        default=DEFAULT_EMBEDDING_DIM,
        help="Dimension of the local embedding vector.",
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
        help="Print full embedding JSON instead of summary previews.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。

    执行流程：
    1. 读取命令行参数
    2. 调用 Day33 加载文档
    3. 调用 Day34 生成 chunk
    4. 对 chunk 执行本地 embedding
    5. 把 chunks / embeddings 写入 Day36 的本地索引目录
    6. 输出 embedding 结果摘要

    到这里，RAG 的上游数据链路已经推进到：
    文档 -> chunk -> vector -> 本地索引文件
    """

    args = parse_args()
    docs_dir = args.docs_dir.resolve()
    index_dir = args.index_dir.resolve()

    if not docs_dir.exists():
        raise SystemExit(f"Docs directory does not exist: {docs_dir}")
    if not docs_dir.is_dir():
        raise SystemExit(f"Docs path is not a directory: {docs_dir}")

    if not index_dir.exists():
        raise SystemExit(f"Index directory does not exist: {index_dir}")
    if not index_dir.is_dir():
        raise SystemExit(f"Index path is not a directory: {index_dir}")

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

    embedded_chunks = embed_chunks(
        chunks,
        embedding_dim=args.embedding_dim,
        model_name=DEFAULT_MODEL_NAME,
    )

    chunks_file = index_dir / "chunks.json"
    embeddings_file = index_dir / "embeddings.json"
    config_file = index_dir / "index_config.json"

    write_json(chunks_file, [asdict(chunk) for chunk in chunks])
    write_json(embeddings_file, [asdict(embedded_chunk) for embedded_chunk in embedded_chunks])
    update_index_config(
        config_file,
        chunk_count=len(chunks),
        embedding_count=len(embedded_chunks),
        embedding_dim=args.embedding_dim,
        embedding_model=DEFAULT_MODEL_NAME,
    )

    print(
        f"Loaded {len(documents)} documents, split them into {len(chunks)} chunks, and embedded them into {len(embedded_chunks)} vectors"
    )
    if args.show_content:
        payload = [asdict(embedded_chunk) for embedded_chunk in embedded_chunks]
    else:
        payload = [
            build_embedding_preview(
                embedded_chunk, preview_dims=args.preview_dims
            )
            for embedded_chunk in embedded_chunks
        ]
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
