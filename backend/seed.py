import json
import asyncio
from app.db import database as db

async def seed_database():
    with open("seed_data.json", "r") as file:
        data = json.load(file)

    # Clean existing data
    await db.db.assessments.delete_many({})

    # Insert new data
    await db.db.assessments.insert_many(data)
    print("✅ Sample data seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_database())
