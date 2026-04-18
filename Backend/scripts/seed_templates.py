import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGODB_DB", "fitness_app")

templates = [
    {
        "title": "Full Body Beginner",
        "description": "A Great starting point for anyone new to the gym.",
        "days_count": 3,
        "difficulty": "beginner",
        "is_template": True,
        "days": [
            {
                "id": "day1",
                "order": 1,
                "name": "Full Body Day A",
                "notes": "Focus on form",
                "exercises": [
                    {
                        "id": "ex1",
                        "name": "Pushups",
                        "description": "Standard pushups",
                        "reps": "10-15",
                        "sets": 3,
                        "rest_time": 60,
                        "youtube_link": "https://www.youtube.com/watch?v=IODxDxX7oi4",
                        "order": 1
                    },
                    {
                        "id": "ex2",
                        "name": "Bodyweight Squats",
                        "description": "Standard squats",
                        "reps": "15-20",
                        "sets": 3,
                        "rest_time": 60,
                        "youtube_link": "https://www.youtube.com/watch?v=UXJrBgI2RxA",
                        "order": 2
                    }
                ]
            }
        ]
    },
    {
        "title": "Advanced Push Pull Legs",
        "description": "High volume for muscle growth.",
        "days_count": 6,
        "difficulty": "advanced",
        "is_template": True,
        "days": [
            {
                "id": "day1",
                "order": 1,
                "name": "Push Day",
                "notes": "Chest, Shoulders, Triceps",
                "exercises": [
                    {
                        "id": "ex3",
                        "name": "Bench Press",
                        "description": "Barbell bench press",
                        "reps": "5",
                        "sets": 5,
                        "rest_time": 180,
                        "youtube_link": "https://www.youtube.com/watch?v=rT7Dg0nEtW8",
                        "order": 1
                    }
                ]
            }
        ]
    }
]

async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Clear existing templates if any
    await db.plans.delete_many({"is_template": True})
    
    # Insert new templates
    if templates:
        await db.plans.insert_many(templates)
        print(f"Successfully seeded {len(templates)} templates.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
