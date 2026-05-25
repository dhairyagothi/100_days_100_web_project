"""
routes/analytics.py — Analytics and summary 
"""

from datetime import date
from flask import Blueprint, jsonify
import pandas as pd

from data_store import TRANSACTIONS

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/api/analytics/summary", methods=["GET"])
def analytics_summary():
    """
    Financial summary calculation
    """
    try:
        if not TRANSACTIONS:
            return jsonify({
                "total_income": 0,
                "total_expense": 0,
                "total_savings": 0,

                "top_category": None,
                "transaction_count": 0,
            })

        df = pd.DataFrame(TRANSACTIONS)

        total_income = float(df.loc[df["type"] == "Income", "amount"].sum())

        total_expense = float(df.loc[df["type"] == "Expense", "amount"].sum())
        
        total_savings = total_income - total_expense
        
        transaction_count = len(df)

        expense_df = df[df["type"] == "Expense"]
        if not expense_df.empty:
            grouped = expense_df.groupby("category")["amount"].sum()
            top_category = {
                "name": grouped.idxmax(),
                "amount": float(grouped.max())
            }

        else:
            top_category = None

        return jsonify({
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "total_savings": round(total_savings, 2),
            "top_category": top_category,
            "transaction_count": transaction_count,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/category-breakdown", methods=["GET"])
def analytics_category_breakdown():
    """
    Group expenses by category 
    """
    try:
        expense_txns = [t for t in TRANSACTIONS if t["type"] == "Expense"]

        if not expense_txns:
            return jsonify({"categories": [], "amounts": [], "colors": []})

        df = pd.DataFrame(expense_txns)
        grouped = df.groupby("category")["amount"].sum().sort_values(ascending=False)

        categories = grouped.index.tolist()
        amounts = [round(v, 2) for v in grouped.values.tolist()]

        n = len(categories)
        # list colors
        colors = [
            f"hsl({int(i * 360 / n)}, 70%, 55%)" for i in range(n)
        ]

        return jsonify({
            "categories": categories,
            "amounts": amounts,
            "colors": colors,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/monthly-trend", methods=["GET"])
def analytics_monthly_trend():
    """
    Monthly income vs. expenses for the last 12 months using pandas.
    """
    try:
        if not TRANSACTIONS:
            return jsonify({"months": [], "income": [], "expenses": []})

        df = pd.DataFrame(TRANSACTIONS)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])
        df["month"] = df["date"].dt.to_period("M")

        # Last 12 months
        current_period = pd.Period(date.today(), freq="M")
        last_12 = [current_period - i for i in range(11, -1, -1)]

        income_series = (
            df[df["type"] == "Income"]
            .groupby("month")["amount"]
            .sum()
        )
        expense_series = (
            df[df["type"] == "Expense"]
            .groupby("month")["amount"]
            .sum()
        )

        months = [str(p) for p in last_12]

        
        income = [round(float(income_series.get(p, 0)), 2) for p in last_12]
        expenses = [round(float(expense_series.get(p, 0)), 2) for p in last_12]

        return jsonify({
            "months": months,

            "income": income,
            "expenses": expenses,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/savings-trend", methods=["GET"])
def analytics_savings_trend():
    """
    Monthly savings and cumulative savings for the last 12 months.
    """
    try:
        if not TRANSACTIONS:
            return jsonify({"months": [], "savings": [], "cumulative": []})

        df = pd.DataFrame(TRANSACTIONS)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])
        df["month"] = df["date"].dt.to_period("M")

        current_period = pd.Period(date.today(), freq="M")
        last_12 = [current_period - i for i in range(11, -1, -1)]

        income_series = df[df["type"] == "Income"].groupby("month")["amount"].sum()
        expense_series = df[df["type"] == "Expense"].groupby("month")["amount"].sum()

        savings = []
        cumulative = []
        running = 0.0

        for p in last_12:
            inc = float(income_series.get(p, 0))
            exp = float(expense_series.get(p, 0))
            s = inc - exp
            running += s
            savings.append(round(s, 2))
            cumulative.append(round(running, 2))

        months = [str(p) for p in last_12]

        return jsonify({
            "months": months,
            "savings": savings,
            "cumulative": cumulative,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/income-sources", methods=["GET"])
def analytics_income_sources():
    """Group income by category. Returns category names, amounts, and colors."""
    try:
        income_txns = [t for t in TRANSACTIONS if t["type"] == "Income"]

        if not income_txns:
            return jsonify({"categories": [], "amounts": [], "colors": []})

        df = pd.DataFrame(income_txns)
        grouped = df.groupby("category")["amount"].sum().sort_values(ascending=False)

        categories = grouped.index.tolist()
        amounts = [round(v, 2) for v in grouped.values.tolist()]

        n = len(categories)
        colors = [
            f"hsl({int(i * 360 / n + 120)}, 70%, 55%)" for i in range(n)
        ]

        return jsonify({
            "categories": categories,
            "amounts": amounts,
            "colors": colors,
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/daily-spending", methods=["GET"])
def analytics_daily_spending():
    """Daily expense totals for the last 30 days."""
    try:
        if not TRANSACTIONS:
            return jsonify({"dates": [], "amounts": []})

        df = pd.DataFrame(TRANSACTIONS)
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df = df.dropna(subset=["date"])

        expense_df = df[df["type"] == "Expense"]
        if expense_df.empty:
            return jsonify({"dates": [], "amounts": []})

        cutoff = pd.Timestamp.today() - pd.Timedelta(days=30)
        recent = expense_df[expense_df["date"] >= cutoff]

        if recent.empty:
            return jsonify({"dates": [], "amounts": []})

        daily = recent.groupby(recent["date"].dt.strftime("%Y-%m-%d"))["amount"].sum().sort_index()

        return jsonify({
            "dates": daily.index.tolist(),
            "amounts": [round(v, 2) for v in daily.values.tolist()],
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@analytics_bp.route("/api/analytics/top-categories", methods=["GET"])
def analytics_top_categories():
    """Top 5 expense categories by total amount."""
    try:
        expense_txns = [t for t in TRANSACTIONS if t["type"] == "Expense"]

        if not expense_txns:
            return jsonify({"categories": [], "amounts": [], "colors": []})

        df = pd.DataFrame(expense_txns)
        grouped = df.groupby("category")["amount"].sum().sort_values(ascending=False).head(5)

        categories = grouped.index.tolist()
        amounts = [round(v, 2) for v in grouped.values.tolist()]

        colors = ["#e94560", "#f5a623", "#50e3c2", "#4a90d9", "#c471ed"]

        return jsonify({
            "categories": categories,
            "amounts": amounts,
            "colors": colors[:len(categories)],
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
