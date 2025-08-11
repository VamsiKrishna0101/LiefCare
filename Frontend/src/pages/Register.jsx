import { useState, useContext } from 'react';
import API from '../api/api.js';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'worker' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      toast.success('User registered successfully!');
      setForm({ name: '', email: '', password: '', role: 'worker' });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white shadow-lg p-6 rounded w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 font-bold">Register</h2>
        <input type="text" placeholder="Name" className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select className="border p-2 w-full mb-4"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="worker">Worker</option>
        </select>

        <button className="bg-green-500 text-white px-4 py-2 rounded w-full cursor-pointer">Register</button>
      </form>  
    </div>
  );
}
