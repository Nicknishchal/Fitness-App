from datetime import datetime
from app.repositories.progress import ProgressRepository
from app.schemas.progress import ProgressCreate, ProgressUpdate
from app.db.mongodb import get_database

class ProgressService:
    def __init__(self):
        db = get_database()
        self.repository = ProgressRepository(db.progress)

    async def track_exercise(self, progress_in: ProgressCreate, user_id: str):
        progress_data = progress_in.model_dump()
        progress_data["user_id"] = user_id
        progress_data["completed_at"] = datetime.now()
        return await self.repository.create(progress_data)

    async def get_user_history(self, user_id: str, skip: int = 0, limit: int = 100):
        return await self.repository.get_user_progress(user_id, skip, limit)

    async def get_day_progress(self, user_id: str, plan_id: str, day_id: str):
        return await self.repository.get_day_progress(user_id, plan_id, day_id)

    async def update_track(self, progress_id: str, progress_in: ProgressUpdate):
        return await self.repository.update(progress_id, progress_in.model_dump(exclude_unset=True))

    async def get_streak(self, user_id: str):
        return await self.repository.get_streak(user_id)
