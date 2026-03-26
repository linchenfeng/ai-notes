from fastapi import Body, FastAPI

from services import (
    analyze_profile,
    count_words,
    extract_keywords,
    rewrite_text,
    summarize_text,
    uppercase_text,
)

app = FastAPI()


@app.get("/")
def home():
    # 首页只负责告诉调用方服务已经启动。
    return {"message": "Day 7 AI service is running."}


@app.get("/ping")
def ping():
    return {"status": "ok"}


@app.post("/summarize")
def summarize(data: dict = Body(...)):
    # 接口层只负责取参数、做基础校验和组织返回值。
    text = data.get("text", "")
    if not text:
        return {"success": False, "error": "text is required"}

    return {
        "success": True,
        "task": "summarize",
        "original_text": text,
        "result": summarize_text(text),
    }


@app.post("/rewrite")
def rewrite(data: dict = Body(...)):
    text = data.get("text", "")
    style = data.get("style", "默认")
    if not text:
        return {"success": False, "error": "text is required"}

    return {
        "success": True,
        "task": "rewrite",
        "style": style,
        "original_text": text,
        "result": rewrite_text(text, style),
    }


@app.post("/keywords")
def keywords(data: dict = Body(...)):
    text = data.get("text", "")
    if not text:
        return {"success": False, "error": "text is required"}

    return {
        "success": True,
        "task": "keywords",
        "original_text": text,
        "result": extract_keywords(text),
    }


@app.post("/word-count")
def word_count(data: dict = Body(...)):
    text = data.get("text", "")
    if not text:
        return {"success": False, "error": "text is required"}

    return {
        "success": True,
        "task": "word_count",
        "count": count_words(text),
    }


@app.post("/uppercase")
def uppercase(data: dict = Body(...)):
    text = data.get("text", "")
    if not text:
        return {"success": False, "error": "text is required"}

    return {
        "success": True,
        "task": "uppercase",
        "result": uppercase_text(text),
    }


@app.post("/analyze-profile")
def analyze_user_profile(data: dict = Body(...)):
    name = data.get("name", "")
    role = data.get("role", "")
    target = data.get("target", "")
    if not name or not role or not target:
        return {"success": False, "error": "name, role and target are required"}

    return {
        "success": True,
        "task": "analyze_profile",
        "result": analyze_profile(name, role, target),
    }
