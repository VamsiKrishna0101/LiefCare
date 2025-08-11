import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['manager', 'worker'], default: 'worker' },
  auth0Id: String,
  faceDescriptor: { type: [Number], default: null },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
