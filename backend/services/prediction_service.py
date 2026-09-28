import joblib
import os
import pandas as pd
import logging

class PredictionService:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'energy_model.pkl')
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                logging.info("Energy model loaded successfully.")
            else:
                logging.warning(f"Model file not found at {model_path}. Please place it there.")
        except Exception as e:
            logging.error(f"Failed to load model: {e}")

    def predict_power(self, reading):
        if not self.model:
            return None, "Model not loaded"

        try:
            # Prepare feature vector: temperature, humidity, voltage, current, powerFactor, occupancy
            occupancy_val = 1 if reading.get('occupancy') else 0
            
            features = pd.DataFrame([{
                'temperature': float(reading['temperature']),
                'humidity': float(reading['humidity']),
                'voltage': float(reading['voltage']),
                'current': float(reading['current']),
                'powerFactor': float(reading['powerFactor']),
                'occupancy': occupancy_val
            }])

            expected_power = self.model.predict(features)[0]
            actual_power = float(reading['power'])
            
            deviation = ((actual_power - expected_power) / expected_power) * 100 if expected_power > 0 else 0

            return {
                'expected_power': round(expected_power, 2),
                'actual_power': actual_power,
                'deviation': round(deviation, 2)
            }, None
        except Exception as e:
            logging.error(f"Error in prediction: {e}")
            return None, str(e)

prediction_service = PredictionService()
