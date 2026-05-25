"""
data_store.py — In-Memory Data Store for Finance Tracker

Provides shared data structures and helper functions used by all
route modules. All data is volatile and resets on server restart.
"""

from datetime import date


# =========================================================================
# Auto-incrementing ID counters
# =========================================================================
_next_txn_id = 1
_next_cat_id = 1
_next_budget_id = 1


# =========================================================================
# Core data stores
# =========================================================================
TRANSACTIONS = []   # list of dicts: {id, date, description, amount, type, category}
CATEGORIES = []     # list of dicts: {id, name, type}
BUDGETS = []        # list of dicts: {id, category, monthly_limit}
SETTINGS = {}       # dict of key -> value


# =========================================================================
# ID generators
# =========================================================================

def next_txn_id():
    """Get and increment the transaction ID counter."""
    global _next_txn_id
    current = _next_txn_id
    _next_txn_id += 1
    return current


def next_cat_id():
    """Get and increment the category ID counter."""
    global _next_cat_id
    current = _next_cat_id
    _next_cat_id += 1
    return current


def next_budget_id():
    """Get and increment the budget ID counter."""
    global _next_budget_id
    current = _next_budget_id
    _next_budget_id += 1
    return current


# =========================================================================
# Helper utilities
# =========================================================================

def current_month_range():
    """Return (first_day, last_day) ISO date strings for the current month."""
    today = date.today()
    first = today.replace(day=1).isoformat()
    if today.month == 12:
        last = today.replace(year=today.year + 1, month=1, day=1)
    else:
        last = today.replace(month=today.month + 1, day=1)
    last = last.isoformat()  # exclusive upper bound
    return first, last


# =========================================================================
# Initialization
# =========================================================================

def init_defaults():
    """Seed default categories and settings into memory."""
    default_categories = [
        # Income categories
        ("Salary",        "Income"),
        ("Freelancing",   "Income"),
        ("Dividends",     "Income"),
        ("Investments",   "Income"),
        ("Other Income",  "Income"),
        # Expense categories
        ("Food",          "Expense"),
        ("Fuel",          "Expense"),
        ("Gaming",        "Expense"),
        ("Rent",          "Expense"),
        ("Utilities",     "Expense"),
        ("Entertainment", "Expense"),
        ("Shopping",      "Expense"),
        ("Transport",     "Expense"),
        ("Healthcare",    "Expense"),
        ("Education",     "Expense"),
        ("Other Expense", "Expense"),
    ]

    for name, cat_type in default_categories:
        CATEGORIES.append({"id": next_cat_id(), "name": name, "type": cat_type})

    SETTINGS["theme"] = "dark"
    SETTINGS["currency"] = "USD"

    print("[OK] In-memory data store initialised with defaults.")
