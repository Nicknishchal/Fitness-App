from typing import Any, List
from fastapi import APIRouter, Depends, Query
from app.schemas.progress import Progress, ProgressCreate, ProgressUpdate
from app.routers.deps import get_current_active_user
from app.services.progress import ProgressService

router = APIRouter()

@router.post("/", response_model=str)
async def track_exercise(
    progress_in: ProgressCreate,
    current_user = Depends(get_current_active_user)
) -> Any:
    progress_service = ProgressService()
    return await progress_service.track_exercise(progress_in, str(current_user["_id"]))

@router.get("/history", response_model=List[Progress])
async def get_history(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_active_user)
) -> Any:
    progress_service = ProgressService()
    history = await progress_service.get_user_history(str(current_user["_id"]), skip, limit)
    for h in history: h["id"] = str(h["_id"])
    return history

@router.get("/day", response_model=List[Progress])
async def get_day_progress(
    plan_id: str,
    day_id: str,
    current_user = Depends(get_current_active_user)
) -> Any:
    progress_service = ProgressService()
    progress = await progress_service.get_day_progress(str(current_user["_id"]), plan_id, day_id)
    for p in progress: p["id"] = str(p["_id"])
    return progress

@router.put("/{progress_id}", response_model=bool)
async def update_track(
    progress_id: str,
    progress_in: ProgressUpdate,
    current_user = Depends(get_current_active_user)
) -> Any:
    progress_service = ProgressService()
    return await progress_service.update_track(progress_id, progress_in)

@router.get("/streak", response_model=int)
async def get_workout_streak(
    current_user = Depends(get_current_active_user)
) -> Any:
    progress_service = ProgressService()
    return await progress_service.get_streak(str(current_user["_id"]))
