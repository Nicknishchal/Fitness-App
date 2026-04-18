from typing import Any, Dict, List, Optional, Union
from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorCollection

class BaseRepository:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def get(self, id: str) -> Optional[Dict[str, Any]]:
        if not ObjectId.is_valid(id):
            return None
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def get_multi(self, skip: int = 0, limit: int = 100, query: Dict = None) -> List[Dict[str, Any]]:
        if query is None:
            query = {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def create(self, obj_in: Dict[str, Any]) -> str:
        result = await self.collection.insert_one(obj_in)
        return str(result.inserted_id)

    async def update(self, id: str, obj_in: Dict[str, Any]) -> bool:
        result = await self.collection.update_one(
            {"_id": ObjectId(id)}, {"$set": obj_in}
        )
        return result.modified_count > 0

    async def delete(self, id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
