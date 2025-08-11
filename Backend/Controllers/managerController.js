import Shift from '../Models/Shift.js';
import Location from '../Models/Location.js';

// Helper: format date to YYYY-MM-DD string
const getDateStr = (date) => date.toISOString().slice(0, 10);

export const setLocation = async (req, res) => {
  const { name, center, radiusKm } = req.body;
  const location = await Location.findOneAndUpdate(
    {},
    { name, center, radiusKm },
    { upsert: true, new: true }
  );
  res.json(location);
};



export const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // last 7 days including today

    // Fetch all shifts with user populated
    const shifts = await Shift.find({ 'clockIn.time': { $exists: true } })
      .populate('user')
      .lean();

    // Data structures for stats
    const dailyData = {};
    const staffTotals = {};
    const staffShiftsMap = {}; // { staffId: { name, shifts } }

    // Initialize dailyData for last 7 days
    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);
      const dayStr = getDateStr(day);
      dailyData[dayStr] = { totalHours: 0, count: 0, uniqueUsers: new Set() };
    }

    for (const shift of shifts) {
      const userId = shift.user._id.toString();

      // Flatten clockIn and clockOut location for frontend
      const clockInFlattened = shift.clockIn
        ? {
            time: shift.clockIn.time,
            lat: shift.clockIn.location.lat,
            lng: shift.clockIn.location.lng,
            note: shift.clockIn.note,
          }
        : null;

      const clockOutFlattened = shift.clockOut
        ? {
            time: shift.clockOut.time,
            lat: shift.clockOut.location.lat,
            lng: shift.clockOut.location.lng,
            note: shift.clockOut.note,
          }
        : null;

      // Group shifts by staff for detailed table
      if (!staffShiftsMap[userId]) staffShiftsMap[userId] = { name: shift.user.name, shifts: [] };
      staffShiftsMap[userId].shifts.push({
        clockIn: clockInFlattened,
        clockOut: clockOutFlattened,
      });

      // Update stats for last 7 days if within date range and clockOut exists
      if (
        clockInFlattened?.time &&
        clockOutFlattened?.time &&
        clockInFlattened.time >= sevenDaysAgo
      ) {
        const dayStr = getDateStr(clockInFlattened.time);
        const hours = (clockOutFlattened.time - clockInFlattened.time) / (1000 * 60 * 60);

        dailyData[dayStr].totalHours += hours;
        dailyData[dayStr].count += 1;
        dailyData[dayStr].uniqueUsers.add(userId);

        staffTotals[shift.user.name] = (staffTotals[shift.user.name] || 0) + hours;
      }
    }

    // Format daily stats
    const dailyStats = Object.entries(dailyData).map(([date, data]) => ({
      date,
      avgHours: data.count ? data.totalHours / data.count : 0,
      numClockedIn: data.uniqueUsers.size,
    }));

    // Format staff total hours array
    const staffTotalsArr = Object.entries(staffTotals).map(([name, totalHours]) => ({
      name,
      totalHours,
    }));

    // Format staff shifts array
    const staffShiftsArr = Object.entries(staffShiftsMap).map(([id, val]) => ({
      id,
      name: val.name,
      shifts: val.shifts,
    }));

    res.json({
      dailyStats,
      staffTotals: staffTotalsArr,
      staffShifts: staffShiftsArr,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
