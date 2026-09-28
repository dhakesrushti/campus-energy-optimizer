import logging

def sanitize_reading(reading):
    required_fields = ['temperature', 'humidity', 'voltage', 'current', 'powerFactor', 'power', 'energy']
    
    # Ensure all required fields exist, if not set them to 0.0
    for field in required_fields:
        if field not in reading or str(reading.get(field)).upper() == "NA":
            reading[field] = 0.0
        else:
            try:
                reading[field] = float(reading[field])
            except ValueError:
                reading[field] = 0.0
                
    return reading

def is_valid_reading(reading):
    # Now we accept all readings that at least have a timestamp
    return 'timestamp' in reading

def get_latest_valid_reading(collection):
    try:
        # Sort by timestamp descending
        cursor = collection.find().sort("timestamp", -1).limit(100)
        
        for reading in cursor:
            if is_valid_reading(reading):
                reading = sanitize_reading(reading)
                # Remove _id for JSON serialization
                reading.pop('_id', None)
                return reading
        
        return None
    except Exception as e:
        logging.error(f"Error fetching valid reading: {e}")
        return None
