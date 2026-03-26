from pydantic import BaseModel
from typing import List


class SummarizeRequest(BaseModel):
    text: str


class RewriteRequest(BaseModel):
    text: str
    style: str = "默认"


class KeywordRequest(BaseModel):
    text: str


class WordCountRequest(BaseModel):
    text: str


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "English"


class SentimentRequest(BaseModel):
    text: str


class BaseResponse(BaseModel):
    success: bool
    task: str


class TextResultResponse(BaseResponse):
    result: str


class KeywordResponse(BaseResponse):
    result: List[str]


class WordCountResponse(BaseResponse):
    count: int
