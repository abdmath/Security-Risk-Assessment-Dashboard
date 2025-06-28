# Security Risk Assessment Dashboard (NIST CSF / ISO 27001 Based)

A professional-grade dashboard built for Governance, Risk, and Compliance (GRC) teams to conduct structured cybersecurity risk assessments. This tool helps align organizational risks with control frameworks like **NIST Cybersecurity Framework (CSF)** and **ISO/IEC 27001**, enabling consultants, auditors, and internal security teams to evaluate, quantify, and visualize cyber risks effectively.

---

## 🌐 Project Overview

This application allows users to:

- Enter system details, known threats, and security controls  
- Map entries to NIST CSF or ISO 27001 domains  
- Automatically calculate risk scores using custom logic  
- View risks visually via heatmaps and radar charts  
- Export assessments to JSON or PDF  
- Authenticate securely via JWT-based login  

---

## 🧩 Key Features

- 🔐 Secure Authentication System  
- 📋 Dynamic Risk Assessment Input Form  
- 📊 Risk Scoring with Visual Charts  
- 📂 Assessment Export (JSON / PDF)  
- ♻️ Assessment History and Review  
- 📚 Framework Mapping (NIST & ISO)

---

## ⚙️ Tech Stack

**Frontend:**

- React.js  
- Tailwind CSS  
- Chart.js  
- Axios  
- React Toastify  

**Backend:**

- FastAPI  
- MongoDB (Motor Async)  
- Pydantic  
- JWT Authentication  

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abdmath/Security-Risk-Assessment-Dashboard.git
cd Security-Risk-Assessment-Dashboard
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Activate virtual environment:
# On Windows:
venv\Scripts\activate
# On Unix/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Create a .env file inside the backend/ folder:

```
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the FastAPI server:

```
uvicorn app.main:app --reload
```

Your backend will run at: http://localhost:8000

---
### 3. Frontend Setup (React)

```
cd ../frontend
npm install
```
Create a .env file inside the frontend/ folder:
```
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```
Start the React app:
```
npm start
```
---

## 📁 Project Structure

```
Security-Risk-Assessment-Dashboard/
│
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   ├── core/
│   │   ├── db/
│   │   └── services/
│   ├── requirements.txt
│   ├── start.sh
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   ├── public/
│   ├── .env
│   └── package.json
│
└── README.md
```
---
## 📷 Screenshots

---

## 🔮 Future Enhancements

- Role-Based Access Control (RBAC)
- Compliance Checklist per Framework
- Risk Trends & Timeline Graphs
- XLSX Export & Email Integration
- AI Risk Suggestion Engine

