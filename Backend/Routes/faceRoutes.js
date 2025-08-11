import express from "express";
import { registerFace } from "../Controllers/faceregisterController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";
const router = express.Router();
router.post("/register-face", authMiddleware, registerFace);

export default router;
