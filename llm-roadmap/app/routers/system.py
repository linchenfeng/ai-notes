from fastapi import APIRouter

from app.core.config import APP_ENV, APP_NAME, APP_VERSION, DEBUG, OLLAMA_BASE_URL, OLLAMA_MODEL

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/health")
def health():
    return {"status": "healthy"}


@router.get("/version")
def version():
    return {"version": APP_VERSION}


@router.get("/ping")
def ping():
    return {"status": "ok"}


@router.get("/config")
def config_info():
    return {
        "app_name": APP_NAME,
        "app_env": APP_ENV,
        "app_version": APP_VERSION,
        "provider": "ollama",
        "model_name": OLLAMA_MODEL,
        "base_url": OLLAMA_BASE_URL,
        "debug": DEBUG,
    }


@router.get("/llm-ready")
def llm_ready():
    return {
        "ready": bool(OLLAMA_BASE_URL and OLLAMA_MODEL),
        "message": "Ollama config is ready." if (OLLAMA_BASE_URL and OLLAMA_MODEL) else "Ollama config is missing.",
    }
