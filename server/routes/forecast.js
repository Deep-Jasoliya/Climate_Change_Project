const express = require('express');
const { spawn } = require('child_process');
const generateTip = require('../utils/gemini');
const router = express.Router();

router.post('/predict', (req, res) => {
  const inputData = JSON.stringify(req.body.data);
  if (!req.body.data || !Array.isArray(req.body.data)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const python = spawn('python', ['ml/forecast.py', inputData]);
  let output = '';

  python.stdout.on('data', (data) => {
    output += data.toString();
  });

  python.stderr.on('data', (err) => {
    console.error('Python error:', err.toString());
  });

  python.on('close', async () => {
    if (output) {
      try {
        const parsed = JSON.parse(output);
        const prompt = `Given this future temperature trend: [${parsed.join(', ')}], suggest one short and practical climate adaptation tip.`;
        const tip = await generateTip(prompt);
        res.json({ prediction: parsed, tip: tip || "No tip generated" });
      } catch (err) {
        res.status(500).json({ error: 'Error parsing Python output' });
      }
    } else {
      res.status(500).json({ error: 'No output from model' });
    }
  });
});

module.exports = router;
