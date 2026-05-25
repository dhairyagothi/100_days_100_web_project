"""
app.py — Flask Entry Point for Finance Tracker
Slim entry point that imports and registers all route Blueprints.
All data is stored in-memory via data_store.py.
"""

import os
from flask import Flask, render_template

from data_store import init_defaults

# Import Blueprints
from routes.transactions import transactions_bp
from routes.categories import categories_bp
from routes.budgets import budgets_bp
from routes.analytics import analytics_bp
from routes.csv_routes import csv_bp
from routes.charts import charts_bp
from routes.settings import settings_bp

# App Configuration

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Register Blueprints

app.register_blueprint(transactions_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(budgets_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(csv_bp)
app.register_blueprint(charts_bp)
app.register_blueprint(settings_bp)

# Initialise in-memory data

init_defaults()

# Page Route

@app.route("/")
def index():
    """Serve the main single-page application."""
    return render_template("index.html")

# Run the application

if __name__ == "__main__":
    app.run(debug=True, port=5000)
