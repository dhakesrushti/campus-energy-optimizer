from flask import Blueprint, jsonify, request
from utils.validators import get_latest_valid_reading
from database.mongo import db
from services.prediction_service import prediction_service
from services.anomaly_service import detect_anomaly
from services.recommendation_service import get_recommendation

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/api/latest-reading', methods=['GET'])
def get_latest_reading():
    reading = get_latest_valid_reading(db.collection)
    if not reading:
        return jsonify({"error": "No valid readings found"}), 404
    return jsonify(reading)

@prediction_bp.route('/api/predict', methods=['GET'])
def get_prediction():
    reading = get_latest_valid_reading(db.collection)
    if not reading:
        return jsonify({"error": "No valid readings found"}), 404

    prediction_result, error = prediction_service.predict_power(reading)
    if error:
        return jsonify({"error": error}), 500

    actual_power = prediction_result['actual_power']
    expected_power = prediction_result['expected_power']
    
    status = detect_anomaly(actual_power, expected_power)
    recommendation = get_recommendation(reading.get('occupancy'), actual_power, expected_power)

    return jsonify({
        "temperature": reading.get('temperature'),
        "humidity": reading.get('humidity'),
        "occupancy": reading.get('occupancy'),
        "actual_power": actual_power,
        "expected_power": expected_power,
        "deviation": prediction_result['deviation'],
        "status": status,
        "recommendation": recommendation
    })

@prediction_bp.route('/api/dashboard-summary', methods=['GET'])
def get_dashboard_summary():
    # Same payload as predict per requirements
    return get_prediction()

@prediction_bp.route('/api/savings', methods=['GET'])
def get_savings():
    from services.savings_service import calculate_savings
    try:
        savings_data = calculate_savings()
        if not savings_data:
            return jsonify({"error": "No valid readings found to calculate savings"}), 404
        return jsonify(savings_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@prediction_bp.route('/api/history', methods=['GET'])
def get_history():

    try:
        limit = request.args.get('limit', default=50, type=int)
        cursor = db.collection.find().sort("timestamp", -1).limit(limit)
        
        history = []
        for reading in cursor:
            reading.pop('_id', None)
            history.append(reading)
            
        return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
