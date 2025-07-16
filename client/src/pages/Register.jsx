import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/register`, form);
      toast.success('Registered successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Full Name" className="p-2 border" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="p-2 border" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="p-2 border" onChange={handleChange} required />
        <button className="bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;