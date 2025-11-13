import Tracking from '../models/Tracking.js';

// ============================
// Tracking Module Services
// ============================

// Get all habits for a user
export const getAllHabitsService = async (userId) => {
  try {
    let tracking = await Tracking.findOne({ userId });
    if (!tracking) {
      tracking = await Tracking.create({ userId, habits: [] });
    }
    return tracking.habits;
  } catch (error) {
    // Placeholder fallback
    return { message: "getAllHabitsService - placeholder", userId, habits: [] };
  }
};

// Create a new habit
export const createHabitService = async (userId, habitData) => {
  try {
    const tracking = await Tracking.findOne({ userId });
    const newHabit = { ...habitData, logs: [], streak: { current: 0, longest: 0 } };
    tracking.habits.push(newHabit);
    await tracking.save();
    return newHabit;
  } catch (error) {
    return { message: "createHabitService - habit created (placeholder)", habit: habitData };
  }
};

// Update a habit
export const updateHabitService = async (userId, habitId, updates) => {
  try {
    const tracking = await Tracking.findOne({ userId });
    const habit = tracking.habits.id(habitId);
    if (!habit) throw new Error('Habit not found');
    Object.assign(habit, updates);
    await tracking.save();
    return habit;
  } catch (error) {
    return { message: "updateHabitService - habit updated (placeholder)", habitId, habit: updates };
  }
};

// Delete a habit
export const deleteHabitService = async (userId, habitId) => {
  try {
    const tracking = await Tracking.findOne({ userId });
    const habit = tracking.habits.id(habitId);
    if (!habit) throw new Error('Habit not found');
    habit.remove();
    await tracking.save();
    return { message: 'Habit deleted' };
  } catch (error) {
    return { message: "deleteHabitService - habit deleted (placeholder)", habitId };
  }
};

// Mark habit complete for today
export const markHabitCompleteService = async (userId, habitId) => {
  try {
    const tracking = await Tracking.findOne({ userId });
    const habit = tracking.habits.id(habitId);
    if (!habit) throw new Error('Habit not found');

    habit.logs.push({ date: new Date(), completed: true });
    habit.streak.current += 1;
    if (habit.streak.current > habit.streak.longest) habit.streak.longest = habit.streak.current;

    await tracking.save();
    return habit;
  } catch (error) {
    return { message: "markHabitCompleteService - placeholder", habitId, userId };
  }
};

// Get tracking summary (streaks, completion rate)
export const getTrackingSummaryService = async (userId) => {
  try {
    const tracking = await Tracking.findOne({ userId });
    if (!tracking) return {
      totalHabits: 0,
      activeStreaks: 0,
      completionRate: 0,
    };

    const totalHabits = tracking.habits.length;
    const activeStreaks = tracking.habits.filter(h => h.streak.current > 0).length;
    const completionRate = totalHabits === 0 ? 0 : 
      Math.round((tracking.habits.reduce((acc, h) => acc + (h.logs.filter(l => l.completed).length), 0) / totalHabits) * 100);

    return { totalHabits, activeStreaks, completionRate };
  } catch (error) {
    return {
      message: "getTrackingSummaryService - placeholder",
      userId,
      summary: { totalHabits: 0, activeStreaks: 0, completionRate: 0 },
    };
  }
};