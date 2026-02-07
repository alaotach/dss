"""
Rule-based risk assessment engine.
No ML — purely deterministic thresholds.
"""

from typing import List, Dict, Any
from database import get_connection


def _get_region_data(region: str) -> Dict[str, List[float]]:
    """Collect all ingested values for a region, grouped by type."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT type, value FROM ingested_data WHERE region = ?", (region,)
    ).fetchall()
    conn.close()

    grouped: Dict[str, List[float]] = {}
    for r in rows:
        grouped.setdefault(r["type"], []).append(r["value"])
    return grouped


def _latest(values: List[float]) -> float:
    return values[-1] if values else 0.0


def assess_region(region: str) -> Dict[str, Any]:
    data = _get_region_data(region)
    reasons: List[str] = []
    risk_score = 0  # 0-100 internal score
    confidence = 1.0

    # --- Rainfall ---
    rainfall = _latest(data.get("rainfall", []))
    if rainfall > 200:
        risk_score += 40
        reasons.append(f"Extreme rainfall ({rainfall} mm)")
    elif rainfall > 100:
        risk_score += 20
        reasons.append(f"Moderate rainfall ({rainfall} mm)")
    elif rainfall > 0:
        risk_score += 5
        reasons.append(f"Light rainfall ({rainfall} mm)")
    else:
        confidence -= 0.15
        reasons.append("No rainfall data — confidence reduced")

    # --- Flood extent (satellite) ---
    flood = _latest(data.get("flood_extent", []))
    if flood > 70:
        risk_score += 30
        reasons.append(f"Satellite shows {flood}% flood extent")
    elif flood > 30:
        risk_score += 15
        reasons.append(f"Satellite shows {flood}% flood extent")
    elif flood > 0:
        risk_score += 5
    else:
        confidence -= 0.10
        reasons.append("No satellite data — confidence reduced")

    # --- Population exposure ---
    population = _latest(data.get("population_density", []))
    if population > 5000:
        risk_score += 25
        reasons.append(f"High population density ({int(population)}/km²)")
    elif population > 2000:
        risk_score += 12
        reasons.append(f"Moderate population density ({int(population)}/km²)")
    elif population > 0:
        risk_score += 5
    else:
        confidence -= 0.03

    # --- Water level ---
    water = _latest(data.get("water_level", []))
    if water > 8:
        risk_score += 20
        reasons.append(f"Critical water level ({water} m)")
    elif water > 5:
        risk_score += 10
        reasons.append(f"Elevated water level ({water} m)")

    # Clamp confidence
    confidence = round(max(0.1, min(1.0, confidence)), 2)

    # Map score → label
    if risk_score >= 60:
        risk = "HIGH"
    elif risk_score >= 30:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "region": region,
        "risk": risk,
        "confidence": confidence,
        "reasons": reasons,
    }


def get_all_regions() -> List[str]:
    conn = get_connection()
    rows = conn.execute("SELECT DISTINCT region FROM ingested_data").fetchall()
    conn.close()
    return [r["region"] for r in rows]
