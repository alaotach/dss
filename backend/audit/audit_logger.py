"""
Immutable audit trail logger
Every critical system event is recorded with full context
"""
import json
from datetime import datetime
from repositories.database import get_connection


def log_audit_event(event_type: str, region: str = None, payload: dict = None):
    """
    Log an immutable audit event
    
    Args:
        event_type: Type of event (DATA_INGESTION, RISK_ASSESSMENT, etc.)
        region: Associated region (if applicable)
        payload: Full event data as dictionary
    """
    conn = get_connection()
    conn.execute(
        "INSERT INTO audit_trail (event_type, region, payload, timestamp) VALUES (?, ?, ?, ?)",
        (event_type, region, json.dumps(payload or {}), datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()


def log_data_ingestion(region: str, source_type: str, data_type: str, value: any, confidence: float):
    log_audit_event("DATA_INGESTION", region, {
        "source_type": source_type,
        "data_type": data_type,
        "value": value,
        "source_confidence": confidence
    })


def log_risk_assessment(region: str, risk_level: str, risk_score: float, 
                        confidence: float, reasoning: list):
    log_audit_event("RISK_ASSESSMENT", region, {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "confidence": confidence,
        "reasoning": reasoning
    })


def log_governance_decision(region: str, status: str, requires_approval: bool, reason: str):
    log_audit_event("GOVERNANCE_CHECK", region, {
        "status": status,
        "requires_approval": requires_approval,
        "reason": reason
    })


def log_human_approval(region: str, option_id: str, option_title: str):
    log_audit_event("HUMAN_APPROVAL", region, {
        "option_id": option_id,
        "option_title": option_title,
        "approved_by": "system_user"
    })


def log_decision_synthesis(region: str, options_count: int):
    log_audit_event("DECISION_SYNTHESIS", region, {
        "options_generated": options_count
    })
