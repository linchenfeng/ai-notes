from fastapi import APIRouter, HTTPException

from app.core.config import OLLAMA_BASE_URL, OLLAMA_MODEL
from app.schemas.llm import (
    LLMChatRequest,
    LLMChatResponse,
    LLMRewriteRequest,
    LLMSummarizeRequest,
    LLMTaskRequest,
    LLMTaskResponse,
    LLMTextResponse,
    SessionRequest,
)
from app.services.llm_service import (
    LLMConfigError,
    LLMConnectionError,
    LLMRequestError,
    LLMTimeoutError,
    chat_once_with_llm,
    chat_with_llm,
    reset_session,
    rewrite_with_llm,
    run_prompt_task,
    summarize_with_llm,
)

router = APIRouter(prefix="/llm", tags=["llm"])


@router.get("/ready")
def llm_ready():
    # 就绪检查：便于联调前确认模型配置
    return {
        "ready": bool(OLLAMA_BASE_URL and OLLAMA_MODEL),
        "provider": "ollama",
        "base_url": OLLAMA_BASE_URL,
        "model": OLLAMA_MODEL,
    }


@router.post("/summarize", response_model=LLMTextResponse)
def llm_summarize(data: LLMSummarizeRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    try:
        result = summarize_with_llm(text)
        return {
            "success": True,
            "task": "llm_summarize",
            "result": result,
            "model": OLLAMA_MODEL,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except LLMConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except LLMConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except LLMRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"unexpected error: {exc}") from exc


@router.post("/rewrite", response_model=LLMTextResponse)
def llm_rewrite(data: LLMRewriteRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    try:
        result = rewrite_with_llm(text, data.style)
        return {
            "success": True,
            "task": "llm_rewrite",
            "result": result,
            "model": OLLAMA_MODEL,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except LLMConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except LLMConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except LLMRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"unexpected error: {exc}") from exc


@router.post("/task", response_model=LLMTaskResponse)
def llm_task(data: LLMTaskRequest):
    # Prompt 练习入口：通过 task 分发到不同模板
    task = data.task.strip()
    text = data.text.strip()

    if not task:
        raise HTTPException(status_code=400, detail="task cannot be empty")
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    try:
        result = run_prompt_task(task, text, data.style)
        return {
            "success": True,
            "task": task,
            "result": result,
            "model": OLLAMA_MODEL,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except LLMConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except LLMConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except LLMRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"unexpected error: {exc}") from exc


@router.post("/chat-once", response_model=LLMTextResponse)
def llm_chat_once(data: LLMSummarizeRequest):
    message = data.text.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    try:
        result = chat_once_with_llm(message)
        return {
            "success": True,
            "task": "llm_chat_once",
            "result": result,
            "model": OLLAMA_MODEL,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except LLMConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except LLMConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except LLMRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"unexpected error: {exc}") from exc


@router.post("/chat", response_model=LLMChatResponse)
def llm_chat(data: LLMChatRequest):
    # 多轮聊天：同一个 session_id 才会延续上下文
    session_id = data.session_id.strip()
    message = data.message.strip()

    if not session_id:
        raise HTTPException(status_code=400, detail="session_id cannot be empty")
    if not message:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    try:
        result, has_context = chat_with_llm(session_id, message)
        return {
            "success": True,
            "task": "llm_chat",
            "session_id": session_id,
            "result": result,
            "model": OLLAMA_MODEL,
            "has_context": has_context,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except LLMConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except LLMConnectionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except LLMTimeoutError as exc:
        raise HTTPException(status_code=504, detail=str(exc)) from exc
    except LLMRequestError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"unexpected error: {exc}") from exc


@router.post("/reset-session")
def llm_reset_session(data: SessionRequest):
    session_id = data.session_id.strip()
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id cannot be empty")

    try:
        cleared = reset_session(session_id)
        return {
            "success": True,
            "task": "llm_reset_session",
            "session_id": session_id,
            "cleared": cleared,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
