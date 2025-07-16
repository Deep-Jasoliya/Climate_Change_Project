const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
const router = express.Router();
const generateTip = require('../utils/gemini');

// Get coordinates from Open-Meteo
async function getCoordinates(city) {
  const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
  const result = res.data.results?.[0];
  if (!result) return null;
  return { lat: result.latitude, lon: result.longitude, name: result.name };
}

router.get('/live-score', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // Step 1: Get coordinates
    const coords = await getCoordinates(city);
    if (!coords) return res.status(404).json({ error: 'City not found' });
    const { lat, lon, name } = coords;

    // Step 2: Get current temperature
    const weatherRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m',
        timezone: 'auto',
      },
    });
    const temperature = weatherRes.data.current.temperature_2m;

    // Step 3: Get air quality (PM2.5 AQI)
    const airRes = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'pm2_5',
        timezone: 'auto',
      },
    });
    const aqi = airRes.data.hourly?.pm2_5?.[0] || 50;

    const population = coords.population || 1000;
    const co2 = 419.5;
    let industry = 5;
    if (population > 2000) industry = 9;
    else if (population > 1000) industry = 7;
    else if (population > 500) industry = 5;
    else industry = 3;

    // Step 4: Run Python model
    const input = JSON.stringify({ lat, lon });
    const py = spawn('python', ['ml/risk_score.py', input]);

    let output = '';
    py.stdout.on('data', (data) => (output += data.toString()));
    py.stderr.on('data', (err) => console.error('Python error:', err.toString()));

    py.on('close', async () => {
      try {
        const result = JSON.parse(output);
        if (result.error) return res.status(500).json({ error: result.error });

        // Step 5: Generate AI tip using Gemini
        const prompt = `
You are an environmental assistant. Based on the following conditions, suggest one short, practical climate action tip (max 30 words):

- City: ${name}
- Risk Score: ${result.risk_score}/10
- Temperature: ${temperature}°C
- AQI: ${aqi}
- CO2: ${co2} ppm
- Population: ${population}
- Industry Index: ${industry}

The tip should help communities or local governments take action to reduce climate risk.
        `;
        const tip = await generateTip(prompt);

        return res.json({
          city: name,
          lat,
          lon,
          temperature,
          co2,
          aqi,
          population,
          industry,
          risk_score: result.risk_score,
          tip: tip || "No tip generated"
        });
      } catch (err) {
        console.error('Model output parse error:', output);
        return res.status(500).json({ error: 'Invalid model output' });
      }
    });
  } catch (err) {
    console.error('Live-score error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
