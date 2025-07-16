import { useState } from 'react';
import axios from 'axios';

const RiskScore = () => {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/risk/live-score?city=${city}`);
      setData(res.data);
    } catch (err) {
      alert('API failed or city not found');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">🧠 Climate Risk AI Score</h2>

      <input
        type="text"
        placeholder="Enter City"
        className="border p-3 rounded w-full mb-4 focus:ring-2 focus:ring-green-400 outline-none"
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={handleFetch}
        className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white p-3 rounded w-full font-semibold transition"
      >
        Get Risk Score
      </button>

      {data && (
        <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded shadow-inner">
          <p>📍 <b>{data.city}</b></p>

          <p>🌡 Temperature: <b>{data.temperature}°C</b></p>
          <p>🌫 AQI (PM2.5): <b>{data.aqi}</b></p>

          {data.features && (
            <>
              <p>👥 Population: <b>{data.features[2]}</b></p>
              <p>🏭 Industry Index: <b>{data.features[3]}</b></p>
            </>
          )}

          <p>🔥 Risk Score: <b className="text-red-600 text-lg">{data.risk_score} / 10</b></p>

          {data.tip && (
            <div className="mt-4 bg-green-100 text-green-900 p-4 rounded shadow">
              🌿 <b>AI Climate Tip:</b><br />
              <span className="italic">{data.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskScore;
