import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';

// Routes
import authRoutes from './Routes/authRoutes.js'
import workerRoutes from './Routes/workerRoutes.js'
import managerRoutes from './Routes/managerRoutes.js'
import faceShiftRoutes from './Routes/faceShiftRoutes.js'
import faceRoutes from './Routes/faceRoutes.js'
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/", faceShiftRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/worker', workerRoutes);
app.use("/api/face", faceRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
