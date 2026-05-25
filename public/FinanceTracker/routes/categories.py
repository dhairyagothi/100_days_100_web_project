"""
routes/categories.py — Category CRUD routes
"""

from flask import Blueprint, request, jsonify
from data_store import CATEGORIES, TRANSACTIONS, BUDGETS, next_cat_id

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("/api/categories", methods=["GET"])
def get_categories():
    """Return all categories."""
    try:
        sorted_cats = sorted(CATEGORIES, key=lambda c: (c["type"], c["name"]))
        return jsonify({"categories": sorted_cats})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@categories_bp.route("/api/categories", methods=["POST"])
def add_category():
    """Add a new category. Returns error if duplicate."""
    try:
        data = request.get_json()
        name = data.get("name", "").strip()
        cat_type = data.get("type", "").strip()

        if not name or not cat_type:
            return jsonify({"success": False, "error": "Name and type are required"}), 400

        # Check for duplicates
        existing = any(c["name"] == name and c["type"] == cat_type for c in CATEGORIES)
        if existing:
            return jsonify({"success": False, "error": "Category already exists"}), 409

        new_cat = {"id": next_cat_id(), "name": name, "type": cat_type}
        CATEGORIES.append(new_cat)

        return jsonify({"success": True, "id": new_cat["id"]}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@categories_bp.route("/api/categories/<int:cat_id>", methods=["PUT"])
def update_category(cat_id):
    """
    Update category name/type. Also updates all transactions that
    referenced the old category name so data stays consistent.
    """
    try:
        data = request.get_json()
        new_name = data.get("name", "").strip()
        new_type = data.get("type", "").strip()

        if not new_name or not new_type:
            return jsonify({"success": False, "error": "Name and type are required"}), 400

        # Find the category
        target_cat = None
        for cat in CATEGORIES:
            if cat["id"] == cat_id:
                target_cat = cat
                break

        if not target_cat:
            return jsonify({"success": False, "error": "Category not found"}), 404

        old_name = target_cat["name"]
        old_type = target_cat["type"]

        # Update the category
        target_cat["name"] = new_name
        target_cat["type"] = new_type

        # Cascade the rename to transactions
        for txn in TRANSACTIONS:
            if txn["category"] == old_name and txn["type"] == old_type:
                txn["category"] = new_name
                txn["type"] = new_type

        # Also cascade to budgets if the category name changed
        if old_name != new_name:
            for budget in BUDGETS:
                if budget["category"] == old_name:
                    budget["category"] = new_name

        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@categories_bp.route("/api/categories/<int:cat_id>", methods=["DELETE"])
def delete_category(cat_id):
    """Delete a category by ID."""
    try:
        original_len = len(CATEGORIES)
        new_list = [c for c in CATEGORIES if c["id"] != cat_id]
        if len(new_list) == original_len:
            return jsonify({"success": False, "error": "Category not found"}), 404
        CATEGORIES.clear()
        CATEGORIES.extend(new_list)
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
