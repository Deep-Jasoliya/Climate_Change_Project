// routes/climate.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/history', async (req, res) => {
  const { lat, lon, start, end } = req.query;

  if (!lat || !lon || !start || !end) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Format start/end as YYYYMMDD for NASA
    const formattedStart = start.replace(/-/g, '');
    const formattedEnd = end.replace(/-/g, '');

    const nasaResponse = await axios.get('https://power.larc.nasa.gov/api/temporal/daily/point', {
      timeout: 10000,
      params: {
        latitude: lat,
        longitude: lon,
        start: formattedStart,
        end: formattedEnd,
        parameters: 'T2M,PRECTOTCORR',
        format: 'JSON',
         community: 'RE' 
      },
    });

    const raw = nasaResponse.data.properties.parameter;
    const dates = Object.keys(raw.T2M);
    const temperature_2m_max = dates.map((d) => raw.T2M[d]);
    const precipitation_sum = dates.map((d) => raw.PRECTOTCORR[d]);

    // Simulate min temps with offset from max
    const temperature_2m_min = temperature_2m_max.map((max) => max - 4.5);

    res.json({
      daily: {
        time: dates,
        temperature_2m_max,
        temperature_2m_min,
        precipitation_sum,
      },
      // Optional: re-add Gemini AI tips in future
      // tip: await generateTipFromData(dates, temperature_2m_max, ...)
    });
  } catch (err) {
    console.error('📉 NASA API error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to fetch climate data' });
  }
});

module.exports = router;
