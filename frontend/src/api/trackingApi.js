// frontend/src/api/trackingApi.js
import { api } from './axios';

/**
 * Frontend wrapper cho các endpoint tracking
 * Routes (BE):
 *   GET    /habits           → getAllHabits
 *   POST   /habits           → createHabit
 *   PUT    /habits/:id       → updateHabit
 *   DELETE /habits/:id       → deleteHabit
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

  // Cập nhật habit theo id (body: partial updates)
  updateHabit: (id, updates) => api.put(`/habits/${id}`, updates),

  // Xoá habit theo id
  deleteHabit: (id) => api.delete(`/habits/${id}`),

  // Đánh dấu hoàn thành habit (track) theo habitId
  markHabitComplete: (habitId) => api.post(`/track/${habitId}`),

  // Lấy summary tracking (expected: { status, summary })
  getTrackingSummary: () => api.get("/track"),
};

export default trackingApi;
