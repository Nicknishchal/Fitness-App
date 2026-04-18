from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from bson import ObjectId
from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorCollection

class ProgressRepository(BaseRepository):
    def __init__(self, collection: AsyncIOMotorCollection):
        super().__init__(collection)

    async def get_user_progress(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        cursor = self.collection.find({"user_id": user_id}).sort("completed_at", -1).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_day_progress(self, user_id: str, plan_id: str, day_id: str) -> List[Dict[str, Any]]:
        cursor = self.collection.find({
            "user_id": user_id,
            "plan_id": plan_id,
            "day_id": day_id
        })
        return await cursor.to_list(length=100)

    async def get_streak(self, user_id: str) -> int:
        # Simple streak calculation: count consecutive days backwards from today
        streak = 0
        current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        while True:
            next_date = current_date - timedelta(days=1)
            count = await self.collection.count_documents({
                "user_id": user_id,
                "completed_at": {"$gte": current_date, "$lt": current_date + timedelta(days=1)}
            })
            if count > 0:
                streak += 1
                current_date = next_date
            else:
                # Check if they worked out yesterday but not today yet
                if streak == 0:
                    current_date = next_date
                    continue
                break
        return streak
