from uuid import UUID

from sqlalchemy import delete, desc, select
from sqlalchemy.orm import Session

from app.models.bazi_analysis import BaziAnalysis


class BaziRepository:
    def replace_current(
        self,
        db: Session,
        *,
        user_id: UUID,
        year_gz: str,
        month_gz: str,
        day_gz: str,
        hour_gz: str,
        chart_data: dict,
        feature_data: dict,
        interpretation_data: dict,
        score: int,
        confidence,
        engine_version: str = "bazi-v0",
    ) -> BaziAnalysis:
        db.execute(delete(BaziAnalysis).where(BaziAnalysis.user_id == user_id))
        analysis = BaziAnalysis(
            user_id=user_id,
            year_gz=year_gz,
            month_gz=month_gz,
            day_gz=day_gz,
            hour_gz=hour_gz,
            chart_data=chart_data,
            feature_data=feature_data,
            interpretation_data=interpretation_data,
            score=score,
            confidence=confidence,
            engine_version=engine_version,
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis

    def get_current(self, db: Session, *, user_id: UUID) -> BaziAnalysis | None:
        statement = (
            select(BaziAnalysis)
            .where(BaziAnalysis.user_id == user_id)
            .order_by(desc(BaziAnalysis.created_at))
            .limit(1)
        )
        return db.scalar(statement)

