from database.mongo import db
from services.prediction_service import prediction_service
from utils.validators import is_valid_reading, sanitize_reading
import pandas as pd

def calculate_savings():
    # Fetch all valid readings (limit to 5000 for performance)
    cursor = db.collection.find().sort("timestamp", -1).limit(5000)
    
    readings = []
    for reading in cursor:
        if is_valid_reading(reading):
            readings.append(sanitize_reading(reading))

    if not readings:
        return None

    # We need to run predictions for all these readings
    # To be fast, let's build a dataframe and do a bulk predict
    features_list = []
    actual_powers = []
    
    for r in readings:
        occupancy_val = 1 if r.get('occupancy') else 0
        features_list.append({
            'temperature': float(r['temperature']),
            'humidity': float(r['humidity']),
            'voltage': float(r['voltage']),
            'current': float(r['current']),
            'powerFactor': float(r['powerFactor']),
            'occupancy': occupancy_val
        })
        actual_powers.append(float(r['power']))
        
    features_df = pd.DataFrame(features_list)
    
    expected_powers = []
    if prediction_service.model:
        expected_powers = prediction_service.model.predict(features_df)
    else:
        # Fallback if model not loaded
        expected_powers = actual_powers

    total_expected_power = 0
    total_actual_power = 0
    total_energy_saved_kwh = 0
    
    for expected_power, actual_power in zip(expected_powers, actual_powers):
        total_expected_power += expected_power
        total_actual_power += actual_power
        
        power_saved_watts = expected_power - actual_power
        if power_saved_watts < 0:
            power_saved_watts = 0
            
        # energy saved per reading (assuming 1 reading per minute)
        energy_saved_kwh = (power_saved_watts / 1000) * (1/60)
        total_energy_saved_kwh += energy_saved_kwh

    cost_saved_today = total_energy_saved_kwh * 8
    
    optimization_efficiency = 0
    if total_expected_power > 0:
        optimization_efficiency = ((total_expected_power - total_actual_power) / total_expected_power) * 100
        if optimization_efficiency < 0:
            optimization_efficiency = 0
            
    reduction_percentage = 0
    if total_expected_power > 0:
        reduction_percentage = ((total_expected_power - total_actual_power) / total_expected_power) * 100
        if reduction_percentage < 0:
            reduction_percentage = 0

    monthly_savings = cost_saved_today * 30 # Simple extrapolation
    annual_savings = monthly_savings * 12

    # Generate Dynamic Insights
    if optimization_efficiency > 10:
        dynamic_insight = "The system is successfully reducing energy consumption compared to predicted baseline usage."
    elif optimization_efficiency >= 5:
        dynamic_insight = "The system is achieving moderate energy optimization."
    else:
        dynamic_insight = "The system has limited optimization opportunities and further improvements are recommended."

    # Generate Dynamic Recommendation
    # We can check the latest reading to give a recommendation
    dynamic_recommendation = "Energy usage is within expected limits."
    if readings:
        latest = readings[0]
        if not latest.get('occupancy') and float(latest.get('power', 0)) > 50:
            dynamic_recommendation = "Room is vacant while consuming power. Consider switching off unused appliances."
        elif float(latest.get('power', 0)) > expected_powers[0] * 1.2:
            dynamic_recommendation = "Abnormally high energy consumption detected."

    return {
        "total_records_analyzed": len(readings),
        "energy_saved_today_kwh": round(total_energy_saved_kwh, 2),
        "cost_saved_today": round(cost_saved_today, 2),
        "optimization_efficiency": round(optimization_efficiency, 2),
        "monthly_savings": round(monthly_savings, 2),
        "annual_savings": round(annual_savings, 2),
        "baseline_consumption": round(total_expected_power, 2),
        "current_consumption": round(total_actual_power, 2),
        "reduction_percentage": round(reduction_percentage, 2),
        "dynamic_insight": dynamic_insight,
        "dynamic_recommendation": dynamic_recommendation
    }
