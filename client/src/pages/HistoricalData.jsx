import { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const HistoricalData = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    lat: '',
    lon: '',
    start: '2000-01-01',
    end: '2020-01-01',
  });

  const fetchData = async () => {
    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
      };

      console.log('Sending to backend:', payload);

      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/climate/history`, { params: payload });
      const d = res.data.daily;

      setData({
        time: d.time,
        maxTemp: d.temperature_2m_max,
        minTemp: d.temperature_2m_min,
        precipitation: d.precipitation_sum,
        tip: res.data.tip,
      });
    } catch (err) {
      console.error('Error fetching NASA data:', err);
      alert('Climate data could not be loaded. Please check your input.');
    }
  };

  const getChartData = (label, values) => ({
    labels: data.time,
    datasets: [
      {
        label,
        data: values,
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📊 Historical Climate Trends</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          placeholder="Latitude"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          className="p-3 border rounded"
        />
        <input
          placeholder="Longitude"
          value={form.lon}
          onChange={(e) => setForm({ ...form, lon: e.target.value })}
          className="p-3 border rounded"
        />
        <input
          type="date"
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
          className="p-3 border rounded"
        />
        <input
          type="date"
          value={form.end}
          onChange={(e) => setForm({ ...form, end: e.target.value })}
          className="p-3 border rounded"
        />
      </div>
      <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700" onClick={fetchData}>
        Fetch Data
      </button>

      {data && (
        <>
          <div className="mt-10 space-y-10">
            <Line data={getChartData('Max Temp (°C)', data.maxTemp)} />
            <Line data={getChartData('Min Temp (°C)', data.minTemp)} />
            <Line data={getChartData('Precipitation (mm)', data.precipitation)} />
          </div>

          {data.tip && (
            <div className="mt-6 bg-green-100 text-green-900 p-4 rounded shadow">
              🌿 <b>AI Climate Tip:</b><br />
              <span className="italic">{data.tip}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoricalData;
