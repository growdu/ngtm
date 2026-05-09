from app.celery_app import celery_app


@celery_app.task(name="ntgm.health.ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@celery_app.task(name="ntgm.profile.recompute")
def recompute_profile(payload: dict) -> dict:
    return {
        "status": "accepted",
        "message": "Profile recompute task placeholder",
        "payload": payload,
    }
