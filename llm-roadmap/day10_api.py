from fastapi import FastAPI, HTTPException

from schemas import (
    KeywordRequest,
    KeywordResponse,
    ProfileRequest,
    RewriteRequest,
    SentimentRequest,
    SummarizeRequest,
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
    get_mock_post,
    rewrite_text,
    summarize_text,
    translate_text,
)

app = FastAPI()

ALLOWED_STYLES = ["默认", "正式", "口语", "简洁"]


@app.get("/")
def home():
    return {"message": "Day 10 API is running."}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/summarize", response_model=TextResultResponse)
def summarize(data: SummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    return {
        "success": True,
        "task": "summarize",
        "result": summarize_text(text),
    }


@app.post("/short-summary", response_model=TextResultResponse)
def short_summary(data: SummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    if len(text) < 10:
        raise HTTPException(status_code=400, detail="text is too short")

    return {
        "success": True,
        "task": "short_summary",
        "result": summarize_text(text),
    }


@app.post("/rewrite", response_model=TextResultResponse)
def rewrite(data: RewriteRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    if data.style not in ALLOWED_STYLES:
        raise HTTPException(status_code=400, detail="unsupported style")

    return {
        "success": True,
        "task": "rewrite",
        "result": rewrite_text(text, data.style),
    }


@app.post("/keywords", response_model=KeywordResponse)
def keywords(data: KeywordRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    return {
        "success": True,
        "task": "keywords",
        "result": extract_keywords(text),
    }


@app.post("/word-count", response_model=WordCountResponse)
def word_count(data: WordCountRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    return {
        "success": True,
        "task": "word_count",
        "count": count_words(text),
    }


@app.post("/analyze-profile", response_model=TextResultResponse)
def analyze_user_profile(data: ProfileRequest):
    name = data.name.strip()
    role = data.role.strip()
    target = data.target.strip()

    if not name:
        raise HTTPException(status_code=400, detail="name cannot be empty")
    if not role:
        raise HTTPException(status_code=400, detail="role cannot be empty")
    if not target:
        raise HTTPException(status_code=400, detail="target cannot be empty")

    return {
        "success": True,
        "task": "analyze_profile",
        "result": analyze_profile(name, role, target),
    }


@app.post("/translate", response_model=TextResultResponse)
def translate(data: TranslateRequest):
    text = data.text.strip()
    target_language = data.target_language.strip()

    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")
    if not target_language:
        raise HTTPException(status_code=400, detail="target_language cannot be empty")

    return {
        "success": True,
        "task": "translate",
        "result": translate_text(text, target_language),
    }


@app.post("/sentiment", response_model=TextResultResponse)
def sentiment(data: SentimentRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    return {
        "success": True,
        "task": "sentiment",
        "result": analyze_sentiment(text),
    }


@app.get("/posts/{post_id}")
def get_post(post_id: int):
    post = get_mock_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="post not found")

    return {
        "success": True,
        "task": "get_post",
        "result": post,
    }


@app.get("/error-demo")
def error_demo():
    x = 1 / 0
    return {"result": x}
