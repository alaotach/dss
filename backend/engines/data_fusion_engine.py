"""
Data Fusion Engine — Multi-source data integration with confidence tracking
"""
from typing import Dict, List, Any
from models.schemas import FusedRegionState
from repositories.database import get_region_data


class DataFusionEngine:
    """
    Fuses heterogeneous data sources into a unified region state.
    Tracks source confidence and identifies data gaps.
    """
    
    def __init__(self):
        self.confidence_weights = {
            "weather": 0.9,
            "satellite": 0.7,
            "population": 0.95,
            "field_report": 0.6
        }
    
    def fuse_region_data(self, region: str) -> FusedRegionState:
        """
        Fuse all available data for a region into a unified state
        
        Returns:
            FusedRegionState with signals, confidence scores, and uncertainty flags
        """
        raw_data = get_region_data(region)
        
        signals = {}
        source_confidences = {}
        source_counts = {}
        uncertainty_flags = []
        
        # Group by data type and aggregate
        for record in raw_data:
            dtype = record["data_type"]
            source = record["source_type"]
            
            # Track value (latest or most confident)
            if record["value"] is not None:
                if dtype not in signals or source_confidences.get(dtype, 0) < record["source_confidence"]:
                    signals[dtype] = record["value"]
                    source_confidences[dtype] = record["source_confidence"]
            elif record["text_value"]:
                signals[dtype] = record["text_value"]
                source_confidences[dtype] = record["source_confidence"]
            
            # Track source counts
            source_counts[source] = source_counts.get(source, 0) + 1
        
        # Calculate data completeness
        expected_signals = ["rainfall", "flood_extent", "population_density"]
        available = sum(1 for s in expected_signals if s in signals)
        data_completeness = available / len(expected_signals)
        
        # Generate uncertainty flags
        if data_completeness < 0.7:
            uncertainty_flags.append("Insufficient data coverage")
        
        if "satellite" not in source_counts:
            uncertainty_flags.append("No satellite imagery available")
        
        if "field_report" not in source_counts:
            uncertainty_flags.append("No ground-truth validation")
        
        # Calculate weighted confidence per source type
        avg_source_confidence = {}
        for source in source_counts:
            source_records = [r for r in raw_data if r["source_type"] == source]
            avg_conf = sum(r["source_confidence"] for r in source_records) / len(source_records)
            avg_source_confidence[source] = round(avg_conf * self.confidence_weights.get(source, 0.5), 2)
        
        return FusedRegionState(
            region=region,
            signals=signals,
            source_confidence=avg_source_confidence,
            data_completeness=round(data_completeness, 2),
            uncertainty_flags=uncertainty_flags
        )
    
    def inject_uncertainty(self, region: str, uncertainty_type: str):
        """
        Demo mode: artificially inject conflicting or missing data
        """
        # This is for demo purposes to show how the system handles uncertainty
        pass
