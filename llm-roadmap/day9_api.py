from fastapi import FastAPI

from schemas import (
    KeywordRequest,
    KeywordResponse,
    ProfileRequest,
    RewriteRequest,
    RewriteResponse,
    SentimentRequest,
    SummarizeRequest,
    SummarizeResponse,
    TextResultResponse,
    TranslateRequest,
    WordCountRequest,
    WordCountResponse,
)
from services import (
    analyze_profile,
    analyze_sentiment,
    count_words,
    extract_keywords,
    rewrite_text,
    summarize_text,
    translate_text,
)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Day 9 API is running."}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/summarize", response_model=SummarizeResponse)
def summarize(data: SummarizeRequest):
    return {
        "success": True,
        "task": "summarize",
        "original_text": data.text,
        "result": summarize_text(data.text),
    }


@app.post("/rewrite", response_model=RewriteResponse)
def rewrite(data: RewriteRequest):
    return {
        "success": True,
        "task": "rewrite",
        "style": data.style,
        "result": rewrite_text(data.text, data.style),
    }


@app.post("/keywords", response_model=KeywordResponse)
def keywords(data: KeywordRequest):
    return {
        "success": True,
        "task": "keywords",
        "result": extract_keywords(data.text),
    }


@app.post("/word-count", response_model=WordCountResponse)
def word_count(data: WordCountRequest):
    return {
        "success": True,
        "task": "word_count",
        "count": count_words(data.text),
    }


@app.post("/analyze-profile", response_model=TextResultResponse)
def analyze_user_profile(data: ProfileRequest):
    return {
        "success": True,
        "task": "analyze_profile",
        "result": analyze_profile(data.name, data.role, data.target),
    }


@app.post("/translate", response_model=TextResultResponse)
def translate(data: TranslateRequest):
    return {
        "success": True,
        "task": "translate",
        "result": translate_text(data.text, data.target_language),
    }


@app.post("/sentiment", response_model=TextResultResponse)
def sentiment(data: SentimentRequest):
    return {
        "success": True,
        "task": "sentiment",
        "result": analyze_sentiment(data.text),
    }
