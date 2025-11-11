// Placeholder functions for Tracking Module

// Get all habits for a user
export const getAllHabitsService = async (userId) => {
    return [
        { id: 'h1', title: 'Drink Water', completed: true },
        { id: 'h2', title: 'Read 10 pages', completed: false }
    ];
};

// Create a new habit
export const createHabitService = async (userId, habitData) => {
    return { id: 'h3', ...habitData, createdAt: new Date() };
};

//Update a habit
export const updateHabitService = async (habitId, updates) => {
    return { id: habitId, ...updates, updatedAt: new Date() };
};

// Delete a habit
export const deledeHabitService = async (habitId) => {
    return { message: `Habit ${habitId} deleted.` };
};

// Mark habit complete for today
export const markHabitCompleteService = async (habitId) => {
    return { id: habitId, completed: true, date: new Date() };
};

// Get tracking summary (streaks, completion rate)
export const getTrackingSummaryService = async (userId) => {
    return {
        totalHabits: 0,
        activeStreaks: 0,
        completionRate: 0,
        lastUpdated: new Date(),
    };
};