from fastapi import FastAPI

from schemas import (
    KeywordRequest,
    ProfileRequest,
    RewriteRequest,
    SentimentRequest,
    SummarizeRequest,
    TranslateRequest,
    WordCountRequest,
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
    return {"message": "Day 8 API is running."}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/summarize")
def summarize(data: SummarizeRequest):
    return {
        "success": True,
        "task": "summarize",
        "original_text": data.text,
        "result": summarize_text(data.text),
    }


@app.post("/rewrite")
def rewrite(data: RewriteRequest):
    return {
        "success": True,
        "task": "rewrite",
        "style": data.style,
        "original_text": data.text,
        "result": rewrite_text(data.text, data.style),
    }


@app.post("/keywords")
def keywords(data: KeywordRequest):
    return {
        "success": True,
        "task": "keywords",
        "original_text": data.text,
        "result": extract_keywords(data.text),
    }


@app.post("/word-count")
def word_count(data: WordCountRequest):
    return {"success": True, "task": "word_count", "count": count_words(data.text)}


@app.post("/analyze-profile")
def analyze_user_profile(data: ProfileRequest):
    return {
        "success": True,
        "task": "analyze_profile",
        "result": analyze_profile(data.name, data.role, data.target),
    }


@app.post("/translate")
def translate(data: TranslateRequest):
    return {
        "success": True,
        "task": "translate",
        "target_language": data.target_language,
        "result": translate_text(data.text, data.target_language),
    }


@app.post("/sentiment")
def sentiment(data: SentimentRequest):
    return {
        "success": True,
        "task": "sentiment",
        "result": analyze_sentiment(data.text),
    }
