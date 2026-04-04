from __future__ import annotations

import logging
from dataclasses import dataclass

from config import GROQ_API_KEY, GROQ_MODEL
from services.translator import translate_response

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Fintech.AI, India's most trusted financial safety assistant, created by Abhishek Tiwari.

Your core purpose:
1. Educate Indian citizens about financial scams, frauds, and regulatory requirements
2. Provide real-time information about UPI fraud, banking fraud, investment scams, insurance fraud, and cybercrime
3. Answer all queries in the user's chosen Indian regional language
4. Always cite official Indian regulatory sources: RBI, SEBI, IRDAI, NPCI, Cybercrime.gov.in
5. For every scam reported by the user, provide: (a) What this scam is, (b) How to stop it immediately, (c) How to report it officially, (d) How to recover money if possible

Rules:
- ALWAYS respond in English unless the user explicitly writes in another language
- ALWAYS end with the official helpline: Cyber Crime Helpline 1930
- NEVER give investment advice or stock tips
- If a user describes an ongoing fraud, treat it as URGENT and guide them to call 1930 immediately
"""


@dataclass
class EngineResult:
    severity: str
    scam_type: str
    answer_en: str
    action_plan_en: list[str]


def _classify(message: str) -> tuple[str, str]:
    m = message.lower()
    if any(k in m for k in ["otp", "upi pin", "mpin", "pin", "cvv"]):
        return "HIGH", "Credential/OTP Harvesting"
    if any(k in m for k in ["collect request", "collect", "qr", "scan", "qr code"]):
        return "HIGH", "UPI Collect / QR Trap"
    if any(k in m for k in ["telegram", "task", "like", "part-time", "part time", "earn", "withdraw"]):
        return "HIGH", "Task/Job Scam"
    if any(k in m for k in ["kyc", "link", "sms", "suspicious link", "phishing"]):
        return "MEDIUM", "Phishing / KYC Link Scam"
    if any(k in m for k in ["investment", "stock", "crypto", "guaranteed return", "tip"]):
        return "MEDIUM", "Investment Scam (No advice)"
    return "LOW", "General Financial Safety Query"


def _offline_response(message: str) -> EngineResult:
    severity, scam_type = _classify(message)
    urgent = any(k in message.lower() for k in ["just now", "ongoing", "currently", "minutes ago", "debit", "debited"])

    answer = (
        f"Based on what you described, this looks like: {scam_type}.\n\n"
        "What this is:\n"
        "Scammers try to trick you into authorizing a payment or sharing sensitive credentials (OTP/UPI PIN/password), "
        "or clicking a link that captures your details.\n\n"
        "How to stop it immediately:\n"
        "- Do NOT share OTP/UPI PIN/CVV.\n"
        "- Do NOT approve any UPI collect request.\n"
        "- If you already shared something, change passwords/MPINs and contact your bank immediately.\n\n"
        "How to report officially:\n"
        "- Report at cybercrime.gov.in\n"
        "- Call the Cyber Crime Helpline 1930\n"
    )
    if urgent:
        answer = (
            "URGENT: If money is being transferred right now or just got debited, call 1930 immediately.\n\n"
            + answer
        )

    action_plan = [
        "If money was debited or fraud is ongoing, call 1930 immediately.",
        "Notify your bank/UPI app support via official in-app channel; request to block/raise dispute.",
        "Preserve evidence: screenshots, SMS, call details, UPI/transaction IDs, URLs.",
        "File a report on cybercrime.gov.in as soon as possible (time matters for recovery).",
    ]
    return EngineResult(severity=severity, scam_type=scam_type, answer_en=answer, action_plan_en=action_plan)


def _llm_response(message: str) -> EngineResult | None:
    if not GROQ_API_KEY:
        return None
    try:
        from groq import Groq

        client = Groq(api_key=GROQ_API_KEY)
        chat = client.chat.completions.create(
            model=GROQ_MODEL,  # ✅ uses llama-3.3-70b-versatile
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            temperature=0.2,
        )
        text = (chat.choices[0].message.content or "").strip()
        if text:
            severity, scam_type = _classify(message)
            return EngineResult(
                severity=severity,
                scam_type=scam_type,
                answer_en=text,
                action_plan_en=_offline_response(message).action_plan_en
            )
    except Exception as e:
        logger.warning("Groq failed: %s", e)
    return None


def build_response(message: str, language_code: str) -> tuple[str, str, str, list[str], str]:
    res = _llm_response(message) or _offline_response(message)

    helpline_en = "Cybercrime Helpline: 1930 | Report at: cybercrime.gov.in"
    answer_en = res.answer_en.strip()
    if not answer_en.endswith("1930"):
        answer_en = f"{answer_en}\n\n{helpline_en}"

    answer = translate_response(answer_en, language_code)
    action_plan = [translate_response(x, language_code) for x in res.action_plan_en]
    scam_type = translate_response(res.scam_type, language_code)

    whatsapp_text_en = (
        "🔴 *Fintech.AI Alert*\n"
        "---\n"
        f"*Scam Type:* {res.scam_type}\n"
        f"*What happened:* {message[:160]}\n"
        "*Do this NOW:*\n"
        "1. If fraud is ongoing or money was debited, call 1930 immediately.\n"
        "2. Contact your bank/UPI app via official channel and block/dispute.\n"
        "3. Report at cybercrime.gov.in and save evidence.\n"
        "*Report here:* cybercrime.gov.in\n"
        "*Helpline:* 1930\n"
        "---\n"
        "_Fintech.AI - Your All Time Friend to Help You_"
    )
    whatsapp_text = translate_response(whatsapp_text_en, language_code)
    return res.severity, scam_type, answer, action_plan, whatsapp_text
