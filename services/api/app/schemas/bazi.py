from typing import Any
from uuid import UUID

from pydantic import BaseModel


class BaziCurrentResponse(BaseModel):
    analysisId: UUID
    chart: dict[str, str]
    featureData: dict[str, Any]
    interpretationData: dict[str, Any]
    score: int
    confidence: float
    engineVersion: str

