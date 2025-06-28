from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# Create a MongoDB client using the URI from settings
client = AsyncIOMotorClient(settings.MONGO_URL)

# Explicitly connect to the 'security_dashboard' database
db = client["security_dashboard"]
