from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Load the RandomForest Pipeline (which includes preprocessing)
model = joblib.load("random_forest_lead_conversion_model.pkl")

# We only include features that had non-negligible importance scores
# and are available at the time of lead entry.
REQUIRED_FIELDS = [
    'revenue', 'employees', 'sales_agent', 'product', 
    'sector', 'office_location', 'company_age'
]

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Valid values based on your dataset and model requirements
# I removed things like 'Managers' if they aren't explicitly used in your current pipeline
SALES_AGENTS = ['Boris Faz','Cassey Cress','Cecily Lampkin','Corliss Cosme','Daniell Hammack',
                'Darcel Schlecht','Donn Cantrell','Elease Gluck','Garret Kinder','Gladys Colclough',
                'Hayden Neloms','James Ascencio','Jonathan Berthelot','Kami Bicknell','Kary Hendrixson',
                'Lajuana Vencill','Markita Hansen','Marty Freudenburg','Maureen Marcano','Moses Frase',
                'Niesha Huffines','Reed Clapper','Rosalina Dieter','Rosie Papadopoulos',
                'Versie Hillebrand','Vicki Laflamme','Violet Mclelland','Wilburn Farren','Zane Levy']

PRODUCTS = ['GTX Basic','GTX Plus Basic','GTX Plus Pro','GTXPro','MG Advanced','MG Special']

SECTORS = ['employment','entertainment','finance','marketing','medical','retail',
           'services','software','technolgy','telecommunications']

OFFICE_LOCATIONS = ['Brazil','China','Germany','Italy','Japan','Jordan','Kenya','Korea',
                    'Norway','Panama','Philipines','Poland','Romania','United States']

@app.route("/api/meta", methods=["GET"])
def meta():
    """Frontend calls this to populate all selection fields."""
    return jsonify({
        "sales_agents": sorted(SALES_AGENTS),
        "products": sorted(PRODUCTS),
        "sectors": sorted(SECTORS),
        "office_locations": sorted(OFFICE_LOCATIONS),
        # NEW: Managers required by the Random Forest model
        "managers": [
            "Celia Rouche", "Dustin Brinkmann", "Melvin Marxen", 
            "Rocco Neubert", "Summer Sewald"
        ],
        # NEW: Product Series required by the model
        "series": ["GTX", "MG", "Unknown"],
        # NEW: Regional Offices (to avoid 'Unknown' if possible)
        "regional_offices": ["East", "West", "Central"] 
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        # 1. Calculate Deal Duration
        # Expects engage_date in "YYYY-MM-DD" format from frontend
        engage_date = datetime.strptime(data['engage_date'], '%Y-%m-%d')
        today = datetime.now()
        duration = (today - engage_date).days
        
        # 2. Create DataFrame with all columns the model expects
        input_df = pd.DataFrame([{
            # User Inputs
            'revenue': float(data['revenue']),
            'employees': float(data['employees']),
            'sales_agent': data['sales_agent'],
            'product': data['product'],
            'sector': data['sector'],
            'office_location': data['office_location'],
            'company_age': float(data['company_age']),
            'manager': data['manager'],
            'series': data['series'],
            'sales_price': float(data.get('sales_price', 0)),
            'regional_office': data.get('regional_office', 'Unknown'),
            
            # Calculated Features
            'deal_duration': max(0, duration), # Ensure no negative days
            'revenue_log': np.log1p(float(data['revenue'])),
            'employees_log': np.log1p(float(data['employees'])),
            'rev_per_employee': float(data['revenue']) / float(data['employees']) if float(data['employees']) > 0 else 0,
            
            # Placeholder/Average values for remaining missing columns
            'agent_win_rate': 0.5, 
            'product_win_rate': 0.5
        }])

        # 3. Predict with your 46.1% threshold
        prob = model.predict_proba(input_df)[0][1]
        custom_threshold = 0.461
        prediction = 1 if prob >= custom_threshold else 0

        return jsonify({
            "prediction": prediction,
            "label": "High Conversion Potential" if prediction == 1 else "Low Conversion Potential",
            "probability": round(prob * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/', methods=['GET'])
def api_home():
    return jsonify({
        'message': 'Cold Lead Conversion Prediction API',
        'endpoints': {
            'GET /api/': 'API info',
            'GET /api/predict_sample': 'Predict on sample data',
            'POST /api/predict': 'Predict with custom input'
        },
        'model': 'CatBoost',
        'status': 'running'
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

	