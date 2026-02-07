import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "dss.db")


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
            value REAL NOT NULL,
            type TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS decisions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT NOT NULL,
            option_id TEXT NOT NULL,
            option_title TEXT NOT NULL,
            approved_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            category TEXT NOT NULL,
            region TEXT,
            message TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()


def add_log(category: str, message: str, region: str = None):
    conn = get_connection()
    conn.execute(
        "INSERT INTO logs (timestamp, category, region, message) VALUES (?, ?, ?, ?)",
        (datetime.utcnow().isoformat(), category, region, message),
    )
    conn.commit()
    conn.close()


def reset_db():
    conn = get_connection()
    c = conn.cursor()
    c.executescript("""
        DELETE FROM ingested_data;
        DELETE FROM decisions;
        DELETE FROM logs;
    """)
    conn.commit()
    conn.close()
