from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ProgressBase(BaseModel):
    plan_id: str
    day_id: str
    exercise_id: str
    completed: bool = True
    time_taken: Optional[int] = None
    notes: Optional[str] = None

class ProgressCreate(ProgressBase):
    pass

class ProgressUpdate(BaseModel):
    completed: Optional[bool] = None
    time_taken: Optional[int] = None
    notes: Optional[str] = None

class Progress(ProgressBase):
    id: str
    user_id: str
    completed_at: datetime
