# Transport Operations Intelligence Platform - FastAPI Backend

FastAPI REST API powering the **Public Transport Feedback & Service Analytics Platform** for Decimal Point Analytics (DPA) Hackathon 2026 Stage 2 Case Study 2.

## Quick Start

### 1. Set Up Virtual Environment & Dependencies

```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt
```

### 2. Seed Database

```bash
python seed_data.py
```

### 3. Run FastAPI Server

```bash
uvicorn app.main:app --reload --port 8000
```

Swagger API Documentation is available at:
`http://localhost:8000/docs`
