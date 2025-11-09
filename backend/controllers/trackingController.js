import {
    getAllHabitsService,
    createHabitService,
    updateHabitService,
    deledeHabitService,
    markHabitCompleteService,
    getTrackingSummaryService
} from "../services/trackingService.js";

// Get all habits for a user
export const getAllHabits = async (req, res) => {
    const userId = req.body.userId || "testUserId"; // placeholder
    const result = await getAllHabitsService(userId);
    res.json(result);
};

// Create a new habit
export const createHabit = async (req, res) => {
    const userId = req.body.userId || "testUserId";
    const result = await createHabitService(userId, req.body);
    res.json(result);
};

// Update a habit
export const updateHabit = async (req, res) => {
    const habitId = req.params.id;
    const result = await updateHabitService(habitId, req.body);
    res.json(result);
};

// Delete a habit
export const deleteHabit = async (req, res) => {
    const habitId = req.params.id;
    const result = await deledeHabitService(habitId);
    res.json(result);
};

// Mark habit complete today
export const markHabitComplete = async (req, res) => {
    const habitId = req.params.id;
    const userId = req.body.userId || "testUserId";
    const result = await markHabitCompleteService(habitId, userId);
    res.json(result);
};

// Get tracking summary (streaks, completion rate)
export const getTrackingSummary = async (req, res) => {
    const userId = req.body.userId || "testUserId";
    const result = await getTrackingSummaryService(userId);
    res.json(result);
};