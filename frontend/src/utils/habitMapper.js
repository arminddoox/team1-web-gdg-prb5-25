// frontend/src/utils/habitMapper.js

/**
 * Maps backend habit model to frontend habit model
 * Backend: { _id, title, description, frequency, logs: [{date, completed}], streak: {current, longest}, ... }
 * Frontend: { id, name, description, status, streak, history: [ISO strings], emoji }
 */
export function backendToFrontend(backendHabit) {
  if (!backendHabit) return null;

  const { _id, title, description, logs = [], streak = {}, createdAt } = backendHabit;
  
  // Extract completed dates from logs
  const history = logs
    .filter(log => log.completed)
    .map(log => new Date(log.date).toISOString())
    .sort();

  // Calculate status based on streak and last activity
  const currentStreak = streak.current || 0;
  let status = "No activity yet";
  
  if (currentStreak > 0) {
    status = `${currentStreak}-day streak`;
  } else if (history.length > 0) {
    const lastDate = new Date(history[history.length - 1]);
    const today = new Date();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      status = "Missed yesterday";
    } else if (diffDays > 1) {
      status = `Haven't done in ${diffDays} days`;
    }
  }

  return {
    id: _id,
    name: title || "Untitled Habit",
    description: description || "",
    status,
    streak: currentStreak,
    history,
    emoji: "🎯", // Default emoji, you can enhance this
    createdAt,
  };
}

/**
 * Maps frontend habit data to backend format for creation/update
 * Frontend: { name, description, emoji }
 * Backend: { title, description, frequency }
 */
export function frontendToBackend(frontendHabit) {
  return {
    title: frontendHabit.name || frontendHabit.title || "Untitled",
    description: frontendHabit.description || "",
    frequency: frontendHabit.frequency || "daily", // Default frequency
  };
}

/**
 * Maps array of backend habits to frontend format
 */
export function mapHabitsToFrontend(backendHabits = []) {
  return backendHabits.map(backendToFrontend).filter(Boolean);
}

/**
 * Maps backend summary to frontend format
 */
export function mapSummaryToFrontend(backendSummary) {
  if (!backendSummary) {
    return {
      totalHabits: 0,
      activeStreaks: 0,
      completionRate: 0,
    };
  }

  return {
    totalHabits: backendSummary.totalHabits || 0,
    activeStreaks: backendSummary.activeStreaks || 0,
    completionRate: backendSummary.completionRate || 0,
  };
}