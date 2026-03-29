"""
Fetch trending fraud headlines from public news pages (best-effort; sites change HTML).
Falls back to static alert if scraping fails.
"""
from __future__ import annotations

import logging
import re
from datetime import datetime, timezone
from typing import Any

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
)
TIMEOUT = 12


def _fetch_soup(url: str) -> BeautifulSoup | None:
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        logger.warning("fetch failed %s: %s", url, e)
        return None


def scrape_moneycontrol_fraud(max_items: int = 5) -> list[str]:
    url = "https://www.moneycontrol.com/news/tags/fraud.html"
    soup = _fetch_soup(url)
    if not soup:
        return []
    titles: list[str] = []
    for a in soup.select("a[href*='/news/']"):
        t = (a.get_text() or "").strip()
        if len(t) < 20 or len(t) > 200:
            continue
        if t not in titles:
            titles.append(t)
        if len(titles) >= max_items:
            break
    return titles


def scrape_et_fraud(max_items: int = 5) -> list[str]:
    url = "https://economictimes.indiatimes.com/topic/financial-fraud"
    soup = _fetch_soup(url)
    if not soup:
        return []
    titles: list[str] = []
    for a in soup.select("a[href*='articleshow']"):
        t = (a.get_text() or "").strip()
        t = re.sub(r"\s+", " ", t)
        if len(t) < 15:
            continue
        if t not in titles:
            titles.append(t)
        if len(titles) >= max_items:
            break
    return titles


def get_trending_fraud_alert() -> dict[str, Any]:
    """
    Returns banner text + precaution for UI.
    """
    headlines = scrape_moneycontrol_fraud(3) or scrape_et_fraud(3)
    ist = datetime.now(timezone.utc).strftime("%Y-%m-%d UTC")
    if headlines:
        top = headlines[0]
        precaution = (
            "Do not act on urgent payment requests; verify in your official bank/UPI app before paying."
        )
        return {
            "updated_at": ist,
            "headline": top,
            "headlines": headlines,
            "precaution_en": precaution,
            "precaution_hi": "जल्दबाज़ी में पेमेंट न करें; भुगतान से पहले अपने आधिकारिक बैंक/UPI ऐप में जाँच करें।",
        }

    return {
        "updated_at": ist,
        "headline": "Stay alert: verify UPI payee name; never share OTP on calls; for cyber fraud call 1930.",
        "headlines": [],
        "precaution_en": "If someone pressures you to scan a QR or share OTP, stop and contact your bank on the official number.",
        "precaution_hi": "अगर कोई QR स्कैन या OTP माँगे, रुकें और बैंक के आधिकारिक नंबर पर कॉल करें।",
    }
