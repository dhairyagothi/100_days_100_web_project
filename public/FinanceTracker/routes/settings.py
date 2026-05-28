"""
routes/settings.py — Settings and data management routes
"""

from flask import Blueprint, request, jsonify
from data_store import SETTINGS

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/api/settings", methods=["GET"])
def get_settings():
    """Return all settings as a flat key-value object."""
    try:
        return jsonify(SETTINGS)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@settings_bp.route("/api/settings", methods=["POST"])
def update_setting():
    """Update a single setting by key."""
    try:
        data = request.get_json()
        key = data.get("key", "").strip()
        value = data.get("value", "")

        if not key:
            return jsonify({"success": False, "error": "Key is required"}), 400

        SETTINGS[key] = value

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@settings_bp.route("/api/settings/reset", methods=["POST"])
def reset_data():
    """
    Reset all financial data: clear transactions and budgets.
    Categories and settings are preserved.
    """
    try:
        import data_store
        data_store.TRANSACTIONS = []
        data_store.BUDGETS = []
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
