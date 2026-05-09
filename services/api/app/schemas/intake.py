from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class IntakeRecordItem(BaseModel):
    recordId: UUID
    intakeType: str
    sourceChannel: str
    payload: dict[str, Any]
    confidence: float | None
    submittedAt: datetime

