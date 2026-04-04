"""
APScheduler jobs: refresh trending cache periodically (in-process).
"""
from __future__ import annotations

import logging
import threading
from typing import Any

from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

_cache: dict[str, Any] = {}
_lock = threading.Lock()


def get_cached_trending() -> dict[str, Any] | None:
    with _lock:
        return _cache.get("trending")


def set_cached_trending(data: dict[str, Any]) -> None:
    with _lock:
        _cache["trending"] = data


def _refresh_job():
    try:
        from services.scraper import get_trending_fraud_alert  # ✅ Fixed import

        set_cached_trending(get_trending_fraud_alert())
        logger.info("Trending fraud cache refreshed.")
    except Exception as e:
        logger.exception("Trending refresh failed: %s", e)


def start_scheduler() -> BackgroundScheduler:  # ✅ No parameters
    sched = BackgroundScheduler()
    sched.add_job(_refresh_job, "interval", hours=6, id="trending_fraud", replace_existing=True)
    sched.start()
    _refresh_job()
    return sched