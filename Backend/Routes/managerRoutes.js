import express from 'express';
import { setLocation, getDashboard} from '../Controllers/managerController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';
import roleMiddleware from '../Middlewares/roleMiddleware.js';
const router = express.Router();

router.post('/location', authMiddleware, roleMiddleware('manager'), setLocation);
router.get('/dashboard', authMiddleware, roleMiddleware('manager'), getDashboard);


export default router;
