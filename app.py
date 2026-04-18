import sys
from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

try:
    print("Loading model...", file=sys.stderr)
    model = joblib.load("random_forest_lead_conversion_model.pkl")
    meta = joblib.load("model_metadata.pkl")
    print("Model loaded", file=sys.stderr)
    
    encodings = meta['encodings']
    feature_names = meta['feature_names']
    
    print(f"Features: {feature_names}")
    print(f"Encodings: {list(encodings.keys())}")
except Exception as e:
    print(f"Error loading: {e}", file=sys.stderr)
    raise

GLOBAL_MEAN = 0.631

def get_encoded(category, col):
    return encodings.get(col, {}).get(category, GLOBAL_MEAN)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/meta")
def meta():
    return jsonify({
        "sales_agents": sorted(encodings.get('sales_agent', {}).keys()),
        "products": sorted(encodings.get('product', {}).keys()),
        "sectors": sorted(encodings.get('sector', {}).keys()),
        "office_locations": sorted(encodings.get('office_location', {}).keys()),
        "managers": sorted(encodings.get('manager', {}).keys()),
        "series": sorted(encodings.get('series', {}).keys()),
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        revenue = float(data['revenue'])
        employees = float(data['employees'])
        sales_price = float(data.get('sales_price', 1000))
        company_age = float(data['company_age'])
        
        sales_agent = data['sales_agent']
        product = data['product']
        manager = data.get('manager', 'Unknown')
        regional_office = data.get('regional_office', 'Unknown')
        sector = data['sector']
        office_location = data['office_location']
        series = data.get('series', 'Unknown')
        
        engage_date = datetime.strptime(data['engage_date'], '%Y-%m-%d')
        duration = max(0, (datetime.now() - engage_date).days)
        rev_per_employee = revenue / employees if employees > 0 else 0
        revenue_log = np.log1p(revenue)
        employees_log = np.log1p(employees)
        
        # Build features - simple numeric + target encoding only
        row = {
            'sales_agent': get_encoded(sales_agent, 'sales_agent'),
            'product': get_encoded(product, 'product'),
            'sector': get_encoded(sector, 'sector'),
            'office_location': get_encoded(office_location, 'office_location'),
            'series': get_encoded(series, 'series'),
            'sales_price': sales_price,
            'manager': get_encoded(manager, 'manager'),
            'regional_office': get_encoded(regional_office, 'regional_office'),
            'deal_duration': duration,
            'engage_month': engage_date.month,
            'company_age': company_age,
            'rev_per_employee': rev_per_employee,
            'revenue_log': revenue_log,
            'employees_log': employees_log,
            'sales_agent_wr': get_encoded(sales_agent, 'sales_agent'),
            'product_wr': get_encoded(product, 'product'),
            'manager_wr': get_encoded(manager, 'manager'),
            'regional_office_wr': get_encoded(regional_office, 'regional_office'),
            'sector_wr': get_encoded(sector, 'sector'),
            'office_location_wr': get_encoded(office_location, 'office_location'),
            'series_wr': get_encoded(series, 'series'),
        }
        
        missing = set(feature_names) - set(row.keys())
        if missing:
            return jsonify({"error": f"Missing features: {missing}"}), 400

        X = pd.DataFrame([row])[feature_names]
        
        prob = model.predict_proba(X)[0][1]
        prediction = 1 if prob >= 0.45 else 0
        
        return jsonify({
            "prediction": prediction,
            "label": "High Conversion Potential" if prediction == 1 else "Low Conversion Potential",
            "probability": round(prob * 100, 2)
        })
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route('/api/')
def api():
    return jsonify({'message': 'Cold Lead API', 'model': 'RandomForest', 'status': 'running'})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)