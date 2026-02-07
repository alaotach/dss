"""
Advanced Disaster Response Decision-Support System — FastAPI Backend
Enterprise-grade, explainable, human-in-the-loop disaster response
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from repositories.database import init_db
from api.routes import data_ingestion, decision_routes, governance_routes, audit_routes
from demo import scenarios

# ═══════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

# Parse CORS origins
if CORS_ORIGINS == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in CORS_ORIGINS.split(",")]

# ═══════════════════════════════════════════════════════════════════
# Application Setup
# ═══════════════════════════════════════════════════════════════════

app = FastAPI(
    title="Advanced Disaster Response DSS",
    version="2.0.0",
    description="Human-in-the-loop decision support with explainable AI reasoning",
    docs_url="/docs" if ENVIRONMENT == "development" else "/docs",
    redoc_url="/redoc" if ENVIRONMENT == "development" else "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


# ═══════════════════════════════════════════════════════════════════
# Route Registration
# ═══════════════════════════════════════════════════════════════════

app.include_router(data_ingestion.router)
app.include_router(decision_routes.router)
app.include_router(governance_routes.router)
app.include_router(audit_routes.router)


# ═══════════════════════════════════════════════════════════════════
# Demo Mode Endpoints
# ═══════════════════════════════════════════════════════════════════

@app.post("/demo/load-scenario")
def load_scenario():
    """Load comprehensive flood scenario with 4 regions"""
    return scenarios.load_flood_scenario()


@app.post("/demo/inject-uncertainty")
def inject_uncertainty(region: str):
    """Inject conflicting data to demonstrate uncertainty handling"""
    return scenarios.inject_data_uncertainty(region)


@app.post("/demo/conflicting-reports")
def conflicting_reports():
    """Load scenario with conflicting source reports"""
    return scenarios.load_conflicting_reports_scenario()


# ═══════════════════════════════════════════════════════════════════
# System Health & Info
# ═══════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {
        "system": "Advanced Disaster Response DSS",
        "version": "2.0.0",
        "environment": ENVIRONMENT,
        "architecture": {
            "data_fusion": "Multi-source integration with confidence tracking",
            "risk_assessment": "Explainable hazard-exposure-vulnerability framework",
            "decision_synthesis": "Trade-off analysis with ethics and reversibility",
            "governance": "Human-in-the-loop enforcement - NO autonomous actions",
            "audit": "Immutable traceability for all decisions"
        },
        "human_in_the_loop": True,
        "autonomous_execution": False
    }


@app.get("/health")
def health_check():
    """Health check endpoint for load balancer"""
    return {
        "status": "healthy",
        "environment": ENVIRONMENT,
        "version": "2.0.0"
    }
