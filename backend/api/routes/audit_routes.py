"""
API Routes — Audit Trail & Traceability
"""
from fastapi import APIRouter
from repositories.database import get_audit_trail
import json

router = APIRouter(prefix="/audit", tags=["Audit & Traceability"])


@router.get("/trail")
def get_trail(limit: int = 100):
    """
    Get immutable audit trail showing complete decision history
    
    Shows:
    - Data ingestion events
    - Risk assessments
    - Decision synthesis
    - Governance checks
    - Human approvals
    """
    records = get_audit_trail(limit)
    
    # Parse JSON payloads
    for record in records:
        try:
            record["payload"] = json.loads(record["payload"])
        except:
            record["payload"] = {}
    
    return {
        "total_records": len(records),
        "trail": records
    }


@router.get("/summary")
def get_audit_summary():
    """
    Get summary statistics of audit trail
    """
    records = get_audit_trail(1000)
    
    event_counts = {}
    for record in records:
        event_type = record["event_type"]
        event_counts[event_type] = event_counts.get(event_type, 0) + 1
    
    return {
        "total_events": len(records),
        "event_breakdown": event_counts,
        "human_approvals": event_counts.get("HUMAN_APPROVAL", 0),
        "autonomous_actions": 0  # Always 0 — system never auto-executes
    }
