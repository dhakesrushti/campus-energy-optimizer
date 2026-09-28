# Savings Calculation Logic

This document explains exactly how the Campus Energy Optimizer backend calculates real-time energy and cost savings using the Random Forest Machine Learning model and live MongoDB sensor data.

## 1. The Core Data Flow
For every sensor reading stored in MongoDB, we have two primary values we care about:
1. **Actual Power (from MongoDB):** What the ESP32 PZEM sensor reported the room was actually consuming (e.g., `450 Watts`).
2. **Expected Power (from ML Model):** What the `energy_model.pkl` predicts the room *should* be consuming based on environmental factors (`temperature`, `humidity`, `occupancy`, etc.).

## 2. Calculating Power Saved
For each reading, the system compares the Expected Power with the Actual Power:

```text
Power Saved (Watts) = Expected Power - Actual Power
```
> [!NOTE]
> If the Actual Power is *higher* than the Expected Power (meaning the system is underperforming or there is an anomaly), the `Power Saved` is capped at `0`. We do not calculate "negative savings".

## 3. Converting to Energy (kWh)
Power is an instantaneous measurement (Watts). To calculate *how much* energy was saved over time, we convert it to kilowatt-hours (kWh). 

Since sensor readings arrive approximately every 1 minute:
```text
Energy Saved (kWh) = (Power Saved in Watts / 1000) * (1 minute / 60 minutes)
```
The backend runs this calculation for every valid reading in the database and sums them together to get the **Total Energy Saved Today**.

## 4. Calculating Cost Savings
Once we have the total energy saved in kWh, calculating the cost savings is straightforward using the standard electricity tariff (₹8 per kWh):

```text
Cost Saved (₹) = Total Energy Saved (kWh) * 8
```

## 5. Projections
To provide a bigger picture on the dashboard, the system extrapolates the daily savings into monthly and annual projections:
- **Projected Monthly Savings:** `Cost Saved Today * 30 days`
- **Projected Annual Savings:** `Projected Monthly Savings * 12 months`

## 6. Optimization Efficiency
The dashboard also displays an "Optimization Efficiency" percentage and a "Reduction Percentage". This represents the overall impact of the system:

```text
Baseline Consumption = Sum of all Expected Power values
Current Consumption = Sum of all Actual Power values

Efficiency (%) = ((Baseline - Current) / Baseline) * 100
```
*Example: If the baseline expected power was 1200W, but actual was optimized down to 1046W, the reduction efficiency is `12.83%`.*
