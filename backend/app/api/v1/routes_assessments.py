from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.encoders import jsonable_encoder
from jose import jwt, JWTError
from datetime import datetime
from app.core.config import settings
from app.db import database as db
from app.db.schemas import AssessmentInput
from app.services import risk_model

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = await db.db.users.find_one({"email": email})
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception


@router.post("/assess")
async def create_assessment(data: AssessmentInput, user: dict = Depends(get_current_user)):
    threats = [t.dict() for t in data.threats]
    controls = [c.dict() for c in data.controls]
    risk_score = risk_model.calculate_risk_score(threats)
    domain_scores = risk_model.classify_domains(controls, data.framework)

    assessment = {
        "user_id": str(user['_id']),
        "system_name": data.system_name,
        "criticality": data.criticality,
        "controls": controls,
        "threats": threats,
        "framework": data.framework,
        "created_at": datetime.utcnow(),
        "overall_score": risk_score,
        "domain_scores": domain_scores
    }

    result = await db.db.assessments.insert_one(assessment)

    return {
        "id": str(result.inserted_id),
        "score": risk_score,
        "domains": domain_scores
    }

@router.get("/assessments")
async def get_assessments(user: dict = Depends(get_current_user)):
    results = []
    cursor = db.db.assessments.find({"user_id": str(user["_id"])})
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        results.append(doc)
    return results
