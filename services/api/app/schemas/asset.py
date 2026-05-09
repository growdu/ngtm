from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class UploadTokenRequest(BaseModel):
    fileName: str
    contentType: str
    assetType: str


class UploadTokenResponse(BaseModel):
    uploadUrl: str
    storageKey: str


class IntakeImageRequest(BaseModel):
    assetType: str
    storageKey: str
    contentType: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class IntakeImageResponse(BaseModel):
    assetId: UUID
    jobTriggered: bool = True
    jobType: str

