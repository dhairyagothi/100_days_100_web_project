"""
routes/csv_routes.py — CSV import/export routes
"""

import io
from flask import Blueprint, request, jsonify, send_file
import pandas as pd

from data_store import TRANSACTIONS, CATEGORIES, next_txn_id, next_cat_id

csv_bp = Blueprint("csv", __name__)


@csv_bp.route("/api/csv/upload", methods=["POST"])
def csv_upload():
    """
    Accept a CSV file upload, validate its columns, and directly import all transactions.
    """
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename"}), 400

        # Read CSV with pandas
        df = pd.read_csv(file)

        # Normalise column names to title case for matching
        df.columns = [col.strip().title() for col in df.columns]

        required_cols = {"Date", "Description", "Amount", "Type", "Category"}
        if not required_cols.issubset(set(df.columns)):
            missing = required_cols - set(df.columns)
            return jsonify({
                "success": False,
                "error": f"Missing columns: {', '.join(missing)}",
            }), 400

        # Keep only the required columns and handle missing values
        df = df[["Date", "Description", "Amount", "Type", "Category"]]
        df = df.dropna(subset=["Date", "Amount", "Type", "Category"])

        # Import directly into memory
        count = 0
        for _, row in df.iterrows():
            category_name = str(row["Category"]).strip()
            txn_type = str(row["Type"]).strip()
            
            # Auto-create category if it doesn't exist
            exists = any(
                c["name"] == category_name and c["type"] == txn_type
                for c in CATEGORIES
            )
            if not exists:
                CATEGORIES.append({
                    "id": next_cat_id(),
                    "name": category_name,
                    "type": txn_type,
                })

            # Format the date (attempt to parse to standard format, fallback to original string if failed)
            date_val = str(row["Date"]).strip()
            try:
                # Try to parse and format as YYYY-MM-DD
                parsed_date = pd.to_datetime(date_val)
                date_val = parsed_date.strftime('%Y-%m-%d')
            except:
                pass

            TRANSACTIONS.append({
                "id": next_txn_id(),
                "date": date_val,
                "description": str(row["Description"]) if pd.notna(row["Description"]) else "",
                "amount": float(row["Amount"]),
                "type": txn_type,
                "category": category_name,
            })
            count += 1

        return jsonify({
            "success": True,
            "count": count
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@csv_bp.route("/api/csv/export", methods=["GET"])
def csv_export():
    """Export all transactions as a downloadable CSV file using pandas."""
    try:
        df = pd.DataFrame(TRANSACTIONS, columns=["date", "description", "amount", "type", "category"])

        # Write to an in-memory buffer
        buffer = io.StringIO()
        df.to_csv(buffer, index=False)
        buffer.seek(0)

        mem = io.BytesIO(buffer.getvalue().encode("utf-8"))
        mem.seek(0)

        return send_file(
            mem,
            mimetype="text/csv",
            as_attachment=True,
            download_name="transactions_export.csv",
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
