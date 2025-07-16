import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="email" placeholder="Email" className="p-2 border" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="p-2 border" onChange={handleChange} required />
        <button className="bg-green-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;