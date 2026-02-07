"""
Risk Assessment Engine — Explainable, uncertainty-aware risk calculation
Uses hazard-exposure-vulnerability framework
"""
import math
from typing import List, Tuple
from models.schemas import FusedRegionState, RiskAssessment


class RiskAssessmentEngine:
    """
    Computes risk using:
    Risk = f(Hazard, Exposure, Vulnerability)
    
    Generates structured, human-readable reasoning.
    Applies confidence penalties for uncertain data.
    """
    
    def __init__(self):
        self.confidence_threshold = 0.6
        self.historical_rainfall_threshold = 180  # mm
    
    def assess_risk(self, fused_state: FusedRegionState) -> RiskAssessment:
        """
        Perform risk assessment with explainable reasoning
        
        Returns:
            RiskAssessment with score, level, confidence, and reasoning graph
        """
        signals = fused_state.signals
        reasoning = []
        
        # ─── 1. Hazard Severity ───────────────────────────────
        hazard_score, hazard_reasons = self._compute_hazard(signals)
        reasoning.extend(hazard_reasons)
        
        # ─── 2. Exposure ──────────────────────────────────────
        exposure_score, exposure_reasons = self._compute_exposure(signals)
        reasoning.extend(exposure_reasons)
        
        # ─── 3. Vulnerability ─────────────────────────────────
        vulnerability_score, vulnerability_reasons = self._compute_vulnerability(signals)
        reasoning.extend(vulnerability_reasons)
        
        # ─── 4. Composite Risk ────────────────────────────────
        # Risk = Hazard × Exposure × Vulnerability
        risk_score = hazard_score * exposure_score * vulnerability_score
        risk_score = min(1.0, risk_score)  # Cap at 1.0
        
        # ─── 5. Confidence Calculation ────────────────────────
        base_confidence = fused_state.data_completeness
        
        # Apply confidence penalty for low source confidence
        avg_source_conf = sum(fused_state.source_confidence.values()) / max(len(fused_state.source_confidence), 1)
        confidence = base_confidence * avg_source_conf
        
        # Further penalty for uncertainty flags
        confidence_penalty = len(fused_state.uncertainty_flags) * 0.05
        confidence = max(0.1, confidence - confidence_penalty)
        
        # Add uncertainty warnings to reasoning
        if fused_state.uncertainty_flags:
            reasoning.append(f"⚠ Confidence reduced: {', '.join(fused_state.uncertainty_flags)}")
        
        # ─── 6. Risk Level Classification ─────────────────────
        if risk_score >= 0.75:
            risk_level = "CRITICAL"
        elif risk_score >= 0.55:
            risk_level = "HIGH"
        elif risk_score >= 0.35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Downgrade if confidence is too low
        if confidence < self.confidence_threshold and risk_level in ["CRITICAL", "HIGH"]:
            reasoning.append(f"⚠ Risk level moderated due to low confidence ({confidence:.2f})")
            risk_level = "MEDIUM" if risk_level == "CRITICAL" else "MEDIUM"
        
        return RiskAssessment(
            region=fused_state.region,
            risk_level=risk_level,
            risk_score=round(risk_score, 3),
            confidence=round(confidence, 2),
            reasoning_graph=reasoning,
            hazard_severity=round(hazard_score, 2),
            exposure=round(exposure_score, 2),
            vulnerability=round(vulnerability_score, 2)
        )
    
    def _compute_hazard(self, signals: dict) -> Tuple[float, List[str]]:
        """Compute hazard severity from weather and satellite data"""
        score = 0.0
        reasons = []
        
        rainfall = signals.get("rainfall", 0)
        if rainfall > self.historical_rainfall_threshold:
            excess = rainfall - self.historical_rainfall_threshold
            score += min(0.6, 0.3 + (excess / 200))
            reasons.append(f"Rainfall ({rainfall} mm) exceeds historical threshold ({self.historical_rainfall_threshold} mm)")
        elif rainfall > 100:
            score += 0.3
            reasons.append(f"Moderate rainfall detected ({rainfall} mm)")
        elif rainfall > 0:
            score += 0.1
            reasons.append(f"Light precipitation ({rainfall} mm)")
        
        flood_extent = signals.get("flood_extent", 0)
        if flood_extent > 60:
            score += 0.4
            reasons.append(f"Severe flood extent: {flood_extent}% of region submerged")
        elif flood_extent > 30:
            score += 0.25
            reasons.append(f"Moderate flooding: {flood_extent}% area affected")
        elif flood_extent > 0:
            score += 0.1
        
        water_level = signals.get("water_level", 0)
        if water_level > 8:
            score += 0.3
            reasons.append(f"Critical water level: {water_level}m (danger threshold exceeded)")
        elif water_level > 5:
            score += 0.15
            reasons.append(f"Elevated water level: {water_level}m")
        
        return min(1.0, score), reasons
    
    def _compute_exposure(self, signals: dict) -> Tuple[float, List[str]]:
        """Compute population exposure"""
        score = 0.0
        reasons = []
        
        pop_density = signals.get("population_density", 0)
        if pop_density > 5000:
            score = 0.9
            reasons.append(f"High population density: {int(pop_density)}/km² in hazard zone")
        elif pop_density > 2000:
            score = 0.6
            reasons.append(f"Moderate population exposure: {int(pop_density)}/km²")
        elif pop_density > 500:
            score = 0.3
            reasons.append(f"Low-density settlement: {int(pop_density)}/km²")
        else:
            score = 0.1
        
        infrastructure = signals.get("infrastructure_count", 0)
        if infrastructure > 0:
            score += 0.1
            reasons.append(f"Critical infrastructure present ({int(infrastructure)} facilities)")
        
        return min(1.0, score), reasons
    
    def _compute_vulnerability(self, signals: dict) -> Tuple[float, List[str]]:
        """Compute vulnerability factors"""
        score = 0.5  # baseline vulnerability
        reasons = []
        
        # Check for vulnerable populations
        elderly_pct = signals.get("elderly_percentage", 0)
        if elderly_pct > 15:
            score += 0.3
            reasons.append(f"Vulnerable demographics: {elderly_pct}% elderly population")
        
        # Infrastructure resilience
        infrastructure_quality = signals.get("infrastructure_quality", "unknown")
        if infrastructure_quality == "poor":
            score += 0.3
            reasons.append("Infrastructure quality: POOR — limited resilience")
        elif infrastructure_quality == "degraded":
            score += 0.15
        
        # Historical flood frequency
        flood_frequency = signals.get("historical_flood_frequency", 0)
        if flood_frequency > 3:
            score += 0.2
            reasons.append(f"Historically flood-prone: {flood_frequency} events in past 5 years")
        
        return min(1.0, score), reasons
