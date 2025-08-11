import ClockInOut from '../components/ClockInOut';
import AutoClock from '../components/AutoClock';
import FaceClockInOut from '../components/FaceClockInOut';
export default function WorkerHome() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">Worker Clock In / Out</h2>
      {/* Manual Clock In/Out buttons */}
      <ClockInOut />
      
      {/* Automatic Clock In/Out based on location */}
      <AutoClock />
      <FaceClockInOut/>
    </div>
  );
}
