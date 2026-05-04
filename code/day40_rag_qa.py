from __future__ import annotations

"""
Day 40：最小 RAG 闭环脚本（检索增强生成）

作用：
1. 读取 Day38 构建好的本地 index.json
2. 复用 Day39 的检索逻辑拿到 top-k chunks
3. 把检索结果组织成上下文提示词
4. 调用本地模型生成答案
5. 把问答结果写入 day36_local_index/rag_answer.json

运行示例：
python code/day40_rag_qa.py --query "什么是 RAG？"

查看完整上下文和答案：
python code/day40_rag_qa.py --query "为什么要做 chunking？" --show-context

只检查检索和提示词，不实际调用模型：
python code/day40_rag_qa.py --query "embedding 是什么？" --dry-run
"""

import argparse
import json
import re
from dataclasses import asdict
from pathlib import Path
from typing import Any

from day37_embed_docs import DEFAULT_INDEX_DIR
from day39_retriever import RetrievalResult, read_json, search_index, write_json
from tool import DEFAULT_MODEL_NAME, get_completion


DEFAULT_QUERY = "什么是 RAG？"
DEFAULT_TOP_K = 3
DEFAULT_OUTPUT_FILE = "rag_answer.json"
DEFAULT_SYSTEM_PROMPT = (
    "你是一个基于知识库上下文回答问题的中文助手。"
    "你必须优先依据给定上下文回答。"
    "如果上下文不足以支持完整回答，要明确说明“根据当前检索到的资料，暂时无法确认”。"
    "不要编造上下文中没有出现的事实。"
)


def format_context(results: list[RetrievalResult]) -> str:
    """
    把检索结果整理成适合给模型阅读的上下文块。
    """

    blocks: list[str] = []
    for result in results:
        blocks.append(
            "\n".join(
                [
                    f"[片段 {result.rank}]",
                    f"标题：{result.title}",
                    f"来源：{result.source_path}",
                    f"chunk_id：{result.chunk_id}",
                    "内容：",
                    result.chunk_text,
                ]
            )
        )
    return "\n\n".join(blocks)


def build_rag_prompt(*, query: str, context_text: str) -> str:
    """
    构造最小可用的 RAG 问答提示词。
    """

    return (
        "请基于下面提供的知识库检索结果回答用户问题。\n\n"
        "回答要求：\n"
        "1. 只依据“知识库上下文”回答，不要补充未出现的外部事实。\n"
        "2. 如果上下文不足，请明确说“根据当前检索到的资料，暂时无法确认”。\n"
        "3. 用中文回答，尽量简洁清楚。\n"
        "4. 优先直接回答问题，再补一句依据。\n\n"
        f"用户问题：\n{query}\n\n"
        f"知识库上下文：\n{context_text}\n"
    )


def build_output_payload(
    *,
    query: str,
    top_k: int,
    model_name: str,
    generation_mode: str,
    answer: str,
    prompt: str,
    results: list[RetrievalResult],
) -> dict[str, Any]:
    """
    组装 Day40 的落盘结果。
    """

    return {
        "query": query,
        "top_k": top_k,
        "model_name": model_name,
        "generation_mode": generation_mode,
        "answer": answer,
        "context_count": len(results),
        "sources": [
            {
                "rank": result.rank,
                "score": result.score,
                "chunk_id": result.chunk_id,
                "doc_id": result.doc_id,
                "title": result.title,
                "source_path": result.source_path,
            }
            for result in results
        ],
        "results": [asdict(result) for result in results],
        "prompt": prompt,
    }


def extract_query_terms(query: str) -> list[str]:
    """
    从问题里提取一组轻量关键词，供离线兜底回答时做匹配。
    """

    raw_terms = re.findall(r"[\u4e00-\u9fff]{1,}|[A-Za-z0-9_.:-]+", query.lower())
    stop_terms = {"什么", "什么是", "是", "的", "了", "吗", "呢", "请问", "一下"}

    terms: list[str] = []
    for term in raw_terms:
        cleaned = term.strip()
        if not cleaned or cleaned in stop_terms:
            continue
        if cleaned not in terms:
            terms.append(cleaned)
    return terms


def split_candidate_sentences(text: str) -> list[str]:
    """
    把检索文本拆成适合做抽取式回答的候选句子。
    """

    normalized = text.replace("\r", "")
    pieces = re.split(r"[。！？\n]+", normalized)

    candidates: list[str] = []
    for piece in pieces:
        sentence = piece.strip().strip("#*- ")
        if len(sentence) < 8:
            continue
        candidates.append(sentence)
    return candidates


