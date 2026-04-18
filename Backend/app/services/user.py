from typing import Optional
from fastapi import HTTPException, status
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.mongodb import get_database

class UserService:
    def __init__(self):
        db = get_database()
        self.repository = UserRepository(db.users)

    async def signup(self, user_in: UserCreate):
        existing_user = await self.repository.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )
        
        user_data = user_in.model_dump()
        user_data["password"] = get_password_hash(user_data["password"])
        user_id = await self.repository.create(user_data)
        return user_id

    async def authenticate(self, email: str, password: str):
        user = await self.repository.get_by_email(email)
        if not user or not verify_password(password, user["password"]):
            return None
        return user

    async def get_profile(self, user_id: str):
        user = await self.repository.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user["id"] = str(user["_id"])
        return user

    async def update_user(self, user_id: str, user_in: UserUpdate):
        update_data = user_in.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])
        
        success = await self.repository.update(user_id, update_data)
        return success

    async def delete_user(self, user_id: str):
        return await self.repository.delete(user_id)
