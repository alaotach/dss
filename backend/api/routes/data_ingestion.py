"""
API Routes — Data Ingestion Endpoints
"""
from fastapi import APIRouter, HTTPException
from models.schemas import DataIngestionRequest
from repositories.database import store_ingested_data
from audit.audit_logger import log_data_ingestion

router = APIRouter(prefix="/ingest", tags=["Data Ingestion"])


@router.post("/weather")
def ingest_weather(payload: DataIngestionRequest):
    """
    Ingest weather data (rainfall, temperature, wind, etc.)
    """
    allowed_types = ["rainfall", "temperature", "wind_speed", "humidity"]
    if payload.data_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data_type for weather. Allowed: {allowed_types}"
        )
    
    store_ingested_data(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value,
        text_value=payload.text_value,
        source_confidence=payload.source_confidence
    )
    
    log_data_ingestion(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value or payload.text_value,
        confidence=payload.source_confidence
    )
    
    return {"status": "ok", "region": payload.region, "data_type": payload.data_type}


@router.post("/satellite")
def ingest_satellite(payload: DataIngestionRequest):
    """
    Ingest satellite imagery data (flood extent, land change, etc.)
    """
    allowed_types = ["flood_extent", "land_change", "water_level"]
    if payload.data_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data_type for satellite. Allowed: {allowed_types}"
        )
    
    store_ingested_data(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value,
        text_value=payload.text_value,
        source_confidence=payload.source_confidence
    )
    
    log_data_ingestion(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value or payload.text_value,
        confidence=payload.source_confidence
    )
    
    return {"status": "ok", "region": payload.region, "data_type": payload.data_type}


@router.post("/population")
def ingest_population(payload: DataIngestionRequest):
    """
    Ingest population and demographic data
    """
    allowed_types = [
        "population_density", "elderly_percentage", 
        "infrastructure_count", "infrastructure_quality"
    ]
    if payload.data_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data_type for population. Allowed: {allowed_types}"
        )
    
    store_ingested_data(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value,
        text_value=payload.text_value,
        source_confidence=payload.source_confidence
    )
    
    log_data_ingestion(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value or payload.text_value,
        confidence=payload.source_confidence
    )
    
    return {"status": "ok", "region": payload.region, "data_type": payload.data_type}


@router.post("/field_report")
def ingest_field_report(payload: DataIngestionRequest):
    """
    Ingest field reports from ground teams
    """
    store_ingested_data(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value,
        text_value=payload.text_value,
        source_confidence=payload.source_confidence
    )
    
    log_data_ingestion(
        region=payload.region,
        source_type=payload.source_type,
        data_type=payload.data_type,
        value=payload.value or payload.text_value,
        confidence=payload.source_confidence
    )
    
    return {"status": "ok", "region": payload.region, "data_type": payload.data_type}
