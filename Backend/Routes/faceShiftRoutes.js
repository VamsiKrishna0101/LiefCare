import express from "express";
import { faceClockIn,faceClockOut } from "../Controllers/faceShiftController.js";
import authMiddleware from '../Middlewares/authMiddleware.js';
import roleMiddleware from '../Middlewares/roleMiddleware.js';const router = express.Router();

router.post("/face-clock-in", authMiddleware,roleMiddleware('worker'), faceClockIn);
router.post("/face-clock-out", authMiddleware,roleMiddleware('worker'), faceClockOut);

export default router;
