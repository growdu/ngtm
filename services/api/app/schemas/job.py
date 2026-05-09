from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class JobCreateResponse(BaseModel):
    jobId: UUID
    jobType: str
    status: str


class JobStatusResponse(BaseModel):
    jobId: UUID
    jobType: str
    status: str
    payload: dict[str, Any]
    result: dict[str, Any] | None
    errorMessage: str | None
    createdAt: datetime
    updatedAt: datetime

