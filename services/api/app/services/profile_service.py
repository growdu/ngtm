from sqlalchemy.orm import Session

from app.repositories.profile_repository import ProfileRepository


class ProfileService:
    def __init__(self, repository: ProfileRepository | None = None) -> None:
        self.repository = repository or ProfileRepository()

    def get_current_profile(self, db: Session, *, user_id):
        return self.repository.get_current(db, user_id=user_id)

