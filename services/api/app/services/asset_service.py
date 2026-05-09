from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.repositories.asset_repository import AssetRepository
from app.schemas.asset import IntakeImageRequest, UploadTokenRequest


class AssetService:
    def __init__(self, repository: AssetRepository | None = None) -> None:
        self.repository = repository or AssetRepository()

    def create_upload_token(self, payload: UploadTokenRequest):
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        storage_key = f"uploads/{payload.assetType}/{timestamp}-{uuid4().hex}-{payload.fileName}"
        upload_url = f"http://localhost:9000/placeholder-upload/{storage_key}"
        return {"uploadUrl": upload_url, "storageKey": storage_key}

    def register_uploaded_asset(self, db: Session, *, user_id, payload: IntakeImageRequest):
        return self.repository.create_asset(
            db,
            user_id=user_id,
            asset_type=payload.assetType,
            storage_key=payload.storageKey,
            content_type=payload.contentType,
            metadata=payload.metadata,
        )

