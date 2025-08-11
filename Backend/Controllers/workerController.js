import Shift from '../Models/Shift.js';
import Location from '../Models/Location.js';

export const clockIn = async (req, res) => {
  try {
    const { lat, lng, note } = req.body;

    const location = await Location.findOne();
    if (!location) {
      return res.status(400).json({ msg: 'Location perimeter not set by manager' });
    }

    const distance = getDistanceKm(lat, lng, location.center.lat, location.center.lng);

    console.log('User location:', lat, lng);
    console.log('Center location:', location.center.lat, location.center.lng);
    console.log('Distance:', distance, 'km');
    console.log('Allowed radius:', location.radiusKm, 'km');

    if (distance > location.radiusKm) {
      return res.status(403).json({ msg: 'Outside allowed perimeter' });
    }

    const shift = new Shift({
      user: req.user.id,
      clockIn: { time: new Date(), location: { lat, lng }, note }
    });

    await shift.save();
    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const clockOut = async (req, res) => {
  try {
    const { lat, lng, note } = req.body;

    const shift = await Shift.findOne({ user: req.user.id, 'clockOut.time': null });
    if (!shift) return res.status(400).json({ msg: 'No active shift' });

    shift.clockOut = { time: new Date(), location: { lat, lng }, note };
    await shift.save();

    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
export const getLocation = async (req, res) => {
  try {
    const location = await Location.findOne();
    if (!location) return res.status(404).json({ msg: 'No location set' });
    res.json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
// Haversine formula for distance in km between two points
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
