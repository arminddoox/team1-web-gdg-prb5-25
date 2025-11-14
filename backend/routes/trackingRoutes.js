import express from 'express';
import {
    getAllHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    getTrackingSummary,
} from '../controllers/trackingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all tracking routes
router.use(authMiddleware);

// Habit CRUD
router.get('/habits', getAllHabits);          // Fetch all habits
router.post('/habits', createHabit);          // Create a new habit
router.put('/habits/:habitId', updateHabit);       // Update habit
router.delete('/habits/:habitId', deleteHabit);    // Delete habit

// Tracking
router.post('/track/:habitId', markHabitComplete); // Mark habit as complete
router.get('/track', getTrackingSummary);          // Get overall tracking summary

export default router;