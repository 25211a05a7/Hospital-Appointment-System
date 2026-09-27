/**
 * CareConnect Hospital Appointment System
 * Experiment 10: External API Integration (Live Weather & Health Advisory API)
 * 
 * Demonstrates:
 * 1. Fetching external real-time data using HTTP/HTTPS API (Open-Meteo Public API)
 * 2. Processing JSON response asynchronously
 * 3. Computing dynamic clinical health tips based on real-time temperature, humidity, and weather conditions
 */

const https = require('https');

function fetchWeatherAndHealthTips(city = 'Bangalore', lat = 12.9716, lon = 77.5946) {
  console.log('===============================================================');
  console.log(` CareConnect Hospital - External Weather & Health API Demo`);
  console.log(` Location: ${city} (Lat: ${lat}, Lon: ${lon})`);
  console.log('===============================================================\n');

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&timezone=auto`;

  console.log(`[1] Sending HTTP GET request to external REST API:\n    ${apiUrl}\n`);

  https.get(apiUrl, (res) => {
    let rawData = '';
    res.on('data', chunk => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(rawData);
        const current = parsed.current;

        console.log('[2] Live Weather Data Received:');
        console.log(`    - Temperature:         ${current.temperature_2m} °C`);
        console.log(`    - Feels Like:          ${current.apparent_temperature} °C`);
        console.log(`    - Relative Humidity:   ${current.relative_humidity_2m} %`);
        console.log(`    - Precipitation:       ${current.precipitation} mm`);
        console.log(`    - Weather Code:        ${current.weather_code}`);

        // Health recommendations logic
        console.log('\n[3] Automated Hospital Health Advisory:');
        const advisories = [];

        if (current.temperature_2m > 33) {
          advisories.push('⚠️ Heat Alert: High ambient temperature. Drink at least 3-4 liters of water and avoid strenuous midday outdoor activity.');
        } else if (current.temperature_2m < 18) {
          advisories.push('❄️ Cold Advisory: Keep warm to prevent respiratory tract infections and bronchial flare-ups.');
        } else {
          advisories.push('☀️ Pleasant Weather: Great conditions for walking and outdoor wellness activities.');
        }

        if (current.relative_humidity_2m > 75) {
          advisories.push('💧 High Humidity: Asthma and respiratory patients should keep inhalers handy due to potential fungal/mold spore elevation.');
        }

        advisories.forEach((tip, idx) => {
          console.log(`    ${idx + 1}. ${tip}`);
        });

        console.log('\n===============================================================');
        console.log(' ✅ EXTERNAL API INTEGRATION SUCCESSFUL!');
        console.log('===============================================================');

      } catch (e) {
        console.error('Failed to parse API response:', e.message);
      }
    });
  }).on('error', (err) => {
    console.error('API Request Error:', err.message);
  });
}

fetchWeatherAndHealthTips();
