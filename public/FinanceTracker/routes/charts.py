"""
routes/charts.py — Matplotlib chart export routes
"""

import io
import zipfile
from datetime import date

from flask import Blueprint, request, jsonify, send_file
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from data_store import TRANSACTIONS

charts_bp = Blueprint("charts", __name__)


@charts_bp.route("/api/export/charts", methods=["POST"])
def export_charts():
    """
    Generate matplotlib charts and return them as a ZIP file.

    Body:
      charts — list of chart names to include
      format — image format (default 'png')

    Supported chart names:
      category_breakdown, monthly_expenses, income_vs_expense, savings_trend
    """
    try:
        data = request.get_json()
        chart_names = data.get("charts", [])
        img_format = data.get("format", "png")

        # Normalize chart names — frontend may send short or full names
        name_map = {
            'category': 'category_breakdown',
            'monthly': 'monthly_expenses',
            'income-expense': 'income_vs_expense',
            'savings': 'savings_trend',
            'income-sources': 'income_sources',
            'daily-spending': 'daily_spending',
            'top-categories': 'top_categories',
        }
        chart_names = [name_map.get(n, n) for n in chart_names]

        if not chart_names:
            return jsonify({"success": False, "error": "No charts selected"}), 400

        # Build a DataFrame from in-memory transactions
        df = pd.DataFrame(TRANSACTIONS) if TRANSACTIONS else pd.DataFrame(
            columns=["date", "description", "amount", "type", "category"]
        )
        if not df.empty:
            df["date"] = pd.to_datetime(df["date"], errors="coerce")

        # ---- Style constants (dark theme) ----
        BG_COLOR = "#1a1a2e"
        FG_COLOR = "#ffffff"
        ACCENT_COLORS = [
            "#e94560", "#0f3460", "#16213e", "#533483",
            "#e94560", "#f5a623", "#50e3c2", "#4a90d9",
            "#b8e986", "#ff6b6b", "#c471ed", "#12cbc4",
        ]

        def _style_ax(fig, ax):
            """Apply dark-theme styling to a matplotlib figure/axes."""
            fig.patch.set_facecolor(BG_COLOR)
            ax.set_facecolor(BG_COLOR)
            ax.tick_params(colors=FG_COLOR)
            ax.xaxis.label.set_color(FG_COLOR)
            ax.yaxis.label.set_color(FG_COLOR)
            ax.title.set_color(FG_COLOR)
            for spine in ax.spines.values():
                spine.set_color("#333355")

        # Store generated images
        images = {}

        # ---- 1. Category Breakdown (Pie) ----
        if "category_breakdown" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            expense_df = df[df["type"] == "Expense"] if not df.empty else pd.DataFrame()
            if not expense_df.empty:
                grouped = expense_df.groupby("category")["amount"].sum().sort_values(ascending=False)
                colors = ACCENT_COLORS[: len(grouped)]
                wedges, texts, autotexts = ax.pie(
                    grouped.values,
                    labels=grouped.index,
                    autopct="%1.1f%%",
                    colors=colors,
                    textprops={"color": FG_COLOR, "fontsize": 10},
                    startangle=140,
                )
                for t in autotexts:
                    t.set_fontsize(9)
            ax.set_title("Expense Category Breakdown", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"category_breakdown.{img_format}"] = buf.getvalue()

        # ---- 2. Monthly Expenses (Bar) ----
        if "monthly_expenses" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            expense_df = df[df["type"] == "Expense"] if not df.empty else pd.DataFrame()
            if not expense_df.empty and "date" in expense_df.columns:
                expense_df = expense_df.dropna(subset=["date"])
                expense_df["month"] = expense_df["date"].dt.to_period("M").astype(str)
                monthly = expense_df.groupby("month")["amount"].sum().tail(12)
                ax.bar(monthly.index, monthly.values, color="#e94560", edgecolor="#ff6b6b", linewidth=0.5)
                ax.set_xlabel("Month", fontsize=12)
                ax.set_ylabel("Amount", fontsize=12)
                plt.xticks(rotation=45, ha="right")
            ax.set_title("Monthly Expenses", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"monthly_expenses.{img_format}"] = buf.getvalue()

        # ---- 3. Income vs Expense (Grouped Bar) ----
        if "income_vs_expense" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            if not df.empty:
                df_valid = df.dropna(subset=["date"])
                df_valid["month"] = df_valid["date"].dt.to_period("M").astype(str)
                pivot = df_valid.pivot_table(
                    index="month", columns="type", values="amount", aggfunc="sum", fill_value=0
                ).tail(12)
                x = range(len(pivot.index))
                width = 0.35
                income_vals = pivot.get("Income", pd.Series([0] * len(pivot))).values
                expense_vals = pivot.get("Expense", pd.Series([0] * len(pivot))).values
                ax.bar([i - width / 2 for i in x], income_vals, width, label="Income", color="#50e3c2")
                ax.bar([i + width / 2 for i in x], expense_vals, width, label="Expense", color="#e94560")
                ax.set_xticks(list(x))
                ax.set_xticklabels(pivot.index, rotation=45, ha="right")
                ax.legend(facecolor=BG_COLOR, edgecolor="#333355", labelcolor=FG_COLOR)
                ax.set_xlabel("Month", fontsize=12)
                ax.set_ylabel("Amount", fontsize=12)
            ax.set_title("Income vs Expense", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"income_vs_expense.{img_format}"] = buf.getvalue()

        # ---- 4. Savings Trend (Line) ----
        if "savings_trend" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            if not df.empty:
                df_valid = df.dropna(subset=["date"])
                df_valid["month"] = df_valid["date"].dt.to_period("M")

                current_period = pd.Period(date.today(), freq="M")
                last_12 = [current_period - i for i in range(11, -1, -1)]

                inc = df_valid[df_valid["type"] == "Income"].groupby("month")["amount"].sum()
                exp = df_valid[df_valid["type"] == "Expense"].groupby("month")["amount"].sum()

                savings_vals = [float(inc.get(p, 0)) - float(exp.get(p, 0)) for p in last_12]
                cumulative_vals = []
                running = 0.0
                for s in savings_vals:
                    running += s
                    cumulative_vals.append(running)

                months_labels = [str(p) for p in last_12]

                ax.plot(months_labels, savings_vals, marker="o", color="#f5a623", linewidth=2, label="Monthly Savings")
                ax.plot(months_labels, cumulative_vals, marker="s", color="#50e3c2", linewidth=2, label="Cumulative")
                ax.fill_between(months_labels, savings_vals, alpha=0.15, color="#f5a623")
                ax.legend(facecolor=BG_COLOR, edgecolor="#333355", labelcolor=FG_COLOR)
                ax.set_xlabel("Month", fontsize=12)
                ax.set_ylabel("Amount", fontsize=12)
                plt.xticks(rotation=45, ha="right")
            ax.set_title("Savings Trend", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"savings_trend.{img_format}"] = buf.getvalue()

        # ---- 5. Income Sources (Pie) ----
        if "income_sources" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            income_df = df[df["type"] == "Income"] if not df.empty else pd.DataFrame()
            if not income_df.empty:
                grouped = income_df.groupby("category")["amount"].sum().sort_values(ascending=False)
                colors = ACCENT_COLORS[: len(grouped)]
                wedges, texts, autotexts = ax.pie(
                    grouped.values,
                    labels=grouped.index,
                    autopct="%1.1f%%",
                    colors=colors,
                    textprops={"color": FG_COLOR, "fontsize": 10},
                    startangle=140,
                )
                for t in autotexts:
                    t.set_fontsize(9)
            ax.set_title("Income Sources Breakdown", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"income_sources.{img_format}"] = buf.getvalue()

        # ---- 6. Daily Spending (Line - last 30 days) ----
        if "daily_spending" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            expense_df = df[df["type"] == "Expense"] if not df.empty else pd.DataFrame()
            if not expense_df.empty and "date" in expense_df.columns:
                expense_df = expense_df.dropna(subset=["date"])
                last_30 = expense_df[expense_df["date"] >= (pd.Timestamp.today() - pd.Timedelta(days=30))]
                if not last_30.empty:
                    daily = last_30.groupby(expense_df["date"].dt.date)["amount"].sum()
                    ax.fill_between(range(len(daily)), daily.values, alpha=0.3, color="#e94560")
                    ax.plot(range(len(daily)), daily.values, color="#e94560", linewidth=2, marker="o", markersize=4)
                    ax.set_xticks(range(0, len(daily), max(1, len(daily)//6)))
                    labels = [str(d) for d in daily.index]
                    ax.set_xticklabels([labels[i] for i in range(0, len(labels), max(1, len(labels)//6))], rotation=45, ha="right")
                    ax.set_xlabel("Date", fontsize=12)
                    ax.set_ylabel("Amount", fontsize=12)
            ax.set_title("Daily Spending (Last 30 Days)", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"daily_spending.{img_format}"] = buf.getvalue()

        # ---- 7. Top Categories (Horizontal Bar - Top 5) ----
        if "top_categories" in chart_names:
            fig, ax = plt.subplots(figsize=(12, 8), dpi=100)
            _style_ax(fig, ax)
            expense_df = df[df["type"] == "Expense"] if not df.empty else pd.DataFrame()
            if not expense_df.empty:
                grouped = expense_df.groupby("category")["amount"].sum().sort_values(ascending=True).tail(5)
                colors = ACCENT_COLORS[: len(grouped)]
                bars = ax.barh(grouped.index, grouped.values, color=colors, edgecolor="none", height=0.6)
                for bar, val in zip(bars, grouped.values):
                    ax.text(val + max(grouped.values) * 0.02, bar.get_y() + bar.get_height()/2,
                            f'{val:,.0f}', va='center', color=FG_COLOR, fontsize=10)
                ax.set_xlabel("Amount", fontsize=12)
            ax.set_title("Top 5 Spending Categories", fontsize=16, fontweight="bold", pad=20)
            buf = io.BytesIO()
            fig.savefig(buf, format=img_format, bbox_inches="tight", facecolor=BG_COLOR)
            plt.close(fig)
            buf.seek(0)
            images[f"top_categories.{img_format}"] = buf.getvalue()

        # ---- Package into ZIP ----
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for filename, data_bytes in images.items():
                zf.writestr(filename, data_bytes)
        zip_buffer.seek(0)

        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name="finance_charts.zip",
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
