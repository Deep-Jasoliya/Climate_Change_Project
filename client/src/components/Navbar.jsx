import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; 

; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center text-white">
        <h1 className="font-bold text-2xl tracking-wide flex items-center gap-2">
          🌎 <span className="hidden sm:inline">ClimateWise</span>
        </h1>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Link to="/" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">Dashboard</Link>
          <Link to="/carbon" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">Carbon</Link>
          <Link to="/history" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">History</Link>
          <Link to="/risk" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">Risk Score</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/register" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">Register</Link>
              <Link to="/login" className=" text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-green-500 transition duration-200">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold shadow hover:bg-red-200 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
