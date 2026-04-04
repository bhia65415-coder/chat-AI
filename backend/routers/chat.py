from __future__ import annotations

import uuid  # ✅ import at top

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from config import add_ownership_watermark
from database import ChatSession, Message, get_db
from services.ai_engine import build_response

router = APIRouter(tags=["chat"])


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    language_code: str = Field(default="en", max_length=10)
    session_id: str | None = Field(default=None, max_length=100)


@router.post("/api/chat")
def chat(payload: ChatIn, db: Session = Depends(get_db)):
    session_id = payload.session_id or str(uuid.uuid4())  # ✅ fix is INSIDE function

    sess = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not sess:
        sess = ChatSession(session_id=session_id, language=payload.language_code)
        db.add(sess)
        db.commit()
        db.refresh(sess)

    db.add(Message(session_id=session_id, role="user", content=payload.message))
    db.commit()

    severity, scam_type, answer, action_plan, whatsapp_ready_text = build_response(
        payload.message, payload.language_code
    )

    db.add(Message(session_id=session_id, role="assistant", content=answer))
    db.commit()

    official_links = [
        {"label": "Cybercrime.gov.in", "url": "https://cybercrime.gov.in"},
        {"label": "Helpline 1930", "url": "https://cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx"},
        {"label": "RBI", "url": "https://www.rbi.org.in"},
        {"label": "SEBI", "url": "https://www.sebi.gov.in"},
        {"label": "NPCI", "url": "https://www.npci.org.in"},
    ]

    return add_ownership_watermark(
        {
            "language": payload.language_code,
            "severity": severity,
            "scam_type": scam_type,
            "answer": answer,
            "action_plan": action_plan,
            "official_links": official_links,
            "whatsapp_ready_text": whatsapp_ready_text,
        }
    )