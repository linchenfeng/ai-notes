from pydantic import BaseModel


class LLMSummarizeRequest(BaseModel):
    text: str


class LLMRewriteRequest(BaseModel):
    text: str
    style: str = "正式"


class LLMChatRequest(BaseModel):
    session_id: str
    message: str


class SessionRequest(BaseModel):
    session_id: str


class LLMTaskRequest(BaseModel):
    task: str
    text: str
    style: str = "正式"


class LLMTextResponse(BaseModel):
    success: bool
    task: str
    result: str
    model: str


class LLMChatResponse(BaseModel):
    success: bool
    task: str
    session_id: str
    result: str
    model: str
    has_context: bool


class LLMTaskResponse(BaseModel):
    success: bool
    task: str
    result: str
    model: str
