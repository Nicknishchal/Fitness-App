from typing import Any, List, Optional
from fastapi import APIRouter, Depends, Query, status
from app.schemas.plan import Plan, PlanCreate, PlanUpdate, PlanSummary, Day, DayCreate, DayUpdate, Exercise, ExerciseCreate, ExerciseUpdate
from app.routers.deps import get_current_active_user
from app.services.plan import PlanService

router = APIRouter()

# --- Plans ---
@router.post("/", response_model=Plan)
async def create_plan(
    plan_in: PlanCreate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    plan_id = await plan_service.create_plan(plan_in, str(current_user["_id"]))
    return await plan_service.get_plan(plan_id, str(current_user["_id"]))

@router.get("/", response_model=List[PlanSummary])
async def read_plans(
    is_template: bool = False,
    difficulty: Optional[str] = None,
    days_count: Optional[int] = None,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    plans = await plan_service.get_plans(str(current_user["_id"]), is_template, difficulty, days_count)
    for p in plans: p["id"] = str(p["_id"])
    return plans

@router.get("/templates", response_model=List[PlanSummary])
async def read_plan_templates(
    difficulty: Optional[str] = None,
    days_count: Optional[int] = None,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    plans = await plan_service.get_plans(str(current_user["_id"]), is_template=True, difficulty=difficulty, days_count=days_count)
    for p in plans: p["id"] = str(p["_id"])
    return plans

@router.get("/{plan_id}", response_model=Plan)
async def read_plan(
    plan_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.get_plan(plan_id, str(current_user["_id"]))

@router.put("/{plan_id}", response_model=Plan)
async def update_plan(
    plan_id: str,
    plan_in: PlanUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    await plan_service.update_plan(plan_id, plan_in, str(current_user["_id"]))
    return await plan_service.get_plan(plan_id, str(current_user["_id"]))

@router.delete("/{plan_id}", response_model=bool)
async def delete_plan(
    plan_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.delete_plan(plan_id, str(current_user["_id"]))

@router.post("/{plan_id}/duplicate", response_model=Plan)
async def duplicate_plan(
    plan_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    new_plan_id = await plan_service.copy_template(plan_id, str(current_user["_id"]))
    return await plan_service.get_plan(new_plan_id, str(current_user["_id"]))

# --- Days ---
@router.post("/{plan_id}/days", response_model=bool)
async def add_day(
    plan_id: str,
    day_in: DayCreate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.add_day(plan_id, day_in, str(current_user["_id"]))

@router.put("/{plan_id}/days/{day_id}", response_model=bool)
async def update_day(
    plan_id: str,
    day_id: str,
    day_in: DayUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.update_day(plan_id, day_id, day_in, str(current_user["_id"]))

@router.delete("/{plan_id}/days/{day_id}", response_model=bool)
async def delete_day(
    plan_id: str,
    day_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.delete_day(plan_id, day_id, str(current_user["_id"]))

# --- Exercises ---
@router.post("/{plan_id}/days/{day_id}/exercises", response_model=bool)
async def add_exercise(
    plan_id: str,
    day_id: str,
    exercise_in: ExerciseCreate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.add_exercise(plan_id, day_id, exercise_in, str(current_user["_id"]))

@router.put("/{plan_id}/days/{day_id}/exercises/{exercise_id}", response_model=bool)
async def update_exercise(
    plan_id: str,
    day_id: str,
    exercise_id: str,
    exercise_in: ExerciseUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.update_exercise(plan_id, day_id, exercise_id, exercise_in, str(current_user["_id"]))

@router.delete("/{plan_id}/days/{day_id}/exercises/{exercise_id}", response_model=bool)
async def delete_exercise(
    plan_id: str,
    day_id: str,
    exercise_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.delete_exercise(plan_id, day_id, exercise_id, str(current_user["_id"]))

# --- Search ---
@router.get("/search/exercises")
async def search_exercises(
    query: str = Query(..., min_length=1),
    current_user = Depends(get_current_active_user)
) -> Any:
    plan_service = PlanService()
    return await plan_service.search_exercises(query)
