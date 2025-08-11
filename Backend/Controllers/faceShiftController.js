import Shift from "../Models/Shift.js";
import User from "../Models/User.js";
import { isMatch } from "../utils/faceUtil.js";
import { haversineDistanceKm } from "../utils/geolocation.js";
const PERIMETER_LAT = parseFloat(process.env.PERIMETER_CENTER_LAT);
const PERIMETER_LNG = parseFloat(process.env.PERIMETER_CENTER_LNG);
const PERIMETER_RADIUS = parseFloat(process.env.PERIMETER_RADIUS_KM);

export const faceClockIn = async (req, res) => {
  try {
    const { descriptor, lat, lng, note } = req.body;

    const dist = haversineDistanceKm(lat, lng, PERIMETER_LAT, PERIMETER_LNG);
    if (dist > PERIMETER_RADIUS) {
      return res.status(400).json({ message: "Outside allowed perimeter" });
    }

    const user = await User.findById(req.user.id);
    if (!user.faceDescriptor) {
      return res.status(400).json({ message: "No face registered" });
    }

    const { match } = isMatch(user.faceDescriptor, descriptor);
    if (!match) {
      return res.status(400).json({ message: "Face does not match" });
    }

    const shift = await Shift.create({
      user: req.user.id,
      clockInTime: new Date(),
      clockInLat: lat,
      clockInLng: lng,
      clockInNote: note || ""
    });

    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const faceClockOut = async (req, res) => {
  try {
    const { descriptor, lat, lng, note } = req.body;

    const dist = haversineDistanceKm(lat, lng, PERIMETER_LAT, PERIMETER_LNG);
    if (dist > PERIMETER_RADIUS) {
      return res.status(400).json({ message: "Outside allowed perimeter" });
    }

    const user = await User.findById(req.user.id);
    if (!user.faceDescriptor) {
      return res.status(400).json({ message: "No face registered" });
    }

    const { match } = isMatch(user.faceDescriptor, descriptor);
    if (!match) {
      return res.status(400).json({ message: "Face does not match" });
    }

    const shift = await Shift.findOneAndUpdate(
      { user: req.user.id, clockOutTime: null },
      {
        clockOutTime: new Date(),
        clockOutLat: lat,
        clockOutLng: lng,
        clockOutNote: note || ""
      },
      { new: true }
    );

    if (!shift) {
      return res.status(400).json({ message: "No active shift found" });
    }

    res.json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
