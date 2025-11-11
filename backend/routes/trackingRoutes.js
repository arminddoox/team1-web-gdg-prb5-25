import express from "express";
import {
    getAllHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    getTrackingSummary,
} from "../controllers/trackingController.js";

const router = express.Router();

// Habit CRUD
router.get("/habits", getAllHabits);
router.post("/habits", createHabit);
router.put("/habits/:id", updateHabit);
router.delete("/habits/:id", deleteHabit);

// Tracking
router.post("/track/:habitId", markHabitComplete);
router.get("/track", getTrackingSummary);

export default router;