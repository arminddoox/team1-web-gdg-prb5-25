import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Logout user
router.post('/logout', authController.logoutUser); // Assuming logoutUser exists in authController

export default router;