"""
API Routes — Risk Assessment & Decision Support
"""
from fastapi import APIRouter
from services.disaster_response_service import DisasterResponseService

router = APIRouter(tags=["Risk & Decisions"])
service = DisasterResponseService()


@router.get("/risk/assessment")
def get_risk_assessments():
    """
    Get risk assessments for all regions with explainable reasoning
    """
    return service.get_all_risk_assessments()


@router.get("/decision/packages")
def get_decision_packages():
    """
    Get complete decision packages for all regions:
    - Risk assessment
    - Decision options with trade-offs
    - Governance status
    """
    return service.get_decision_packages()
