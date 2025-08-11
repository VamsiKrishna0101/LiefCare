import { useState, useEffect } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';

export default function ClockInOut() {
  const [status, setStatus] = useState('Getting location...');
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        setStatus('Location ready');
      },
      () => setStatus('Error getting location'),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const clockIn = async () => {
    try {
      await API.post('/worker/clockin', { ...position, note: "Starting shift" });
      toast.success('Clocked in!');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to clock in');
    }
  };

  const clockOut = async () => {
    try {
      await API.post('/worker/clockout', { ...position, note: "Ending shift" });
      toast.success('Clocked out!');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to clock out');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">{status}</h2>
      <div className="flex gap-4">
        <button onClick={clockIn} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Clock In</button>
        <button onClick={clockOut} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Clock Out</button>
      </div>
    </div>
  );
}
