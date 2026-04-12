from __future__ import annotations

"""
Day 39：相似度检索脚本（本地最小版）

作用：
1. 读取 Day38 构建好的本地 index.json
2. 把用户问题转成 query 向量
3. 计算 query 与每条索引记录之间的相似度
4. 返回 top-k chunks
5. 把检索结果写入 day36_local_index/search_results.json

运行示例：
source ~/.zshrc
python3 code/day39_retriever.py --query "什么是 RAG？"

指定返回条数：
source ~/.zshrc
python3 code/day39_retriever.py --query "什么是 embedding？" --top-k 5

查看完整检索结果：
source ~/.zshrc
python3 code/day39_retriever.py --query "为什么要做 chunking？" --show-content
"""

import argparse
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

from day37_embed_docs import DEFAULT_INDEX_DIR, DEFAULT_MODEL_NAME, embed_text


DEFAULT_QUERY = "什么是 RAG？"
DEFAULT_TOP_K = 3


@dataclass
class RetrievalResult:
    """
    表示一条检索结果。

    这里保留两类信息：
    1. 排序和匹配信息：score / rank
    2. 结果展示信息：chunk_id / title / source_path / chunk_text

    这样 Day39 的输出既能用于人工查看，
    也能在 Day40 继续作为“生成阶段的上下文输入”。
    """

    rank: int
    score: float
    chunk_id: str
    doc_id: str
    title: str
    source_path: str
    chunk_index: int
    start_char: int
    end_char: int
    char_count: int
    chunk_text: str


def read_json(path: Path) -> Any:
    """
    统一读取 JSON 文件。

    Day39 的核心输入是 Day38 生成的 index.json，
    所以这里保留单独的读取函数，方便后续扩展更清楚的异常提示。
    """

    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    """
    统一写 JSON 文件。

    当前主要用来把检索结果写入 search_results.json，
    方便后续回看和调试。
    """

    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def dot_product(left: list[float], right: list[float]) -> float:
    """
    计算两个向量的点积。

    由于 Day37 里已经对向量做过 L2 归一化，
    这里用点积就可以近似视作余弦相似度。
    """

    if len(left) != len(right):
        raise ValueError("Vectors must have the same dimension for similarity comparison.")
    return sum(l_value * r_value for l_value, r_value in zip(left, right))


def search_index(
    *,
    query: str,
    index_payload: dict[str, Any],
    top_k: int,
) -> list[RetrievalResult]:
    """
    在本地索引中执行相似度检索。

    执行流程：
    1. 读取索引中的 embedding 维度
    2. 用 Day37 的同一套 embedding 逻辑把 query 转成向量
    3. 遍历每条索引记录，计算相似度
    4. 按得分从高到低排序
    5. 返回前 top-k 条

    这里显式复用同一套 embed_text 逻辑非常重要，
    因为 query 和 chunk 必须处在同一个向量空间里，检索才有意义。
    """

    if top_k <= 0:
        raise ValueError("top_k must be greater than 0")

    records = index_payload.get("records", [])
    if not records:
        raise ValueError("index.json does not contain any records.")

    embedding_dim = index_payload["embedding_dim"]
    query_vector = embed_text(query, embedding_dim=embedding_dim)

    scored_items: list[tuple[float, dict[str, Any]]] = []
    for record in records:
        score = dot_product(query_vector, record["vector"])
        scored_items.append((score, record))

    scored_items.sort(key=lambda item: item[0], reverse=True)

    results: list[RetrievalResult] = []
    for rank, (score, record) in enumerate(scored_items[:top_k], start=1):
        results.append(
            RetrievalResult(
                rank=rank,
                score=score,
                chunk_id=record["chunk_id"],
                doc_id=record["doc_id"],
                title=record["title"],
                source_path=record["source_path"],
                chunk_index=record["chunk_index"],
                start_char=record["start_char"],
                end_char=record["end_char"],
                char_count=record["char_count"],
                chunk_text=record["chunk_text"],
            )
        )

    return results


def build_result_preview(result: RetrievalResult, preview_chars: int) -> dict[str, Any]:
    """
    构造适合命令行查看的检索结果摘要。

    默认模式下不直接打印整段 chunk 正文，
    而是保留前若干字符预览，让结果更容易快速扫读。
    """

    return {
        "rank": result.rank,
        "score": round(result.score, 6),
        "chunk_id": result.chunk_id,
        "doc_id": result.doc_id,
        "title": result.title,
        "preview": result.chunk_text[:preview_chars].replace("\n", " "),
    }


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。

    Day39 当前最关心的是：
    - query: 用户问题
    - index-dir: 本地索引工作区位置
    - top-k: 取前几条最相近结果
    - preview-chars: 摘要模式下显示多少字符
    - show-content: 是否打印完整 chunk 正文
    """

    parser = argparse.ArgumentParser(
        description="Retrieve top-k similar chunks from the local Day38 index."
    )
    parser.add_argument(
        "--query",
        type=str,
        default=DEFAULT_QUERY,
        help="Question used for similarity retrieval.",
    )
    parser.add_argument(
        "--index-dir",
        type=Path,
        default=DEFAULT_INDEX_DIR,
        help="Directory used as the local index workspace.",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=DEFAULT_TOP_K,
        help="Number of top results to return.",
    )
    parser.add_argument(
        "--preview-chars",
        type=int,
        default=120,
        help="Number of characters to show in summary mode.",
    )
    parser.add_argument(
        "--show-content",
        action="store_true",
        help="Print full retrieval result JSON instead of summary previews.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。

    执行流程：
    1. 读取命令行参数
    2. 读取 Day38 的 index.json
    3. 对 query 执行向量化
    4. 计算和所有索引记录的相似度
    5. 返回 top-k 结果
    6. 把结果写入 search_results.json

    到这里为止，RAG 链路已经推进到：
    文档 -> chunk -> vector -> index -> top-k retrieval
    Day40 就可以在这些检索结果基础上继续做“生成回答”。
    """

    args = parse_args()
    index_dir = args.index_dir.resolve()

    if not index_dir.exists():
        raise SystemExit(f"Index directory does not exist: {index_dir}")
    if not index_dir.is_dir():
        raise SystemExit(f"Index path is not a directory: {index_dir}")

    index_file = index_dir / "index.json"
    search_results_file = index_dir / "search_results.json"

    if not index_file.exists():
        raise SystemExit(
            f"Index file does not exist: {index_file}. Please run Day38 build index first."
        )

    index_payload = read_json(index_file)
    if not index_payload.get("records"):
        raise SystemExit("index.json does not contain any searchable records.")

    results = search_index(query=args.query, index_payload=index_payload, top_k=args.top_k)
    if not results:
        raise SystemExit("No retrieval results were produced.")

    persisted_payload = {
        "query": args.query,
        "top_k": args.top_k,
        "embedding_model": index_payload.get("embedding_model", DEFAULT_MODEL_NAME),
        "embedding_dim": index_payload.get("embedding_dim"),
        "results": [asdict(result) for result in results],
    }
    write_json(search_results_file, persisted_payload)

    print(
        f"Retrieved top {len(results)} chunks for query: {args.query}"
    )
    if args.show_content:
        output = persisted_payload
    else:
        output = [
            build_result_preview(result, preview_chars=args.preview_chars)
            for result in results
        ]
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
