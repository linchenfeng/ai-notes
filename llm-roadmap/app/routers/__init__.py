from .llm import router as llm_router
from .system import router as system_router
from .text import router as text_router

__all__ = ["text_router", "system_router", "llm_router"]
