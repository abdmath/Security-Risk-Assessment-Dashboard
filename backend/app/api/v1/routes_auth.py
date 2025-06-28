from fastapi import APIRouter, HTTPException, status, Depends, Form
from pydantic import BaseModel, EmailStr
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.db import database as db
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

# --- Models ---

class RegisterInput(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Register Endpoint ---

@router.post("/register")
async def register(data: RegisterInput):
    existing = await db.db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = pwd_context.hash(data.password)
    await db.db.users.insert_one({
        "email": data.email,
        "hashed_password": hashed_pw
    })
    return {"msg": "User registered successfully"}

# --- Login Endpoint ---

@router.post("/login", response_model=Token)
async def login(user: UserLogin):  # ✅ Accepts JSON body
    user_in_db = await db.db.users.find_one({"email": user.email})
    if not user_in_db or not verify_password(user.password, user_in_db['hashed_password']):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


