"""
Decision Option Synthesis Engine
Generates response options with benefit/risk/reversibility analysis
"""
from typing import List
from models.schemas import RiskAssessment, DecisionOption


class DecisionOptionEngine:
    """
    Generates 3-5 response options based on risk assessment.
    Each option includes:
    - Benefit analysis
    - Tradeoffs
    - Irreversibility rating
    - Ethical sensitivity
    - Confidence score
    """
    
    def synthesize_options(self, assessment: RiskAssessment) -> List[DecisionOption]:
        """
        Generate decision options tailored to risk level and confidence
        """
        risk_level = assessment.risk_level
        confidence = assessment.confidence
        
        if risk_level in ["CRITICAL", "HIGH"]:
            return self._generate_high_risk_options(assessment)
        elif risk_level == "MEDIUM":
            return self._generate_medium_risk_options(assessment)
        else:
            return self._generate_low_risk_options(assessment)
    
    def _generate_high_risk_options(self, assessment: RiskAssessment) -> List[DecisionOption]:
        """Options for high/critical risk scenarios"""
        base_conf = assessment.confidence
        
        return [
            DecisionOption(
                id="full_evacuation",
                title="Full Evacuation Order",
                description="Immediately evacuate all residents from high-risk zones to designated shelters.",
                benefit="Maximizes life safety; removes population from immediate danger",
                tradeoffs=[
                    "Major logistical operation — requires transportation, shelters, security",
                    "Economic disruption and potential panic",
                    "False alarm consequences if risk assessment incorrect"
                ],
                irreversibility="HIGH",
                ethical_sensitivity="HIGH",
                confidence=round(base_conf * 0.95, 2)
            ),
            DecisionOption(
                id="targeted_evacuation",
                title="Targeted Evacuation (Vulnerable Zones Only)",
                description="Evacuate high-exposure zones (elderly, low-lying areas, critical facilities).",
                benefit="Protects most vulnerable while reducing logistical burden",
                tradeoffs=[
                    "Partial coverage — some at-risk populations remain",
                    "Potential inequity perceptions"
                ],
                irreversibility="MEDIUM",
                ethical_sensitivity="MEDIUM",
                confidence=round(base_conf * 0.88, 2)
            ),
            DecisionOption(
                id="shelter_in_place",
                title="Shelter-in-Place with Emergency Response Staging",
                description="Instruct residents to shelter on upper floors; deploy rapid response teams.",
                benefit="Avoids mass movement; maintains community cohesion",
                tradeoffs=[
                    "Residents remain in hazard zone",
                    "Requires accessible vertical evacuation structures",
                    "Risk of entrapment if situation worsens"
                ],
                irreversibility="LOW",
                ethical_sensitivity="MEDIUM",
                confidence=round(base_conf * 0.75, 2)
            ),
            DecisionOption(
                id="relief_preposition",
                title="Pre-Position Relief Supplies & Medical Teams",
                description="Stage emergency supplies, medical personnel, and rescue equipment at zone perimeter.",
                benefit="Enables rapid post-impact response; minimizes time-to-aid",
                tradeoffs=[
                    "Does not prevent immediate impact",
                    "Resource allocation without guaranteed need"
                ],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.90, 2)
            ),
            DecisionOption(
                id="enhanced_monitoring_alert",
                title="Enhanced Monitoring + Public Alert",
                description="Increase sensor frequency, deploy field teams, issue urgent public warning.",
                benefit="Maintains situational awareness without committing to large-scale action",
                tradeoffs=[
                    "Delayed protective action if situation escalates rapidly",
                    "Public may not take warnings seriously without official action"
                ],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.82, 2)
            )
        ]
    
    def _generate_medium_risk_options(self, assessment: RiskAssessment) -> List[DecisionOption]:
        """Options for medium risk scenarios"""
        base_conf = assessment.confidence
        
        return [
            DecisionOption(
                id="public_advisory",
                title="Issue Public Flood Advisory",
                description="Broadcast advisory via emergency alert system; recommend self-preparation.",
                benefit="Raises public awareness without triggering panic",
                tradeoffs=[
                    "Relies on individual compliance",
                    "May cause unnecessary alarm if risk downgrades"
                ],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.92, 2)
            ),
            DecisionOption(
                id="voluntary_evacuation",
                title="Voluntary Evacuation (Vulnerable Groups)",
                description="Offer voluntary evacuation for elderly, disabled, and families with young children.",
                benefit="Protects most vulnerable without mandatory orders",
                tradeoffs=[
                    "Incomplete compliance",
                    "Logistical complexity of partial evacuation"
                ],
                irreversibility="LOW",
                ethical_sensitivity="MEDIUM",
                confidence=round(base_conf * 0.85, 2)
            ),
            DecisionOption(
                id="relief_staging",
                title="Stage Relief Supplies (Precautionary)",
                description="Position food, water, medical kits near affected zones.",
                benefit="Preparedness without drastic action",
                tradeoffs=[
                    "Resource cost if threat doesn't materialize"
                ],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.88, 2)
            ),
            DecisionOption(
                id="infrastructure_inspection",
                title="Infrastructure Inspection & Reinforcement",
                description="Deploy engineering teams to inspect levees, drainage, and critical facilities.",
                benefit="Identifies vulnerabilities; enables preventive fixes",
                tradeoffs=[
                    "Time-intensive",
                    "May reveal problems without immediate solutions"
                ],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.90, 2)
            )
        ]
    
    def _generate_low_risk_options(self, assessment: RiskAssessment) -> List[DecisionOption]:
        """Options for low risk scenarios"""
        base_conf = assessment.confidence
        
        return [
            DecisionOption(
                id="routine_monitoring",
                title="Continue Routine Monitoring",
                description="Maintain standard sensor polling and situation assessment protocols.",
                benefit="Business as usual; no resource diversion",
                tradeoffs=["May miss rapid escalation"],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.95, 2)
            ),
            DecisionOption(
                id="information_bulletin",
                title="Issue Information Bulletin",
                description="Share current weather/water conditions with local officials and media.",
                benefit="Transparency; maintains public trust",
                tradeoffs=["None significant"],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.93, 2)
            ),
            DecisionOption(
                id="community_preparedness",
                title="Community Preparedness Outreach",
                description="Conduct educational sessions on flood preparedness and emergency kits.",
                benefit="Long-term resilience building",
                tradeoffs=["No immediate protective effect"],
                irreversibility="LOW",
                ethical_sensitivity="LOW",
                confidence=round(base_conf * 0.88, 2)
            )
        ]
