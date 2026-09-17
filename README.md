# CityTransit — Public Transport Feedback & Service Analytics Platform

> **Decimal Point Analytics (DPA) Hackathon 2026 — Vivechana**  
> **Stage 2 — Case Study 2**

**Team:** Veritas AI  
**Institution:** Institute of Aeronautical Engineering, Dundigal

---

## 📌 Project Overview

**CityTransit** is a full-stack public transport feedback and service analytics platform that transforms passenger feedback into structured operational intelligence.

The platform connects the complete feedback-intelligence pipeline:

```text
Passenger Feedback
        ↓
AI Classification
        ↓
Data Validation
        ↓
Persistence
        ↓
Analytics
        ↓
Route Ranking
        ↓
Deterioration Detection
        ↓
Operational Insights
````

Instead of treating passenger complaints as isolated records, CityTransit analyzes feedback across routes, categories, severity levels, ratings and time periods to identify recurring service problems.

The objective is to provide transport operations teams with a unified, evidence-based view of passenger experience and route performance.

---

## 🎯 Problem Statement

Public transport feedback contains multiple dimensions of passenger experience:

* Route and trip information
* Journey date and time
* Punctuality and delays
* Vehicle cleanliness
* Passenger crowding
* Driver behaviour
* Overall journey experience
* Free-text comments

Individual feedback records are easy to collect but difficult to interpret operationally.

### Key Challenges

#### 1. Raw Records

Feedback arrives as individual passenger observations.

#### 2. Hidden Patterns

Relationships between routes, categories, severity and time periods can be difficult to identify manually.

#### 3. Late Detection

Route deterioration may only become visible after complaints accumulate.

#### 4. Operational Decision Support

Operations teams need a unified view of service quality, recurring complaints and emerging deterioration.

---

## 💡 Solution

CityTransit provides a unified feedback-intelligence pipeline.

### Core Workflow

1. Passenger submits feedback
2. Feedback comment is classified
3. FastAPI validates the request
4. SQLAlchemy persists the record
5. Pandas and NumPy aggregate the data
6. Route performance is calculated
7. Deterioration is detected
8. Operational insights are surfaced to administrators

### Key Principle

> **Dashboard values are computed from underlying feedback records rather than hard-coded UI content.**

---

## 🚀 Key Features

### 👤 Passenger Feedback Portal

Passengers can submit:

* Bus route
* Journey date
* Time period
* Punctuality rating
* Cleanliness rating
* Crowding rating
* Driver behaviour rating
* Overall journey rating
* Free-text comment

---

### 🔎 Feedback Tracking

Passengers can track submitted feedback using a Feedback ID.

Supported statuses include:

* `New`
* `Under Review`
* `Resolved`

---

### 🤖 AI Feedback Classification

The platform contains a modular local NLP classifier.

#### Supported Categories

* Crowding
* Punctuality / Delay
* Cleanliness
* Driver Behaviour
* Service / Route
* Safety
* Other

#### Classification Output

The classifier determines:

* Category
* Severity
* Confidence

#### Current Implementation

The current implementation uses a local rule-based NLP classifier.

The classifier is modular and provides an integration path for a local LLM in the future.

---

### 📊 Operations Intelligence Dashboard

The administrator dashboard provides:

* Total feedback
* Average overall rating
* Total complaints
* High/Critical complaints
* Worst-performing route
* Most-reported issue
* Route performance
* Deterioration analysis
* Category analysis
* Time-period analysis
* Trend information

---

### 🚌 Route Performance Analysis

Routes can be evaluated using:

* Overall rating
* Punctuality
* Cleanliness
* Crowding
* Driver behaviour
* Complaint volume
* Complaint severity

The system identifies routes requiring operational attention based on computed analytics.

---

### 📉 Deterioration Detection

Deterioration is evaluated by comparing current and previous periods.

The engine considers:

* Rating decrease
* Complaint increase
* High/Critical complaint increase

When the combination indicates deterioration, the route is surfaced in the operational intelligence view.

---

### ⏰ Time Analysis

Passenger feedback is analyzed using six time buckets:

| Time Period  | Time Range   |
| ------------ | ------------ |
| Morning Peak | 6 AM – 9 AM  |
| Morning      | 9 AM – 12 PM |
| Afternoon    | 12 PM – 3 PM |
| Evening      | 3 PM – 5 PM  |
| Evening Peak | 5 PM – 7 PM  |
| Night        | 7 PM – 10 PM |

This helps identify periods associated with specific service issues.

---

### 📁 CSV Dataset Import

The platform supports importing:

* New York MTA 311 datasets
* Custom customer feedback datasets

Imported datasets can enter the analytics workflow alongside passenger-submitted feedback.

---

## 🧪 Demonstration Dataset

The demonstration dataset contains:

* **10 routes**
* **50+ trips**
* **200+ feedback records**
* **Approximately 60 days of data**

The seed data includes a deliberately stressed Route 42 to demonstrate deterioration detection.

### Route 42 Case Study

The intended Route 42 pattern includes:

* Approximately **2.7 / 5** overall rating
* High complaint volume
* **Crowding** as the primary issue
* **Punctuality / Delays** as the secondary issue
* **5 PM – 7 PM** as the worst period
* Increasing recent complaints
* Deteriorating status

> Displayed dashboard values may change depending on the active dataset and selected filters.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │   Passenger / Admin     │
                    │         Users           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ React + TypeScript      │
                    │ Vite + Tailwind CSS    │
                    │ React Router + Recharts │
                    │ Lucide React             │
                    └────────────┬────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ FastAPI + Uvicorn       │
                    │ Pydantic Validation     │
                    │ JWT Authentication      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ SQLAlchemy ORM          │
                    │ SQLite / PostgreSQL     │
                    └────────────┬────────────┘
                                 │
                                 ▼
              ┌──────────────────────────────────────┐
              │          Intelligence Layer          │
              │                                      │
              │ Pandas + NumPy                       │
              │ Route Analytics                      │
              │ Time Analysis                        │
              │ Route Ranking                        │
              │ Trend Analysis                       │
              │ Deterioration Detection              │
              │ Modular NLP Classifier               │
              └──────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Recharts
* Lucide React
* Axios / Fetch-based API communication

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy
* JWT Authentication

## Database

* SQLite for local development
* PostgreSQL-compatible deployment architecture

## Analytics

* Pandas
* NumPy

## AI / NLP

* Modular rule-based NLP classifier
* Local LLM integration path
---

# 💻 Local Development

## Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Seed the Database

```bash
python seed_data.py
```

The seed process creates the demonstration routes, trips and feedback records.

---

## Start the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

Swagger/OpenAPI documentation:

```text
http://localhost:8000/docs
```

---

# 🌐 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# ⚙️ Environment Configuration

The frontend uses the following environment variable:

```text
VITE_API_URL
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

