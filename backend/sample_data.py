"""
Sample scenario loader — populates the database with realistic mock flood data.
"""

from database import get_connection, add_log, reset_db
from datetime import datetime

SAMPLE_DATA = [
    # Zone A — severe flood scenario
    {"region": "Zone A", "value": 245, "type": "rainfall"},
    {"region": "Zone A", "value": 78, "type": "flood_extent"},
    {"region": "Zone A", "value": 8500, "type": "population_density"},
    {"region": "Zone A", "value": 9.2, "type": "water_level"},
    # Zone B — moderate scenario
    {"region": "Zone B", "value": 155, "type": "rainfall"},
    {"region": "Zone B", "value": 42, "type": "flood_extent"},
    {"region": "Zone B", "value": 3200, "type": "population_density"},
    {"region": "Zone B", "value": 5.8, "type": "water_level"},
    # Zone C — low risk
    {"region": "Zone C", "value": 60, "type": "rainfall"},
    {"region": "Zone C", "value": 10, "type": "flood_extent"},
    {"region": "Zone C", "value": 1200, "type": "population_density"},
    {"region": "Zone C", "value": 2.1, "type": "water_level"},
    # Zone D — mixed/missing data
    {"region": "Zone D", "value": 210, "type": "rainfall"},
    {"region": "Zone D", "value": 6100, "type": "population_density"},
    # no satellite or water level data for Zone D
]


def load_sample_scenario():
    reset_db()
    conn = get_connection()
    ts = datetime.utcnow().isoformat()
    for item in SAMPLE_DATA:
        conn.execute(
            "INSERT INTO ingested_data (region, value, type, timestamp) VALUES (?, ?, ?, ?)",
            (item["region"], item["value"], item["type"], ts),
        )
    conn.commit()
    conn.close()
    add_log("SYSTEM", "Sample flood scenario loaded (4 zones)", None)
