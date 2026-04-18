from typing import List, Optional, Dict, Any
from bson import ObjectId
from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorCollection

class PlanRepository(BaseRepository):
    def __init__(self, collection: AsyncIOMotorCollection):
        super().__init__(collection)

    async def get_user_plans(self, user_id: str, difficulty: str = None, days_count: int = None, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if difficulty:
            query["difficulty"] = difficulty
        if days_count:
            query["days_count"] = days_count
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_templates(self, difficulty: str = None, days_count: int = None, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        query = {"is_template": True}
        if difficulty:
            query["difficulty"] = difficulty
        if days_count:
            query["days_count"] = days_count
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def search_exercises(self, name: str) -> List[Dict[str, Any]]:
        # This is a bit complex since exercises are nested in days which are nested in plans
        # We'll use aggregation to find unique exercises across all plans
        pipeline = [
            {"$unwind": "$days"},
            {"$unwind": "$days.exercises"},
            {"$match": {"days.exercises.name": {"$regex": name, "$options": "i"}}},
            {"$project": {
                "exercise": "$days.exercises",
                "plan_id": "$_id",
                "plan_title": "$title"
            }}
        ]
        cursor = self.collection.aggregate(pipeline)
        return await cursor.to_list(length=100)

    # Day Operations (nested)
    async def add_day(self, plan_id: str, day_data: Dict[str, Any]) -> bool:
        day_data["id"] = str(ObjectId())
        day_data["exercises"] = []
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id)},
            {"$push": {"days": day_data}}
        )
        return result.modified_count > 0

    async def update_day(self, plan_id: str, day_id: str, day_data: Dict[str, Any]) -> bool:
        update_query = {f"days.$.{k}": v for k, v in day_data.items()}
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id), "days.id": day_id},
            {"$set": update_query}
        )
        return result.modified_count > 0

    async def delete_day(self, plan_id: str, day_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id)},
            {"$pull": {"days": {"id": day_id}}}
        )
        return result.modified_count > 0

    # Exercise Operations (nested)
    async def add_exercise(self, plan_id: str, day_id: str, exercise_data: Dict[str, Any]) -> bool:
        exercise_data["id"] = str(ObjectId())
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id), "days.id": day_id},
            {"$push": {"days.$.exercises": exercise_data}}
        )
        return result.modified_count > 0

    async def update_exercise(self, plan_id: str, day_id: str, exercise_id: str, exercise_data: Dict[str, Any]) -> bool:
        # Complex update for nested array in nested array
        # First we need to find the indexes or use arrayFilters (supported in modern MongoDB)
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id)},
            {"$set": {f"days.$[day].exercises.$[exercise].{k}": v for k, v in exercise_data.items()}},
            array_filters=[{"day.id": day_id}, {"exercise.id": exercise_id}]
        )
        return result.modified_count > 0

    async def delete_exercise(self, plan_id: str, day_id: str, exercise_id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(plan_id), "days.id": day_id},
            {"$pull": {"days.$.exercises": {"id": exercise_id}}}
        )
        return result.modified_count > 0
