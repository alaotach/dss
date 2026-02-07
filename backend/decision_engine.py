"""
Generates response options for a given risk level.
Each option includes trade-off information for human review.
"""

from typing import List, Dict, Any


def generate_options(region: str, risk: str, confidence: float) -> List[Dict[str, Any]]:
    options: List[Dict[str, Any]] = []

    if risk == "HIGH":
        options = [
            {
                "id": "evacuate",
                "title": "Order Evacuation",
                "description": "Initiate full evacuation of the affected zone.",
                "expected_benefit": "Saves lives in high-risk flood area",
                "potential_risk": "Logistic strain, public panic if false alarm",
                "confidence": round(confidence * 0.95, 2),
            },
            {
                "id": "relief_staging",
                "title": "Stage Relief Supplies",
                "description": "Pre-position food, water, and medical supplies near the zone.",
                "expected_benefit": "Faster disaster response by 4–6 hours",
                "potential_risk": "Resource cost if threat doesn't materialize",
                "confidence": round(confidence * 0.90, 2),
            },
            {
                "id": "monitor_enhanced",
                "title": "Enhanced Monitoring",
                "description": "Increase sensor polling and deploy field teams for real-time updates.",
                "expected_benefit": "Better situational awareness before committing resources",
                "potential_risk": "Delayed action if situation escalates quickly",
                "confidence": round(confidence * 0.85, 2),
            },
        ]
    elif risk == "MEDIUM":
        options = [
            {
                "id": "advisory",
                "title": "Issue Public Advisory",
                "description": "Broadcast flood advisory to affected population.",
                "expected_benefit": "Public awareness and self-preparation",
                "potential_risk": "Potential unnecessary alarm",
                "confidence": round(confidence * 0.88, 2),
            },
            {
                "id": "relief_staging",
                "title": "Stage Relief Supplies",
                "description": "Pre-position supplies as a precaution.",
                "expected_benefit": "Preparedness without full evacuation",
                "potential_risk": "Resource allocation may be premature",
                "confidence": round(confidence * 0.82, 2),
            },
            {
                "id": "monitor_enhanced",
                "title": "Enhanced Monitoring",
                "description": "Step up data collection frequency.",
                "expected_benefit": "Earlier detection of escalation",
                "potential_risk": "None significant",
                "confidence": round(confidence * 0.90, 2),
            },
        ]
    else:
        options = [
            {
                "id": "monitor_routine",
                "title": "Routine Monitoring",
                "description": "Continue standard monitoring protocols.",
                "expected_benefit": "Baseline situational awareness",
                "potential_risk": "None",
                "confidence": round(confidence * 0.95, 2),
            },
            {
                "id": "info_update",
                "title": "Update Information Bulletin",
                "description": "Share current conditions with local officials.",
                "expected_benefit": "Transparency and preparedness",
                "potential_risk": "None",
                "confidence": round(confidence * 0.92, 2),
            },
        ]

    return options
