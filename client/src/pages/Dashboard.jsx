import { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [forecast, setForecast] = useState([]);
  const [tip, setTip] = useState('');

  const predict = async () => {
    const numbers = input.split(',').map(Number);
    const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/forecast/predict`, { data: numbers });
    if (res.data.prediction) {
      setForecast(Array.isArray(res.data.prediction) ? res.data.prediction : JSON.parse(res.data.prediction));
      setTip(res.data.tip || '');
    } else {
      alert('No prediction received from backend');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-green-700">📈 Climate Forecast Predictor</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2 font-medium text-gray-700">Enter Historical Temperatures</label>
        <textarea
          placeholder="e.g. 23.5, 25.1, 26.4, 27.8"
          className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 placeholder:text-sm placeholder:text-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">Tip: Enter comma-separated values in °C</p>
        <button
          onClick={predict}
          className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition shadow"
        >
          🔮 Predict Future Temperatures
        </button>
      </div>

      {forecast.length > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-green-700 mb-4">📊 Prediction Result</h3>
          <ul className="space-y-2">
            {forecast.map((f, i) => (
              <li key={i} className="text-gray-700">➡️ Year {i + 1}: <b>{f}°C</b></li>
            ))}
          </ul>
          {tip && (
            <div className="mt-4 bg-green-100 text-green-900 p-4 rounded shadow">
              🌿 <b>AI Climate Tip:</b><br />
              <span className="italic">{tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
