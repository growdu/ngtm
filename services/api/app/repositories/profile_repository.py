from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models.profile_version import ProfileVersion


class ProfileRepository:
    def get_current(self, db: Session, *, user_id: UUID) -> ProfileVersion | None:
        statement = (
            select(ProfileVersion)
            .where(ProfileVersion.user_id == user_id)
            .order_by(desc(ProfileVersion.version_no))
            .limit(1)
        )
        return db.scalar(statement)

