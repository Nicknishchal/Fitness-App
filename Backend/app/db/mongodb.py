from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_obj = MongoDB()

async def connect_to_mongo():
    logging.info("Connecting to MongoDB...")
    db_obj.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_obj.db = db_obj.client[settings.MONGODB_DB]
    
    # Create indexes
    await db_obj.db.users.create_index("email", unique=True)
    await db_obj.db.plans.create_index("name")
    await db_obj.db.exercises.create_index("name")
    
    logging.info("Connected to MongoDB!")

async def close_mongo_connection():
    logging.info("Closing MongoDB connection...")
    db_obj.client.close()
    logging.info("MongoDB connection closed.")

def get_database():
    return db_obj.db
