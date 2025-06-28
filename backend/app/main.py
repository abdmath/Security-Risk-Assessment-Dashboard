from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import routes_assessments, routes_auth, routes_export  # ✅ include export

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register all routers
app.include_router(routes_auth.router, prefix="/api/v1")
app.include_router(routes_assessments.router, prefix="/api/v1")
app.include_router(routes_export.router, prefix="/api/v1")  # ✅ Add this line
