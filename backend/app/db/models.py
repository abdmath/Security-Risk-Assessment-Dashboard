from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class Control(BaseModel):
    name: str
    description: str
    implemented: bool

class Threat(BaseModel):
    category: str
    description: str
    likelihood: int
    impact: int

class Assessment(BaseModel):
    user_id: str
    system_name: str
    criticality: str
    controls: List[Control]
    threats: List[Threat]
    framework: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    overall_score: Optional[float] = None
    domain_scores: Optional[dict] = None

class User(BaseModel):
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
