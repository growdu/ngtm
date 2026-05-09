from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.asset import (
    IntakeImageRequest,
    IntakeImageResponse,
    UploadTokenRequest,
    UploadTokenResponse,
)
from app.services.asset_service import AssetService
from app.services.user_service import UserService

router = APIRouter(tags=["assets"])


@router.post("/assets/upload-token", response_model=UploadTokenResponse)
def create_upload_token(
    payload: UploadTokenRequest,
    service: AssetService = Depends(AssetService),
) -> UploadTokenResponse:
    token = service.create_upload_token(payload)
    return UploadTokenResponse(**token)


@router.post("/users/intake/images", response_model=IntakeImageResponse)
def confirm_upload(
    payload: IntakeImageRequest,
    db: Session = Depends(get_db),
    user_service: UserService = Depends(UserService),
    asset_service: AssetService = Depends(AssetService),
) -> IntakeImageResponse:
    user = user_service.get_current_user(db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    asset = asset_service.register_uploaded_asset(db, user_id=user.id, payload=payload)
    job_type = "analyze_face" if payload.assetType == "face" else "analyze_palm"
    return IntakeImageResponse(assetId=asset.id, jobType=job_type)

