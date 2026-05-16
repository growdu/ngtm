from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class BasicIntakeRequest(BaseModel):
    name: str
    gender: str
    birthDatetime: datetime
    birthPlace: str


class BasicIntakeResponse(BaseModel):
    userId: UUID
    accepted: bool = True
    nextAction: str = "questionnaire"
    profileVersion: int = 1


class UserMeResponse(BaseModel):
    userId: UUID
    name: str | None
    gender: str | None
    birthDatetime: datetime | None
    birthPlace: str | None
    currentProfileVersion: int

