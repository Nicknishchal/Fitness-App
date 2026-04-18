from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserProfile, UserUpdate
from app.routers.deps import get_current_active_user
from app.services.user import UserService

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def read_user_me(
    current_user = Depends(get_current_active_user)
) -> Any:
    current_user["id"] = str(current_user["_id"])
    return current_user

@router.put("/me", response_model=bool)
async def update_user_me(
    user_in: UserUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    user_service = UserService()
    return await user_service.update_user(str(current_user["_id"]), user_in)

@router.delete("/me", response_model=bool)
async def delete_user_me(
    current_user = Depends(get_current_active_user)
) -> Any:
    user_service = UserService()
    return await user_service.delete_user(str(current_user["_id"]))
