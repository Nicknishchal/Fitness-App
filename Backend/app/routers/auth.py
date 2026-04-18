from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.user import UserService
from app.schemas.user import UserCreate, UserProfile
from app.schemas.token import Token
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/signup", response_model=UserProfile)
async def signup(user_in: UserCreate) -> Any:
    user_service = UserService()
    user_id = await user_service.signup(user_in)
    user = await user_service.get_profile(user_id)
    return user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user_service = UserService()
    user = await user_service.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user["_id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
