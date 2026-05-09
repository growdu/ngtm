import uuid
from decimal import Decimal
from typing import Any

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class BaziAnalysis(TimestampMixin, Base):
    __tablename__ = "bazi_analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    year_gz: Mapped[str] = mapped_column(String(8), nullable=False)
    month_gz: Mapped[str] = mapped_column(String(8), nullable=False)
    day_gz: Mapped[str] = mapped_column(String(8), nullable=False)
    hour_gz: Mapped[str] = mapped_column(String(8), nullable=False)
    chart_data: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    feature_data: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    interpretation_data: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    confidence: Mapped[Decimal] = mapped_column(nullable=False)
    engine_version: Mapped[str] = mapped_column(String(32), nullable=False, default="bazi-v0")

