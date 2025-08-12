import { useState, useEffect } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';

export default function ClockInOut() {
  const [status, setStatus] = useState('Getting location...');
  const [position, setPosition] = useState(null);
  const [note, setNote] = useState('');

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
    if (!position) {
      toast.error('Location not ready yet.');
      return;
    }
    try {
      await API.post('/worker/clockin', { ...position, note });
      toast.success('Clocked in!');
      setNote(''); 
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to clock in');
    }
  };

  const clockOut = async () => {
    if (!position) {
      toast.error('Location not ready yet.');
      return;
    }
    try {
      await API.post('/worker/clockout', { ...position, note });
      toast.success('Clocked out!');
      setNote(''); 
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to clock out');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">{status}</h2>

      {/* Note input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note..."
        className="w-full border rounded p-2 mb-4"
      />

      <div className="flex gap-4">
        <button
          onClick={clockIn}
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Clock In
        </button>
        <button
          onClick={clockOut}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Clock Out
        </button>
      </div>
    </div>
  );
}
