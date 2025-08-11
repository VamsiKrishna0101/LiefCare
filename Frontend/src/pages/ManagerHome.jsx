import { useState } from 'react';
import API from '../api/api';
import ManagerDashboard from '../components/ManagerDashboard';
import { toast } from 'react-toastify';

export default function ManagerHome() {
  const [form, setForm] = useState({
    name: '',
    lat: '',
    lng: '',
    radiusKm: ''
  });

  const saveLocation = async () => {
    try {
      await API.post('/manager/location', {
        name: form.name,
        center: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        radiusKm: parseFloat(form.radiusKm)
      });
      toast.success('Location set successfully!');
      setForm('')
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to set location');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Set Location Perimeter</h2>
      <input type="text" placeholder="Location Name" className="border p-2 mr-2"
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="text" placeholder="Latitude" className="border p-2 mr-2"
        onChange={(e) => setForm({ ...form, lat: e.target.value })} />
      <input type="text" placeholder="Longitude" className="border p-2 mr-2"
        onChange={(e) => setForm({ ...form, lng: e.target.value })} />
      <input type="text" placeholder="Radius (Km)" className="border p-2 mr-2"
        onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} />
      <button onClick={saveLocation} className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Save</button>

      <hr className="my-6" />

    </div>
  );
}
