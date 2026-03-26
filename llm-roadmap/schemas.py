from typing import List

from pydantic import BaseModel


# ===== 请求模型 =====
class SummarizeRequest(BaseModel):
    text: str


class RewriteRequest(BaseModel):
    text: str
    style: str = "默认"


class KeywordRequest(BaseModel):
    text: str


class WordCountRequest(BaseModel):
    text: str


class ProfileRequest(BaseModel):
    name: str
    role: str
    target: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "English"


class SentimentRequest(BaseModel):
    text: str


# ===== 响应模型 =====
class BaseResponse(BaseModel):
    success: bool
    task: str


class TextResultResponse(BaseResponse):
    result: str


class KeywordResponse(BaseResponse):
    result: List[str]


class WordCountResponse(BaseResponse):
    count: int


class SummarizeResponse(BaseResponse):
    original_text: str
    result: str


class RewriteResponse(BaseResponse):
    style: str
    result: str


class ErrorResponse(BaseModel):
    success: bool
    error: str
