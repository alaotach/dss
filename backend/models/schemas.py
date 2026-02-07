"""
Pydantic schemas for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


# ─── Input Schemas ───────────────────────────────────────────────

class DataIngestionRequest(BaseModel):
    region: str
    source_type: str  # weather, satellite, population, field_report
    data_type: str    # rainfall, flood_extent, population_density, etc.
    value: Optional[float] = None
    text_value: Optional[str] = None
    source_confidence: float = Field(default=1.0, ge=0.0, le=1.0)


class ApprovalRequest(BaseModel):
    region: str
    option_id: str


# ─── Domain Models ───────────────────────────────────────────────

class FusedRegionState(BaseModel):
    region: str
    signals: Dict[str, Any]
    source_confidence: Dict[str, float]
    data_completeness: float
    uncertainty_flags: List[str]


class RiskAssessment(BaseModel):
    region: str
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score: float
    confidence: float
    reasoning_graph: List[str]
    hazard_severity: float
    exposure: float
    vulnerability: float


class DecisionOption(BaseModel):
    id: str
    title: str
    description: str
    benefit: str
    tradeoffs: List[str]
    irreversibility: str  # LOW, MEDIUM, HIGH
    ethical_sensitivity: str  # LOW, MEDIUM, HIGH
    confidence: float


class GovernanceResult(BaseModel):
    status: str  # APPROVAL_REQUIRED, ESCALATE, REQUEST_MORE_DATA
    requires_human_approval: bool
    reason: str
    confidence_threshold_met: bool
    data_sufficiency: bool


class AuditRecord(BaseModel):
    id: int
    event_type: str
    region: Optional[str]
    payload: Dict[str, Any]
    timestamp: str


# ─── Response Schemas ────────────────────────────────────────────

class RiskAssessmentResponse(BaseModel):
    region: str
    risk_level: str
    risk_score: float
    confidence: float
    reasoning_graph: List[str]
    components: Dict[str, float]  # hazard, exposure, vulnerability
    uncertainty_warnings: List[str]


class DecisionPackage(BaseModel):
    region: str
    risk_assessment: RiskAssessmentResponse
    options: List[DecisionOption]
    governance: GovernanceResult


class ApprovalResponse(BaseModel):
    status: str
    region: str
    option: str
    approved_at: str
    audit_id: int
