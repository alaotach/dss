"""
Service Layer — Orchestrates engines and manages business logic
"""
from typing import List
from models.schemas import (
    FusedRegionState, RiskAssessment, DecisionOption, 
    GovernanceResult, DecisionPackage, RiskAssessmentResponse
)
from engines.data_fusion_engine import DataFusionEngine
from engines.risk_assessment_engine import RiskAssessmentEngine
from engines.decision_option_engine import DecisionOptionEngine
from governance.governance_gate import GovernanceGate
from repositories.database import (
    get_all_regions, store_risk_assessment, store_governance_check
)
from audit.audit_logger import (
    log_risk_assessment, log_decision_synthesis, log_governance_decision
)


class DisasterResponseService:
    """
    Coordinates the full decision support pipeline:
    1. Data fusion
    2. Risk assessment
    3. Decision option synthesis
    4. Governance check
    5. Audit logging
    """
    
    def __init__(self):
        self.fusion_engine = DataFusionEngine()
        self.risk_engine = RiskAssessmentEngine()
        self.decision_engine = DecisionOptionEngine()
        self.governance_gate = GovernanceGate()
    
    def get_all_risk_assessments(self) -> List[RiskAssessmentResponse]:
        """
        Generate risk assessments for all regions with data
        """
        regions = get_all_regions()
        assessments = []
        
        for region in regions:
            # Step 1: Fuse data
            fused_state = self.fusion_engine.fuse_region_data(region)
            
            # Step 2: Assess risk
            risk_assessment = self.risk_engine.assess_risk(fused_state)
            
            # Store in database
            store_risk_assessment(
                region=region,
                risk_level=risk_assessment.risk_level,
                risk_score=risk_assessment.risk_score,
                confidence=risk_assessment.confidence,
                reasoning=str(risk_assessment.reasoning_graph)
            )
            
            # Log to audit trail
            log_risk_assessment(
                region=region,
                risk_level=risk_assessment.risk_level,
                risk_score=risk_assessment.risk_score,
                confidence=risk_assessment.confidence,
                reasoning=risk_assessment.reasoning_graph
            )
            
            assessments.append(RiskAssessmentResponse(
                region=region,
                risk_level=risk_assessment.risk_level,
                risk_score=risk_assessment.risk_score,
                confidence=risk_assessment.confidence,
                reasoning_graph=risk_assessment.reasoning_graph,
                components={
                    "hazard": risk_assessment.hazard_severity,
                    "exposure": risk_assessment.exposure,
                    "vulnerability": risk_assessment.vulnerability
                },
                uncertainty_warnings=fused_state.uncertainty_flags
            ))
        
        return assessments
    
    def get_decision_packages(self) -> List[DecisionPackage]:
        """
        Generate complete decision packages for all regions:
        - Risk assessment
        - Decision options
        - Governance result
        """
        regions = get_all_regions()
        packages = []
        
        for region in regions:
            # Step 1: Fuse data
            fused_state = self.fusion_engine.fuse_region_data(region)
            
            # Step 2: Assess risk
            risk_assessment = self.risk_engine.assess_risk(fused_state)
            
            # Step 3: Synthesize decision options
            options = self.decision_engine.synthesize_options(risk_assessment)
            
            # Log decision synthesis
            log_decision_synthesis(region, len(options))
            
            # Step 4: Governance check
            governance = self.governance_gate.evaluate(
                assessment=risk_assessment,
                options=options,
                data_completeness=fused_state.data_completeness,
                uncertainty_flags=fused_state.uncertainty_flags
            )
            
            # Store governance check
            store_governance_check(
                region=region,
                status=governance.status,
                reason=governance.reason,
                requires_approval=governance.requires_human_approval
            )
            
            # Log governance decision
            log_governance_decision(
                region=region,
                status=governance.status,
                requires_approval=governance.requires_human_approval,
                reason=governance.reason
            )
            
            packages.append(DecisionPackage(
                region=region,
                risk_assessment=RiskAssessmentResponse(
                    region=region,
                    risk_level=risk_assessment.risk_level,
                    risk_score=risk_assessment.risk_score,
                    confidence=risk_assessment.confidence,
                    reasoning_graph=risk_assessment.reasoning_graph,
                    components={
                        "hazard": risk_assessment.hazard_severity,
                        "exposure": risk_assessment.exposure,
                        "vulnerability": risk_assessment.vulnerability
                    },
                    uncertainty_warnings=fused_state.uncertainty_flags
                ),
                options=options,
                governance=governance
            ))
        
        return packages
