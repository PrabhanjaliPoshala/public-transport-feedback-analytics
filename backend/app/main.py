from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, routes, trips, feedback, analytics, ai, dataset

# Create Database tables automatically on application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Public Transport Feedback & Service Analytics Platform API",
    description="Backend API powering the Decimal Point Analytics (DPA) Hackathon 2026 Stage 2 Case Study 2 platform.",
    version="2.4.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows localhost:5173, localhost:3000 and external clients
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(routes.router)
app.include_router(trips.router)
app.include_router(feedback.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(dataset.router)

@app.get("/", summary="System Health Check")
def root():
    return {
        "status": "online",
        "system": "Transport Operations Intelligence API",
        "version": "2.4.0",
        "docs": "/docs"
    }
