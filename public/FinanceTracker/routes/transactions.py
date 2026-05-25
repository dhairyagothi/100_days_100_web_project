"""
routes/transactions.py — Transaction CRUD routes
"""

from flask import Blueprint, request, jsonify
from data_store import TRANSACTIONS, next_txn_id

transactions_bp = Blueprint("transactions", __name__)


@transactions_bp.route("/api/transactions", methods=["GET"])
def get_transactions():
    """
    List all transactions with optional filtering, searching, and sorting.

    Query params:
      search   — partial match on description
      category — exact category filter
      type     — 'Income' or 'Expense'
      sort     — column to sort by (date | amount | description), default 'date'
      order    — 'asc' or 'desc', default 'desc'
    """
    try:
        results = list(TRANSACTIONS)

        # --- Filters ---
        search = request.args.get("search")
        if search:
            search_lower = search.lower()
            results = [t for t in results if search_lower in t["description"].lower()]

        category = request.args.get("category")
        if category:
            results = [t for t in results if t["category"] == category]

        txn_type = request.args.get("type")
        if txn_type:
            results = [t for t in results if t["type"] == txn_type]

        # --- Sorting ---
        allowed_sort = {"date", "amount", "description"}
        sort_col = request.args.get("sort", "date")
        if sort_col not in allowed_sort:
            sort_col = "date"

        order = request.args.get("order", "desc").lower()
        if order not in ("asc", "desc"):
            order = "desc"

        reverse = (order == "desc")
        results.sort(key=lambda t: t.get(sort_col, ""), reverse=reverse)

        return jsonify({"transactions": results})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@transactions_bp.route("/api/transactions/<int:txn_id>", methods=["GET"])
def get_transaction(txn_id):
    """Get a single transaction by ID."""
    try:
        for txn in TRANSACTIONS:
            if txn["id"] == txn_id:
                return jsonify({"transaction": txn})
        return jsonify({"success": False, "error": "Transaction not found"}), 404
 
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
 

@transactions_bp.route("/api/transactions", methods=["POST"])
def add_transaction():
    """Add a new transaction."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ["date", "description", "amount", "type", "category"]
        for field in required:
            if field not in data or data[field] is None or str(data[field]).strip() == "":
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400

        txn = {
            "id": next_txn_id(),
            "date": data["date"],
            "description": data["description"],
            "amount": float(data["amount"]),
            "type": data["type"],
            "category": data["category"],
        }
        TRANSACTIONS.append(txn)

        return jsonify({"success": True, "id": txn["id"]}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@transactions_bp.route("/api/transactions/<int:txn_id>", methods=["PUT"])
def update_transaction(txn_id):
    """Update an existing transaction by ID."""
    try:
        data = request.get_json()

        required = ["date", "description", "amount", "type", "category"]
        for field in required:
            if field not in data or data[field] is None or str(data[field]).strip() == "":
                return jsonify({"success": False, "error": f"Missing required field: {field}"}), 400

        for txn in TRANSACTIONS:
            if txn["id"] == txn_id:
                txn["date"] = data["date"]
                txn["description"] = data["description"]
                txn["amount"] = float(data["amount"])
                txn["type"] = data["type"]
                txn["category"] = data["category"]
                return jsonify({"success": True})

        return jsonify({"success": False, "error": "Transaction not found"}), 404

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@transactions_bp.route("/api/transactions/<int:txn_id>", methods=["DELETE"])
def delete_transaction(txn_id):
    """Delete a transaction by ID."""
    try:
        for txn in TRANSACTIONS:
            if txn["id"] == txn_id:
                TRANSACTIONS.remove(txn)
                return jsonify({"success": True})
        return jsonify({"success": False, "error": "Transaction not found"}), 404


    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