def build_fallback_answer(query: str, results: list[RetrievalResult]) -> str:
    """
    当本地模型不可用时，基于检索结果做一个最小可用的抽取式回答。
    """

    terms = extract_query_terms(query)
    scored_sentences: list[tuple[float, str, RetrievalResult]] = []

    is_definition_query = "什么是" in query or "是什么" in query

    for result in results:
        rank_bonus = max(0.0, 1.0 - (result.rank - 1) * 0.15)
        title_bonus = 0.5 if any(term in result.title.lower() for term in terms) else 0.0

        for index, sentence in enumerate(split_candidate_sentences(result.chunk_text)):
            overlap = sum(1 for term in terms if term in sentence.lower())
            if overlap == 0 and result.rank > 1:
                continue

            length_bonus = 0.2 if 12 <= len(sentence) <= 120 else 0.0
            position_bonus = 0.25 if index < 2 else 0.0
            definition_bonus = 0.0
            if is_definition_query and any(
                marker in sentence for marker in ("全称是", "意思是", "是一种", "是指", "它的基本流程是")
            ):
                definition_bonus = 3.0

            score = overlap * 2.0 + rank_bonus + title_bonus + length_bonus + position_bonus + definition_bonus
            scored_sentences.append((score, sentence, result))

    if not scored_sentences:
        top_result = results[0]
        for sentence in split_candidate_sentences(top_result.chunk_text):
            return f"{sentence}。依据：检索结果《{top_result.title}》。"
        return "根据当前检索到的资料，暂时无法确认。"

    scored_sentences.sort(key=lambda item: item[0], reverse=True)
    _, best_sentence, best_result = scored_sentences[0]

    answer = best_sentence
    if not answer.endswith(("。", "！", "？")):
        answer = f"{answer}。"
    return f"{answer}依据：检索结果《{best_result.title}》。"


def print_answer(answer: str, results: list[RetrievalResult]) -> None:
    """
    打印适合命令行查看的最小结果。
    """

    print("Answer:")
    print(answer)
    print("\nSources:")
    for result in results:
        print(
            f"- [{result.rank}] {result.title} | {result.source_path} | score={result.score:.6f}"
        )


def parse_args() -> argparse.Namespace:
    """
    解析命令行参数。
    """

    parser = argparse.ArgumentParser(
        description="Run a minimal Day40 RAG QA flow from local retrieval results."
    )
    parser.add_argument(
        "--query",
        type=str,
        default=DEFAULT_QUERY,
        help="Question answered with retrieved local knowledge-base chunks.",
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
        help="Number of retrieved chunks passed to the generation stage.",
    )
    parser.add_argument(
        "--model-name",
        type=str,
        default=DEFAULT_MODEL_NAME,
        help="Local chat model name used by tool.get_completion.",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.2,
        help="Generation temperature for the local model.",
    )
    parser.add_argument(
        "--output-file",
        type=str,
        default=DEFAULT_OUTPUT_FILE,
        help="Filename used to persist the Day40 QA result under index-dir.",
    )
    parser.add_argument(
        "--show-context",
        action="store_true",
        help="Print the assembled context and final answer payload.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Only build retrieval context and prompt, without calling the model.",
    )
    return parser.parse_args()


def main() -> None:
    """
    脚本入口。
    """

    args = parse_args()
    index_dir = args.index_dir.resolve()

    if not index_dir.exists():
        raise SystemExit(f"Index directory does not exist: {index_dir}")
    if not index_dir.is_dir():
        raise SystemExit(f"Index path is not a directory: {index_dir}")
    if args.top_k <= 0:
        raise SystemExit("top-k must be greater than 0")

    index_file = index_dir / "index.json"
    output_file = index_dir / args.output_file

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

    context_text = format_context(results)
    prompt = build_rag_prompt(query=args.query, context_text=context_text)

    if args.dry_run:
        payload = {
            "query": args.query,
            "top_k": args.top_k,
            "dry_run": True,
            "prompt": prompt,
            "sources": [
                {
                    "rank": result.rank,
                    "title": result.title,
                    "source_path": result.source_path,
                    "chunk_id": result.chunk_id,
                }
                for result in results
            ],
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    used_model_name = args.model_name
    generation_mode = "ollama_chat"
    try:
        answer = get_completion(
            prompt,
            system_prompt=DEFAULT_SYSTEM_PROMPT,
            model_name=args.model_name,
            temperature=args.temperature,
        )
    except RuntimeError as exc:
        used_model_name = "offline_extract_fallback"
        generation_mode = "offline_extract_fallback"
        answer = build_fallback_answer(args.query, results)
        print(f"提示：{exc}，已自动回退到基于检索结果的离线回答。\n")

    payload = build_output_payload(
        query=args.query,
        top_k=args.top_k,
        model_name=used_model_name,
        generation_mode=generation_mode,
        answer=answer,
        prompt=prompt,
        results=results,
    )
    write_json(output_file, payload)

    print_answer(answer, results)
    if args.show_context:
        print("\nFull Payload:")
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print(f"\nSaved result to: {output_file}")


if __name__ == "__main__":
    main()
