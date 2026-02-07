from pydantic import BaseModel
from typing import List, Optional


class IngestPayload(BaseModel):
    region: str
    value: float
    type: str


class RiskResult(BaseModel):
    region: str
    risk: str
    confidence: float
    reasons: List[str]


class DecisionOption(BaseModel):
    id: str
    title: str
    description: str
    expected_benefit: str
    potential_risk: str
    confidence: float


class RegionDecisions(BaseModel):
    region: str
    risk: str
    options: List[DecisionOption]


class ApprovePayload(BaseModel):
    region: str
    option_id: str


class LogEntry(BaseModel):
    id: int
    timestamp: str
    category: str
    region: Optional[str]
    message: str
