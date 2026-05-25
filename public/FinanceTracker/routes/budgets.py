"""
routes/budgets.py — Budget CRUD 
"""

from flask import Blueprint, request, jsonify
from data_store import BUDGETS, TRANSACTIONS, current_month_range, next_budget_id

budgets_bp = Blueprint("budgets", __name__)


@budgets_bp.route("/api/budgets", methods=["GET"])
def get_budgets():
    """
    Return all budgets with the current month's spending calculated.
    includes: id, category, monthly_limit, spent, remaining, percentage.
    """
    try:
        first, last = current_month_range()
        result = []

        for b in sorted(BUDGETS, key=lambda x: x["category"]):
            # Sum expenses 
            spent = sum(
                t["amount"] for t in TRANSACTIONS
                if t["type"] == "Expense"
                and t["category"] == b["category"]
                and t["date"] >= first
                and t["date"] < last
            )

            remaining = b["monthly_limit"] - spent
            percentage = (spent / b["monthly_limit"] * 100) if b["monthly_limit"] > 0 else 0

            result.append({
                "id": b["id"],
                "category": b["category"],
                "monthly_limit": b["monthly_limit"],
                "spent": round(spent, 2),
                "remaining": round(remaining, 2),
                "percentage": round(percentage, 1),
            })

        return jsonify({"budgets": result})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@budgets_bp.route("/api/budgets", methods=["POST"])
def add_budget():
    """
    Create or update a budget 
    """
    try:
        data = request.get_json()
        category = data.get("category", "").strip()

        monthly_limit = data.get("monthly_limit") or data.get("amount")

        if not category or monthly_limit is None:
            return jsonify({"success": False, "error": "category and monthly_limit are required"}), 400

        # Check for existing budget for this category
        existing = None
        for b in BUDGETS:
            if b["category"] == category:
                existing = b
                break

        if existing:
            existing["monthly_limit"] = float(monthly_limit)
            budget_id = existing["id"]
        else:
            new_budget = {
                "id": next_budget_id(),
                "category": category,
                "monthly_limit": float(monthly_limit),
            }
            BUDGETS.append(new_budget)
            budget_id = new_budget["id"]

        return jsonify({"success": True, "id": budget_id}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@budgets_bp.route("/api/budgets/<int:budget_id>", methods=["DELETE"])
def delete_budget(budget_id):
    """Delete a budget by ID."""
    try:
        original_len = len(BUDGETS)
        new_list = [b for b in BUDGETS if b["id"] != budget_id]
        if len(new_list) == original_len:
            return jsonify({"success": False, "error": "Budget not found"}), 404
        BUDGETS.clear()
        BUDGETS.extend(new_list)
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
