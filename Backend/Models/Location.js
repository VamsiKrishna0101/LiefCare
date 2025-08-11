import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: String,
  center: { lat: Number, lng: Number },
  radiusKm: Number
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
