// frontend/src/api/trackingApi.js
import { api } from './axios';

/**
 * Frontend wrapper cho các endpoint tracking
 * Routes (BE):
 *   GET    /habits           → getAllHabits
 *   POST   /habits           → createHabit
 *   PUT    /habits/:habitId  → updateHabit
 *   DELETE /habits/:habitId  → deleteHabit
 *   POST   /track/:habitId   → markHabitComplete
 *   GET    /track            → getTrackingSummary
 *
 * Lưu ý: axios.js đã unwrap response => response.data, nên
 * các call trả về promise với payload đã được unwrap.
 */
export const trackingApi = {
  // Lấy danh sách habits (expected: { status, habits })
  getAllHabits: () => api.get("/habits"),

  // Tạo habit mới (body: { title, description, frequency, ... })
  createHabit: (habitData) => api.post("/habits", habitData),

  // Cập nhật habit theo habitId (body: partial updates)
  updateHabit: (habitId, updates) => api.put(`/habits/${habitId}`, updates),

  // Xoá habit theo habitId
  deleteHabit: (habitId) => api.delete(`/habits/${habitId}`),

  // Đánh dấu hoàn thành habit (track) theo habitId
  markHabitComplete: (habitId) => api.post(`/track/${habitId}`),

  // Lấy summary tracking (expected: { status, summary })
  getTrackingSummary: () => api.get("/track"),
};

export default trackingApi;
