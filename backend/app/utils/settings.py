"""
Settings storage.

Stores simple user preferences (currently: theme) so they can persist
across devices/browsers, not just in localStorage on one machine.
Persisted to a local JSON file for simplicity — swap for a real DB
table keyed by user_id once you have authentication.
"""
import json
import os
from pathlib import Path
from typing import Dict

SETTINGS_FILE = Path(__file__).parent.parent / "data" / "settings.json"

DEFAULT_SETTINGS = {
    "theme": "light",       # "light" | "dark"
    "default_document_type": "rental",  # "rental" | "nda" | "employment" | "service"
}


def _ensure_file():
    SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not SETTINGS_FILE.exists():
        SETTINGS_FILE.write_text(json.dumps(DEFAULT_SETTINGS, indent=2))


def get_settings() -> Dict:
    _ensure_file()
    try:
        return json.loads(SETTINGS_FILE.read_text())
    except (json.JSONDecodeError, FileNotFoundError):
        return DEFAULT_SETTINGS.copy()


def update_settings(updates: Dict) -> Dict:
    current = get_settings()
    # only accept known keys so the file can't be polluted with garbage
    for key in updates:
        if key in DEFAULT_SETTINGS:
            current[key] = updates[key]
    SETTINGS_FILE.write_text(json.dumps(current, indent=2))
    return current


def reset_settings() -> Dict:
    SETTINGS_FILE.write_text(json.dumps(DEFAULT_SETTINGS, indent=2))
    return DEFAULT_SETTINGS.copy()