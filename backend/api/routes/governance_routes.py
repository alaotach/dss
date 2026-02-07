"""
API Routes — Human Approval & Governance
"""
from fastapi import APIRouter, HTTPException
from models.schemas import ApprovalRequest, ApprovalResponse
from repositories.database import get_all_regions, store_human_approval
from engines.data_fusion_engine import DataFusionEngine
from engines.risk_assessment_engine import RiskAssessmentEngine
from engines.decision_option_engine import DecisionOptionEngine
from audit.audit_logger import log_human_approval
from datetime import datetime

router = APIRouter(prefix="/governance", tags=["Governance & Approval"])

fusion_engine = DataFusionEngine()
risk_engine = RiskAssessmentEngine()
decision_engine = DecisionOptionEngine()


@router.post("/approve")
def approve_decision(payload: ApprovalRequest) -> ApprovalResponse:
    """
    Human approval endpoint — THE ONLY WAY TO FINALIZE A DECISION
    
    This is the enforcement point for human-in-the-loop governance.
    No action can occur without this explicit approval.
    """
    # Validate region exists
    regions = get_all_regions()
    if payload.region not in regions:
        raise HTTPException(
            status_code=404,
            detail=f"Region '{payload.region}' not found"
        )
    
    # Validate option exists for this region
    fused_state = fusion_engine.fuse_region_data(payload.region)
    risk_assessment = risk_engine.assess_risk(fused_state)
    options = decision_engine.synthesize_options(risk_assessment)
    
    selected_option = next((o for o in options if o.id == payload.option_id), None)
    if not selected_option:
        raise HTTPException(
            status_code=400,
            detail=f"Option '{payload.option_id}' not valid for region '{payload.region}'"
        )
    
    # Store approval
    store_human_approval(
        region=payload.region,
        option_id=selected_option.id,
        option_title=selected_option.title
    )
    
    # Log to audit trail
    log_human_approval(
        region=payload.region,
        option_id=selected_option.id,
        option_title=selected_option.title
    )
    
    timestamp = datetime.utcnow().isoformat()
    
    return ApprovalResponse(
        status="approved",
        region=payload.region,
        option=selected_option.title,
        approved_at=timestamp,
        audit_id=0  # Would be actual audit trail ID in production
    )


@router.get("/status")
def get_governance_status():
    """
    Get current governance gate status for all regions
    """
    from services.disaster_response_service import DisasterResponseService
    service = DisasterResponseService()
    packages = service.get_decision_packages()
    
    return [
        {
            "region": pkg.region,
            "governance_status": pkg.governance.status,
            "requires_approval": pkg.governance.requires_human_approval,
            "reason": pkg.governance.reason,
            "risk_level": pkg.risk_assessment.risk_level,
            "confidence": pkg.risk_assessment.confidence
        }
        for pkg in packages
    ]
