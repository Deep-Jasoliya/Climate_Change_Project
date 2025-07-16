import { useState } from 'react';

const CarbonCalculator = () => {
  const [km, setKm] = useState('');
  const [electricity, setElectricity] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const carbon = km * 0.21 + electricity * 0.5;
    setResult(carbon.toFixed(2));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Carbon Footprint Calculator</h2>
      <input placeholder="KM driven/week" className="border p-3 rounded w-full mb-3" onChange={(e) => setKm(e.target.value)} />
      <input placeholder="kWh electricity/week" className="border p-3 rounded w-full mb-3" onChange={(e) => setElectricity(e.target.value)} />
      <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded w-full" onClick={calc}>Calculate</button>
      {result && <p className="mt-4 text-lg">🌿 Estimated CO₂: <b>{result} kg/week</b></p>}
    </div>
  );
};

export default CarbonCalculator;