def detect_anomaly(actual_power, expected_power):
    if actual_power > expected_power * 1.2:
        return "ANOMALY"
    return "NORMAL"
