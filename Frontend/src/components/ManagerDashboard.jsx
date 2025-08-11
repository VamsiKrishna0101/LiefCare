import { useEffect, useState } from 'react';
import API from '../api/api';

export default function ManagerDashboard() {
  const [dailyStats, setDailyStats] = useState([]);
  const [staffTotals, setStaffTotals] = useState([]);
  const [staffShifts, setStaffShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/manager/dashboard')
      .then(res => {
        setDailyStats(res.data.dailyStats);
        setStaffTotals(res.data.staffTotals);
        setStaffShifts(res.data.staffShifts);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="p-4 space-y-10">
      <h2 className="text-2xl font-bold mb-6">Manager Dashboard</h2>

      {/* Summary Stats */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Daily Stats (Last 7 Days)</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Avg Hours Worked</th>
              <th className="border p-2">Number of Clock-Ins</th>
            </tr>
          </thead>
          <tbody>
            {dailyStats.map(day => (
              <tr key={day.date}>
                <td className="border p-2">{new Date(day.date).toLocaleDateString()}</td>
                <td className="border p-2">{day.avgHours.toFixed(2)}</td>
                <td className="border p-2">{day.numClockedIn}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mb-2">Total Hours per Staff (Last 7 Days)</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Staff Name</th>
              <th className="border p-2">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {staffTotals.map(staff => (
              <tr key={staff.name}>
                <td className="border p-2">{staff.name}</td>
                <td className="border p-2">{staff.totalHours.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Staff Detailed Shifts */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Staff Clock-In/Out Details</h3>
        {staffShifts.map(staff => (
          <div key={staff.id} className="mb-6 border p-4 rounded shadow">
            <h4 className="text-lg font-bold mb-2">{staff.name}</h4>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Clock In Time</th>
                  <th className="border p-2">Clock In Location (Lat,Lng)</th>
                  <th className="border p-2">Clock Out Time</th>
                  <th className="border p-2">Clock Out Location (Lat,Lng)</th>
                </tr>
              </thead>
              <tbody>
                {staff.shifts.map((shift, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">
                      {shift.clockIn?.time ? new Date(shift.clockIn.time).toLocaleString() : 'N/A'}
                    </td>
                    <td className="border p-2">
                      {shift.clockIn?.location?.lat && shift.clockIn?.location?.lng
                        ? `${shift.clockIn.location.lat.toFixed(5)}, ${shift.clockIn.location.lng.toFixed(5)}`
                        : 'N/A'}
                    </td>
                    <td className="border p-2">
                      {shift.clockOut?.time ? new Date(shift.clockOut.time).toLocaleString() : 'N/A'}
                    </td>
                    <td className="border p-2">
                      {shift.clockOut?.location?.lat && shift.clockOut?.location?.lng
                        ? `${shift.clockOut.location.lat.toFixed(5)}, ${shift.clockOut.location.lng.toFixed(5)}`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
}