For deployment, configure the variable with the deployed backend API URL.

---

# 🔄 End-to-End Demo Flow

## Step 1 — Passenger Portal

Open the passenger feedback portal.

## Step 2 — Submit Route 42 Feedback

Example ratings:

```text
Punctuality:        2
Cleanliness:        3
Crowding:           1
Driver Behaviour:   3
Overall:            2
```

Example comment:

```text
The bus is always packed after 6 PM and often arrives late.
```

## Step 3 — Generate Feedback ID

The system creates a feedback identifier after submission.

## Step 4 — AI Classification

The feedback comment is classified into:

```text
Crowding
Punctuality / Delay
High Severity
Confidence
```

## Step 5 — Admin Login

Open the operations administrator interface.

## Step 6 — Operations Dashboard

Demonstrate:

* KPI updates
* Complaint counts
* Route performance
* Category distribution
* Severity
* Time analysis

## Step 7 — Route Analysis

Open the Route 42 analysis and demonstrate:

* Overall rating
* Top issue
* Worst period
* Complaint trend
* Deterioration

## Step 8 — Feedback Manager

Locate the newly submitted passenger feedback.

Update its status:

```text
New → Under Review
```

## Step 9 — CSV Import

Demonstrate importing a supported feedback dataset.

## Step 10 — API Documentation

Open:

```text
http://localhost:8000/docs
```

to demonstrate the available REST API endpoints.

---

# 🔁 Data Flow

```text
Passenger
    │
    ▼
Feedback Form
    │
    ▼
FastAPI API
    │
    ├── Pydantic Validation
    │
    ├── AI Classification
    │
    ▼
SQLAlchemy
    │
    ▼
Database
    │
    ▼
Pandas + NumPy
    │
    ├── KPI Aggregation
    ├── Category Analysis
    ├── Time Analysis
    ├── Route Ranking
    ├── Trend Analysis
    └── Deterioration Detection
    │
    ▼
Operations Intelligence Dashboard
    │
    ▼
Operational Decision Support
```
---

# 🚀 Deployment

The application is designed for deployment using:

```text
Frontend
React + Vite

Backend
FastAPI + Uvicorn

Database
PostgreSQL-compatible deployment architecture
```

Deployment configuration should use environment variables for application settings and secrets.

---

# 🔮 Future Scope

1. Integrate a local LLM behind the classifier interface
2. Move production persistence to PostgreSQL
3. Expand longitudinal trend analysis
4. Extend operational workflows around detected issues
5. Support additional transit feedback sources
6. Add richer route-level historical comparisons
7. Introduce advanced anomaly detection
8. Expand automated operational recommendations

---

# 📊 Expected Impact

CityTransit converts:

```text
Passenger Voice
      ↓
Structured Signal
      ↓
Operational Decision Support
```

The platform demonstrates how passenger feedback can be transformed from isolated observations into route-level operational intelligence.

---

## ⭐ Key Takeaway

> **Passenger feedback → Structured signals → Data-driven operational intelligence**

```
```
