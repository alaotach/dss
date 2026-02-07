"""
Demo Scenarios — Realistic mock data for demonstrations
"""
from repositories.database import reset_db, store_ingested_data
from audit.audit_logger import log_audit_event
from datetime import datetime


def load_flood_scenario():
    """
    Load comprehensive flood scenario with multi-source data
    Demonstrates:
    - HIGH risk zone (Coastal Zone A)
    - MEDIUM risk zone (Riverside District)
    - LOW risk zone (Hillside Region)
    - Uncertain zone with missing data (Industrial Park)
    """
    reset_db()
    ts = datetime.utcnow().isoformat()
    
    scenarios = [
        # ═══════════════════════════════════════════════════════════
        # COASTAL ZONE A — CRITICAL RISK
        # ═══════════════════════════════════════════════════════════
        {"region": "Coastal Zone A", "source_type": "weather", "data_type": "rainfall", 
         "value": 245, "source_confidence": 0.92},
        {"region": "Coastal Zone A", "source_type": "satellite", "data_type": "flood_extent", 
         "value": 78, "source_confidence": 0.85},
        {"region": "Coastal Zone A", "source_type": "satellite", "data_type": "water_level", 
         "value": 9.8, "source_confidence": 0.88},
        {"region": "Coastal Zone A", "source_type": "population", "data_type": "population_density", 
         "value": 8900, "source_confidence": 0.97},
        {"region": "Coastal Zone A", "source_type": "population", "data_type": "elderly_percentage", 
         "value": 22, "source_confidence": 0.95},
        {"region": "Coastal Zone A", "source_type": "population", "data_type": "infrastructure_count", 
         "value": 12, "source_confidence": 0.90},
        {"region": "Coastal Zone A", "source_type": "field_report", "data_type": "infrastructure_quality", 
         "text_value": "degraded", "source_confidence": 0.70},
        
        # ═══════════════════════════════════════════════════════════
        # RIVERSIDE DISTRICT — MEDIUM RISK
        # ═══════════════════════════════════════════════════════════
        {"region": "Riverside District", "source_type": "weather", "data_type": "rainfall", 
         "value": 165, "source_confidence": 0.90},
        {"region": "Riverside District", "source_type": "satellite", "data_type": "flood_extent", 
         "value": 42, "source_confidence": 0.82},
        {"region": "Riverside District", "source_type": "satellite", "data_type": "water_level", 
         "value": 6.3, "source_confidence": 0.85},
        {"region": "Riverside District", "source_type": "population", "data_type": "population_density", 
         "value": 3400, "source_confidence": 0.96},
        {"region": "Riverside District", "source_type": "population", "data_type": "elderly_percentage", 
         "value": 12, "source_confidence": 0.94},
        {"region": "Riverside District", "source_type": "population", "data_type": "infrastructure_count", 
         "value": 5, "source_confidence": 0.90},
        
        # ═══════════════════════════════════════════════════════════
        # HILLSIDE REGION — LOW RISK
        # ═══════════════════════════════════════════════════════════
        {"region": "Hillside Region", "source_type": "weather", "data_type": "rainfall", 
         "value": 68, "source_confidence": 0.93},
        {"region": "Hillside Region", "source_type": "satellite", "data_type": "flood_extent", 
         "value": 8, "source_confidence": 0.88},
        {"region": "Hillside Region", "source_type": "satellite", "data_type": "water_level", 
         "value": 2.1, "source_confidence": 0.90},
        {"region": "Hillside Region", "source_type": "population", "data_type": "population_density", 
         "value": 1200, "source_confidence": 0.98},
        {"region": "Hillside Region", "source_type": "population", "data_type": "elderly_percentage", 
         "value": 8, "source_confidence": 0.95},
        
        # ═══════════════════════════════════════════════════════════
        # INDUSTRIAL PARK — UNCERTAIN (Missing satellite data)
        # ═══════════════════════════════════════════════════════════
        {"region": "Industrial Park", "source_type": "weather", "data_type": "rainfall", 
         "value": 215, "source_confidence": 0.89},
        # NO satellite data — demonstrates uncertainty handling
        {"region": "Industrial Park", "source_type": "population", "data_type": "population_density", 
         "value": 6400, "source_confidence": 0.96},
        {"region": "Industrial Park", "source_type": "population", "data_type": "infrastructure_quality", 
         "text_value": "poor", "source_confidence": 0.65},
    ]
    
    for item in scenarios:
        store_ingested_data(
            region=item["region"],
            source_type=item["source_type"],
            data_type=item["data_type"],
            value=item.get("value"),
            text_value=item.get("text_value"),
            source_confidence=item["source_confidence"]
        )
    
    log_audit_event("DEMO_SCENARIO", None, {
        "scenario": "Comprehensive Flood Event",
        "regions": 4,
        "data_points": len(scenarios)
    })
    
    return {
        "status": "ok",
        "message": "Comprehensive flood scenario loaded",
        "regions": 4,
        "data_points": len(scenarios)
    }


def inject_data_uncertainty(region: str):
    """
    Demo: Inject conflicting or low-confidence data to show uncertainty handling
    """
    # Add conflicting low-confidence satellite data
    store_ingested_data(
        region=region,
        source_type="satellite",
        data_type="flood_extent",
        value=15,  # Conflicts with existing high value
        source_confidence=0.35  # Low confidence
    )
    
    store_ingested_data(
        region=region,
        source_type="field_report",
        data_type="infrastructure_quality",
        text_value="conflicting_report",
        source_confidence=0.40
    )
    
    log_audit_event("DEMO_UNCERTAINTY_INJECTION", region, {
        "injected": "conflicting low-confidence data"
    })
    
    return {"status": "ok", "message": f"Uncertainty injected for {region}"}


def load_conflicting_reports_scenario():
    """
    Demo: Load scenario where different sources disagree
    """
    region = "Disputed Zone"
    
    # Weather says high rainfall
    store_ingested_data(
        region=region,
        source_type="weather",
        data_type="rainfall",
        value=220,
        source_confidence=0.88
    )
    
    # Satellite shows minimal flooding (conflict!)
    store_ingested_data(
        region=region,
        source_type="satellite",
        data_type="flood_extent",
        value=12,
        source_confidence=0.60
    )
    
    # Field report says severe (another conflict!)
    store_ingested_data(
        region=region,
        source_type="field_report",
        data_type="flood_extent",
        value=75,
        source_confidence=0.55
    )
    
    store_ingested_data(
        region=region,
        source_type="population",
        data_type="population_density",
        value=5500,
        source_confidence=0.95
    )
    
    log_audit_event("DEMO_CONFLICTING_REPORTS", region, {
        "scenario": "Source disagreement demonstration"
    })
    
    return {"status": "ok", "message": "Conflicting reports scenario loaded"}
