from typing import List, Optional
from pydantic import BaseModel, HttpUrl, Field
from enum import Enum

class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# Exercise Schemas
class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    reps: Optional[str] = None
    sets: Optional[int] = None
    timer_duration: Optional[int] = None
    rest_time: int = 60
    youtube_link: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    reps: Optional[str] = None
    sets: Optional[int] = None
    timer_duration: Optional[int] = None
    rest_time: Optional[int] = None
    youtube_link: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None

class Exercise(ExerciseBase):
    id: str

# Day Schemas
class DayBase(BaseModel):
    order: int
    name: str
    notes: Optional[str] = None

class DayCreate(DayBase):
    pass

class DayUpdate(BaseModel):
    order: Optional[int] = None
    name: Optional[str] = None
    notes: Optional[str] = None

class Day(DayBase):
    id: str
    exercises: List[Exercise] = []

# Plan Schemas
class PlanBase(BaseModel):
    title: str
    description: Optional[str] = None
    days_count: int
    difficulty: Difficulty
    is_template: bool = False

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    days_count: Optional[int] = None
    difficulty: Optional[Difficulty] = None
    is_template: Optional[bool] = None

class Plan(PlanBase):
    id: str
    user_id: Optional[str] = None
    days: List[Day] = []

class PlanSummary(PlanBase):
    id: str
    user_id: Optional[str] = None
