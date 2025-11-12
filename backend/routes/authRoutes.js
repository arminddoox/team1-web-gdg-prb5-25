import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', authController.registerUser);

// Login user
router.post('/login', authController.loginUser);

// Logout user
router.post('/logout', authController.logoutUser);

export default router;