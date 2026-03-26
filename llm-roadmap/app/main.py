from fastapi import FastAPI

from app.core.config import APP_NAME, APP_VERSION
from app.routers.llm import router as llm_router
from app.routers.system import router as system_router
from app.routers.text import router as text_router

app = FastAPI(title=APP_NAME, version=APP_VERSION)


@app.get("/")
def home():
    return {"message": f"{APP_NAME} is running."}


app.include_router(system_router)
app.include_router(text_router)
app.include_router(llm_router)
