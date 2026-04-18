from typing import Optional
from pydantic import BaseModel

class NotificationSchema(BaseModel):
    user_id: str
    plan_id: Optional[str] = None
    time_of_day: str # e.g., "08:00"
    enabled: bool = True
