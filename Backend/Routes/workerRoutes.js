import express from 'express';
import { clockIn, clockOut,getLocation } from '../Controllers/workerController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';
import roleMiddleware from '../Middlewares/roleMiddleware.js';
const router = express.Router();

router.post('/clockin', authMiddleware, roleMiddleware('worker'), clockIn);
router.post('/clockout', authMiddleware, roleMiddleware('worker'), clockOut);
router.get('/getlocation', authMiddleware, roleMiddleware('worker'), getLocation);  // Add this line

export default router;
