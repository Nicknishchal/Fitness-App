from typing import Optional
from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorCollection

class UserRepository(BaseRepository):
    def __init__(self, collection: AsyncIOMotorCollection):
        super().__init__(collection)

    async def get_by_email(self, email: str) -> Optional[dict]:
        return await self.collection.find_one({"email": email})
