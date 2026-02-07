"""
Governance Gate — Enforces human-in-the-loop decision making
No action executes without explicit human approval
"""
from models.schemas import RiskAssessment, GovernanceResult, DecisionOption
from typing import List


class GovernanceGate:
    """
    Evaluates whether a decision can proceed or requires human review.
    
    Criteria:
    - Risk confidence level
    - Impact severity
    - Action irreversibility
    - Data sufficiency
    
    Returns governance decision: APPROVAL_REQUIRED, ESCALATE, REQUEST_MORE_DATA
    """
    
    def __init__(self):
        self.min_confidence_threshold = 0.65
        self.min_data_completeness = 0.60
        self.auto_escalate_risk_levels = ["CRITICAL", "HIGH"]
    
    def evaluate(self, assessment: RiskAssessment, options: List[DecisionOption],
                 data_completeness: float, uncertainty_flags: List[str]) -> GovernanceResult:
        """
        Evaluate whether human approval is required for this decision context
        
        Args:
            assessment: Risk assessment result
            options: Generated decision options
            data_completeness: Fraction of expected data available
            uncertainty_flags: List of uncertainty warnings
        
        Returns:
            GovernanceResult with status and reasoning
        """
        reasons = []
        requires_approval = False
        status = "PROCEED"
        
        confidence_met = assessment.confidence >= self.min_confidence_threshold
        data_sufficient = data_completeness >= self.min_data_completeness
        
        # ─── Rule 1: High-impact risk levels always require approval ───
        if assessment.risk_level in self.auto_escalate_risk_levels:
            requires_approval = True
            status = "APPROVAL_REQUIRED"
            reasons.append(f"Risk level {assessment.risk_level} requires human approval")
        
        # ─── Rule 2: Low confidence requires escalation ───
        if not confidence_met:
            requires_approval = True
            status = "APPROVAL_REQUIRED"
            reasons.append(f"Confidence ({assessment.confidence:.2f}) below threshold ({self.min_confidence_threshold})")
        
        # ─── Rule 3: Insufficient data → request more data ───
        if not data_sufficient:
            status = "REQUEST_MORE_DATA"
            requires_approval = True
            reasons.append(f"Data completeness ({data_completeness:.0%}) insufficient for autonomous decision")
        
        # ─── Rule 4: High irreversibility actions require approval ───
        high_irreversibility_options = [o for o in options if o.irreversibility == "HIGH"]
        if high_irreversibility_options:
            requires_approval = True
            status = "APPROVAL_REQUIRED"
            reasons.append("High-irreversibility options present (e.g., evacuation)")
        
        # ─── Rule 5: Ethical sensitivity requires oversight ───
        high_ethics_options = [o for o in options if o.ethical_sensitivity == "HIGH"]
        if high_ethics_options:
            requires_approval = True
            status = "APPROVAL_REQUIRED"
            reasons.append("Ethically sensitive actions require human oversight")
        
        # ─── Rule 6: Uncertainty flags trigger review ───
        if len(uncertainty_flags) >= 2:
            requires_approval = True
            status = "ESCALATE"
            reasons.append(f"Multiple uncertainty flags: {', '.join(uncertainty_flags[:2])}")
        
        # ─── Default: All decisions require approval (human-in-the-loop) ───
        if not requires_approval and assessment.risk_level in ["MEDIUM", "LOW"]:
            requires_approval = True
            status = "APPROVAL_REQUIRED"
            reasons.append("Standard governance: All decisions require human confirmation")
        
        # Final status summary
        if not confidence_met and not data_sufficient:
            status = "REQUEST_MORE_DATA"
            reasons.insert(0, "⚠ CRITICAL: Insufficient confidence AND data — human review MANDATORY")
        
        return GovernanceResult(
            status=status,
            requires_human_approval=True,  # Always true — core principle
            reason="; ".join(reasons),
            confidence_threshold_met=confidence_met,
            data_sufficiency=data_sufficient
        )
    
    def can_proceed_without_approval(self) -> bool:
        """
        Hard-coded to return False.
        This system NEVER auto-executes decisions.
        """
        return False
