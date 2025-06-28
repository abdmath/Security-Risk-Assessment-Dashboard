from pydantic import BaseModel, EmailStr
from typing import List, Optional

# For controls and threats
class Control(BaseModel):
    name: str
    description: str
    implemented: bool

class Threat(BaseModel):
    category: str
    description: str
    likelihood: int
    impact: int

# For incoming assessment input
class AssessmentInput(BaseModel):
    system_name: str
    criticality: str
    controls: List[Control]
    threats: List[Threat]
    framework: str

# For user registration/login
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# For token response
class Token(BaseModel):
    access_token: str
    token_type: str
