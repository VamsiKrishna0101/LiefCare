import { useState, useContext } from 'react';
import API from '../api/api.js';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data);
      toast.success('Logged in successfully!');

      // Redirect based on user role
      if (res.data.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (res.data.user.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white shadow-lg p-6 rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
}
