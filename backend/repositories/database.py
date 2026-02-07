"""
Repository layer — Database access and schema definitions
"""
import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "dss.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS ingested_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            source_type TEXT NOT NULL,
            data_type TEXT NOT NULL,
            value REAL,
            text_value TEXT,
            timestamp TEXT NOT NULL,
            source_confidence REAL DEFAULT 1.0
        );

        CREATE TABLE IF NOT EXISTS fused_states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            fused_data TEXT NOT NULL,
            source_confidences TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS risk_assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            risk_score REAL NOT NULL,
            confidence REAL NOT NULL,
            reasoning TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS decision_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            assessment_id INTEGER,
            options TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS governance_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            status TEXT NOT NULL,
            reason TEXT,
            requires_approval BOOLEAN,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS human_approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            option_id TEXT NOT NULL,
            option_title TEXT NOT NULL,
            approved_by TEXT DEFAULT 'system_user',
            approved_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS audit_trail (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            region TEXT,
            payload TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()


def reset_db():
    conn = get_connection()
    c = conn.cursor()
    c.executescript("""
        DELETE FROM ingested_data;
        DELETE FROM fused_states;
        DELETE FROM risk_assessments;
        DELETE FROM decision_options;
        DELETE FROM governance_checks;
        DELETE FROM human_approvals;
        DELETE FROM audit_trail;
    """)
    conn.commit()
    conn.close()


# ─── Repository Methods ─────────────────────────────────────────

def store_ingested_data(region: str, source_type: str, data_type: str, 
                       value: float = None, text_value: str = None, 
                       source_confidence: float = 1.0):
    conn = get_connection()
    conn.execute(
        """INSERT INTO ingested_data 
           (region, source_type, data_type, value, text_value, timestamp, source_confidence)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (region, source_type, data_type, value, text_value, 
         datetime.utcnow().isoformat(), source_confidence)
    )
    conn.commit()
    conn.close()


def get_all_regions() -> List[str]:
    conn = get_connection()
    rows = conn.execute("SELECT DISTINCT region FROM ingested_data").fetchall()
    conn.close()
    return [r["region"] for r in rows]


def get_region_data(region: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute(
        """SELECT source_type, data_type, value, text_value, source_confidence, timestamp
           FROM ingested_data WHERE region = ? ORDER BY timestamp DESC""",
        (region,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def store_risk_assessment(region: str, risk_level: str, risk_score: float,
                          confidence: float, reasoning: str):
    conn = get_connection()
    cursor = conn.execute(
        """INSERT INTO risk_assessments 
           (region, risk_level, risk_score, confidence, reasoning, created_at)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (region, risk_level, risk_score, confidence, reasoning, datetime.utcnow().isoformat())
    )
    assessment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return assessment_id


def store_governance_check(region: str, status: str, reason: str, requires_approval: bool):
    conn = get_connection()
    conn.execute(
        """INSERT INTO governance_checks 
           (region, status, reason, requires_approval, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (region, status, reason, requires_approval, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()


def store_human_approval(region: str, option_id: str, option_title: str):
    conn = get_connection()
    conn.execute(
        """INSERT INTO human_approvals (region, option_id, option_title, approved_at)
           VALUES (?, ?, ?, ?)""",
        (region, option_id, option_title, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()


def get_audit_trail(limit: int = 100) -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM audit_trail ORDER BY id DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
