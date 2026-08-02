from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.analyze import router
from services.pdf_generator import GENERATED_REPORTS_DIR

app = FastAPI(
    title="ComplyAI",
    version="1.0.0",
    description="AI-powered compliance gap analysis between company policies and regulations.",
)

GENERATED_REPORTS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/generated_reports", StaticFiles(directory=str(GENERATED_REPORTS_DIR)), name="generated_reports")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.pdf_generator import GENERATED_REPORTS_DIR
from services.gemini_service import answer_compliance_question


class ChatRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {
        "message": "ComplyAI API is running",
        "version": app.version,
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    reply = answer_compliance_question(request.prompt, request.context)
    return {"reply": reply}


app.include_router(router)