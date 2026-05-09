import uuid
from typing import Any

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class ProfileVersion(TimestampMixin, Base):
    __tablename__ = "profile_versions"
    __table_args__ = (UniqueConstraint("user_id", "version_no", name="uq_profile_versions_user_version"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    version_no: Mapped[int] = mapped_column(Integer, nullable=False)
    summary: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    personality_traits: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    ability_traits: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    relationship_traits: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    fortune_traits: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    confidence_map: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    source_snapshot: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    engine_version: Mapped[str] = mapped_column(String(64), nullable=False, default="v0")

