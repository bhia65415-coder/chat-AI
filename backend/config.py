import os
from dotenv import load_dotenv

load_dotenv()

PRODUCT_NAME = "Fintech.AI"
OWNER_NAME = "Abhishek Tiwari"
VERSION = "1.0.0-prototype"
COPYRIGHT = "© 2026 Abhishek Tiwari. All Rights Reserved."

OWNER_MASTER_KEY = os.getenv("OWNER_MASTER_KEY", "")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_MINUTES = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fintech_ai.db")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "")


def add_ownership_watermark(response: dict) -> dict:
    response["_meta"] = {
        "product": PRODUCT_NAME,
        "owner": OWNER_NAME,
        "version": VERSION,
        "powered_by": "Fintech.AI Engine v1",
        "copyright": COPYRIGHT,
    }
    return response

