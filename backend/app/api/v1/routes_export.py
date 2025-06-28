from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from app.db import database as db
from bson import ObjectId
import io
from fpdf import FPDF
from datetime import datetime

router = APIRouter()

def convert_mongo_types(data: dict):
    """Convert ObjectId and datetime to strings recursively."""
    def convert(value):
        if isinstance(value, ObjectId):
            return str(value)
        elif isinstance(value, datetime):
            return value.isoformat()
        elif isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [convert(item) for item in value]
        else:
            return value

    return convert(data)

# ✅ JSON EXPORT
@router.get("/assessment/{id}/json")
async def export_json(id: str):
    assessment = await db.db.assessments.find_one({"_id": ObjectId(id)})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    converted = convert_mongo_types(assessment)
    return JSONResponse(content=converted)

# ✅ PDF EXPORT
@router.get("/assessment/{id}/pdf")
async def export_pdf(id: str):
    assessment = await db.db.assessments.find_one({"_id": ObjectId(id)})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    converted = convert_mongo_types(assessment)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Security Risk Assessment Report", ln=True, align="C")
    pdf.ln(10)

    for key, value in converted.items():
        pdf.multi_cell(0, 10, f"{key}: {value}")
        pdf.ln(1)

    buffer = io.BytesIO()
    pdf_bytes = pdf.output(dest='S').encode('latin1')
    buffer.write(pdf_bytes)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=report.pdf"
    })
