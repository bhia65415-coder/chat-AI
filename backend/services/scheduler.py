from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from services.scraper import refresh_from_official_sources


def start_scheduler(db_factory) -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone="Asia/Kolkata")

    def job():
        db: Session = db_factory()
        try:
            refresh_from_official_sources(db)
        finally:
            db.close()

    scheduler.add_job(job, "interval", hours=6, id="refresh_scam_data", replace_existing=True)
    scheduler.start()
    return scheduler