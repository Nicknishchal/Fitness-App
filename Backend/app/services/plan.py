from typing import List, Optional
from fastapi import HTTPException
from bson import ObjectId
from app.repositories.plan import PlanRepository
from app.schemas.plan import PlanCreate, PlanUpdate, DayCreate, ExerciseCreate, DayUpdate, ExerciseUpdate
from app.db.mongodb import get_database

class PlanService:
    def __init__(self):
        db = get_database()
        self.repository = PlanRepository(db.plans)

    async def create_plan(self, plan_in: PlanCreate, user_id: str):
        plan_data = plan_in.model_dump()
        plan_data["user_id"] = user_id
        plan_data["days"] = []
        return await self.repository.create(plan_data)

    async def get_plans(self, user_id: str, is_template: bool = False, difficulty: str = None, days_count: int = None):
        if is_template:
            return await self.repository.get_templates(difficulty, days_count)
        return await self.repository.get_user_plans(user_id, difficulty, days_count)

    async def get_plan(self, plan_id: str, user_id: str):
        plan = await self.repository.get(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        # Allow access if it's the user's plan OR if it's a template
        if plan.get("user_id") != user_id and not plan.get("is_template"):
            raise HTTPException(status_code=403, detail="Not authorized to access this plan")
        plan["id"] = str(plan["_id"])
        return plan

    async def update_plan(self, plan_id: str, plan_in: PlanUpdate, user_id: str):
        # Verify ownership
        await self.get_plan(plan_id, user_id)
        return await self.repository.update(plan_id, plan_in.model_dump(exclude_unset=True))

    async def delete_plan(self, plan_id: str, user_id: str):
        # Verify ownership
        await self.get_plan(plan_id, user_id)
        return await self.repository.delete(plan_id)

    # Day operations
    async def add_day(self, plan_id: str, day_in: DayCreate, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.add_day(plan_id, day_in.model_dump())

    async def update_day(self, plan_id: str, day_id: str, day_in: DayUpdate, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.update_day(plan_id, day_id, day_in.model_dump(exclude_unset=True))

    async def delete_day(self, plan_id: str, day_id: str, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.delete_day(plan_id, day_id)

    # Exercise operations
    async def add_exercise(self, plan_id: str, day_id: str, exercise_in: ExerciseCreate, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.add_exercise(plan_id, day_id, exercise_in.model_dump())

    async def update_exercise(self, plan_id: str, day_id: str, exercise_id: str, exercise_in: ExerciseUpdate, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.update_exercise(plan_id, day_id, exercise_id, exercise_in.model_dump(exclude_unset=True))

    async def delete_exercise(self, plan_id: str, day_id: str, exercise_id: str, user_id: str):
        await self.get_plan(plan_id, user_id)
        return await self.repository.delete_exercise(plan_id, day_id, exercise_id)

    # Template copying
    async def copy_template(self, template_id: str, user_id: str):
        template = await self.repository.get(template_id)
        if not template or not template.get("is_template"):
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Create a new copy for the user
        new_plan = template.copy()
        new_plan.pop("_id")
        new_plan["user_id"] = user_id
        new_plan["is_template"] = False
        return await self.repository.create(new_plan)

    async def search_exercises(self, query: str):
        return await self.repository.search_exercises(query)
