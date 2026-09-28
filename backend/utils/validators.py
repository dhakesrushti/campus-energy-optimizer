import logging

def is_valid_reading(reading):
    required_fields = ['temperature', 'humidity', 'voltage', 'current', 'powerFactor', 'occupancy', 'power', 'timestamp']
    for field in required_fields:
        if field not in reading:
            return False
        if str(reading[field]).upper() == "NA":
            return False
    
    # Check numeric fields
    numeric_fields = ['temperature', 'humidity', 'voltage', 'current', 'powerFactor', 'power']
    for field in numeric_fields:
        try:
            float(reading[field])
        except ValueError:
            return False
            
    return True

def get_latest_valid_reading(collection):
    try:
        # Sort by timestamp descending
        cursor = collection.find().sort("timestamp", -1).limit(100)
        
        for reading in cursor:
            if is_valid_reading(reading):
                # Remove _id for JSON serialization
                reading.pop('_id', None)
                return reading
        
        return None
    except Exception as e:
        logging.error(f"Error fetching valid reading: {e}")
        return None
