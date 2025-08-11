import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clockIn: { time: Date, location: { lat: Number, lng: Number }, note: String },
  clockOut: { time: Date, location: { lat: Number, lng: Number }, note: String },
}, { timestamps: true });

export default mongoose.model('Shift', shiftSchema);
