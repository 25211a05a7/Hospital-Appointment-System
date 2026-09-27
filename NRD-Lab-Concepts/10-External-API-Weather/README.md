# Experiment 10: External API Integration (Weather & Health Advisories)

## 1. Overview
Modern healthcare systems often integrate with external RESTful third-party APIs (such as Open-Meteo weather API or air quality indices) to generate preventative health alerts for chronic patients (asthma, cardiovascular, heat stroke risk).

## 2. Files
- `weather_health_api.js`: Node.js script fetching real-time weather data and dynamically generating patient advisories.

## 3. How to Run
```bash
node weather_health_api.js
```

## 4. Expected Output
```text
===============================================================
 CareConnect Hospital - External Weather & Health API Demo
 Location: Bangalore (Lat: 12.9716, Lon: 77.5946)
===============================================================

[1] Sending HTTP GET request to external REST API...
[2] Live Weather Data Received:
    - Temperature:         27.4 °C
    - Feels Like:          28.1 °C
    - Relative Humidity:   62 %
    - Precipitation:       0.0 mm
    - Weather Code:        1

[3] Automated Hospital Health Advisory:
    1. ☀️ Pleasant Weather: Great conditions for walking and outdoor wellness activities.

===============================================================
 ✅ EXTERNAL API INTEGRATION SUCCESSFUL!
===============================================================
```
