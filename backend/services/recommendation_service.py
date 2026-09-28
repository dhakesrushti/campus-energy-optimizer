def get_recommendation(occupancy, actual_power, expected_power):
    occupancy_val = 1 if occupancy else 0
    
    if occupancy_val == 0 and actual_power > 50:
        return "Room unoccupied. Switch off appliances."
        
    if actual_power > expected_power * 1.2:
        return "Abnormally high energy consumption detected. Investigate connected devices."
        
    return "Energy consumption normal."
