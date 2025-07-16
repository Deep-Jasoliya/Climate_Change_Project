import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarbonCalculator from './pages/CarbonCalculator';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import HistoricalData from './pages/HistoricalData';
import RiskScore from './pages/RiskScore';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/carbon" element={<CarbonCalculator />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<HistoricalData />} />
        <Route path="/risk" element={<RiskScore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;