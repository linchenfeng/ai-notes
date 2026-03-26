from fastapi import APIRouter, HTTPException

from app.schemas.text import (
    KeywordRequest,
    KeywordResponse,
    RewriteRequest,
    SentimentRequest,
    SummarizeRequest,
    TextResultResponse,
    TranslateRequest,
    WordCountRequest,
    WordCountResponse,
)
from app.services.text_service import (
    analyze_sentiment,
    count_words,
    extract_keywords,
    rewrite_text,
    summarize_text,
    translate_text,
    uppercase_text,
)

router = APIRouter(prefix="/text", tags=["text"])
ALLOWED_STYLES = ["默认", "正式", "口语", "简洁"]


@router.post("/summarize", response_model=TextResultResponse)
def summarize(data: SummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "summarize", "result": summarize_text(text)}


@router.post("/rewrite", response_model=TextResultResponse)
def rewrite(data: RewriteRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    if data.style not in ALLOWED_STYLES:
        raise HTTPException(status_code=400, detail="unsupported style")
    return {"success": True, "task": "rewrite", "result": rewrite_text(text, data.style)}


@router.post("/keywords", response_model=KeywordResponse)
def keywords(data: KeywordRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "keywords", "result": extract_keywords(text)}


@router.post("/word-count", response_model=WordCountResponse)
def word_count(data: WordCountRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "word_count", "count": count_words(text)}


@router.post("/translate", response_model=TextResultResponse)
def translate(data: TranslateRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "translate", "result": translate_text(text, data.target_language)}


@router.post("/sentiment", response_model=TextResultResponse)
def sentiment(data: SentimentRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "sentiment", "result": analyze_sentiment(text)}


@router.post("/uppercase", response_model=TextResultResponse)
def uppercase(data: SummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    return {"success": True, "task": "uppercase", "result": uppercase_text(text)}
