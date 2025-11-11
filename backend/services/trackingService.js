// Placeholder functions for Tracking Module

// Get all habits for a user
export const getAllHabitsService = async (userId) => {
    return { message: "getAllHabitsService - placeholder", userId, habits: [] };
};

// Create a new habit
export const createHabitService = async (userId, habitData) => {
    return { message: "createHabitService - habit created (placeholder)", habit: habitData };
};

//Update a habit
export const updateHabitService = async (habitId, habitData) => {
    return { message: "updateHabitService - habit updated (placeholder)", habitId, habit: habitData };
};

// Delete a habit
export const deledeHabitService = async (habitId) => {
    return { message: "deleteHabitService - habit deleted (placeholder)", habitId };
};

// Mark habit complete for today
export const markHabitCompleteService = async (habitId, userId) => {
    return { message: "markHabitCompleteService - placeholder", habitId, userId };
};

// Get tracking summary (streaks, completion rate)
export const getTrackingSummaryService = async (userId) => {
    return {
        message: "getTrackingSummaryService - placeholder",
        userId,
        summary: {
            totalHabits: 0,
            activeStreaks: 0,
            completionRate: 0,
        },
    };
};