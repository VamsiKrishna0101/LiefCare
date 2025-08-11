import { useState, useEffect, useRef } from 'react';
import API from '../api/api'; // your axios instance or fetch wrapper
import { toast } from 'react-toastify';

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function AutoClock() {
  const [status, setStatus] = useState('Waiting for location...');
  const [perimeter, setPerimeter] = useState(null); // { center: {lat, lng}, radiusKm }
  const [position, setPosition] = useState(null);
  const insidePerimeterRef = useRef(false); // track last known inside/outside state

  useEffect(() => {
    // Fetch perimeter location from backend on mount
    API.get('/worker/getlocation')
      .then(res => {
        setPerimeter(res.data);
        setStatus('Perimeter loaded');
      })
      .catch(() => setStatus('Failed to load perimeter'));
  }, []);

  useEffect(() => {
    if (!perimeter) return;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);

        const dist = getDistanceKm(
          coords.lat,
          coords.lng,
          perimeter.center.lat,
          perimeter.center.lng
        );

        if (dist <= perimeter.radiusKm) {
          setStatus('Inside perimeter');
          if (!insidePerimeterRef.current) {
            // User just entered perimeter
            insidePerimeterRef.current = true;
            toast.info('You are inside perimeter, please clock in!');
            // Optionally, auto clock-in here:
            // autoClockIn(coords);
          }
        } else {
          setStatus('Outside perimeter');
          if (insidePerimeterRef.current) {
            // User just left perimeter
            insidePerimeterRef.current = false;
            toast.info('You left the perimeter, please clock out!');
            // Optionally, auto clock-out here:
            // autoClockOut(coords);
          }
        }
      },
      err => {
        setStatus('Error getting location');
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [perimeter]);

  // Optional: define autoClockIn and autoClockOut if you want to trigger API calls automatically
  
  const autoClockIn = async (coords) => {
    try {
      await API.post('/worker/clockin', { ...coords, note: 'Auto clock in' });
      toast.success('Auto clocked in!');
    } catch {
      toast.error('Auto clock in failed');
    }
  };

  const autoClockOut = async (coords) => {
    try {
      await API.post('/worker/clockout', { ...coords, note: 'Auto clock out' });
      toast.success('Auto clocked out!');
    } catch {
      toast.error('Auto clock out failed');
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Automatic Clock In/Out Based on Location</h2>
      <p><strong>Current Position:</strong> {position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : status}</p>
      <p><strong>Perimeter:</strong> {perimeter ? `${perimeter.name} (Radius: ${perimeter.radiusKm} km)` : 'Loading perimeter...'}</p>
    </div>
  );
}
