import * as trackingService from '../services/tracking.service.js';

// Helper to get userId from auth middleware or fallback to testId
const getUserId = (req) => req.user?._id || req.body.userId || 'testUserId';

// Get all habits for a user
export const getAllHabits = async (req, res) => {
  const userId = getUserId(req);
  const habits = await trackingService.getUserHabits(userId);
  res.json({ status: 'success', habits });
};

// Create a new habit
export const createHabit = async (req, res) => {
  const userId = getUserId(req);
  const habit = await trackingService.createHabit(userId, req.body);
  res.json({ status: 'success', habit });
};

// Update a habit
export const updateHabit = async (req, res) => {
  const userId = getUserId(req);
  const habit = await trackingService.updateHabit(userId, req.params.habitId, req.body);
  res.json({ status: 'success', habit });
};

// Delete a habit
export const deleteHabit = async (req, res) => {
  const userId = getUserId(req);
  const result = await trackingService.deleteHabit(userId, req.params.habitId);
  res.json({ status: 'success', ...result });
};

// Mark habit complete today
export const markHabitComplete = async (req, res) => {
  const userId = getUserId(req);
  const habit = await trackingService.markHabitComplete(userId, req.params.habitId);
  res.json({ status: 'success', habit });
};

// Get tracking summary (streaks, completion rate)
export const getTrackingSummary = async (req, res) => {
  const userId = getUserId(req);
  const summary = await trackingService.getTrackingSummary(userId);
  res.json({ status: 'success', summary });
};