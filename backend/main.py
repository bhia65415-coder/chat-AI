from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from config import FRONTEND_ORIGIN, add_ownership_watermark
from database import SessionLocal, get_db, init_db
from routers import auth, chat, fraud, scams, whatsapp
from services.scheduler import start_scheduler
from services.scraper import refresh_from_seed, refresh_from_official_sources

app = FastAPI(title="Fintech.AI Backend", version="1.0.0-prototype")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://fintech-final-lovat.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def _startup():
    init_db()
    db = SessionLocal()
    try:
        refresh_from_seed(db)
    finally:
        db.close()
    start_scheduler(SessionLocal)  # ✅ pass SessionLocal

@app.get("/health")
def health():
    return add_ownership_watermark({"ok": True})

@app.get("/api/data/refresh")
def manual_refresh(db: Session = Depends(get_db)):
    n = refresh_from_official_sources(db)
    return add_ownership_watermark({"ok": True, "fetched": n})

app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(scams.router)
app.include_router(whatsapp.router)
app.include_router(fraud.router)