import { safeNavigate, api, setToken, clearToken } from "./axios";

/**
 * Giúp decode payload từ JWT (không cần dependency).
 * Trả về object payload hoặc null nếu decode fail.
 */
function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    // fix padding for atob (URL-safe base64 -> standard base64)
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

/**
 * Lấy userId từ token nếu có
 */
function getUserIdFromToken(token) {
  const payload = decodeJwtPayload(token);
  return payload?.id ?? null;
}

export const authApi = {
  login: async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    // Expect `data.token` and `data.user` per your backend contract
    if (data?.token) {
      setToken(data.token);
    }

    safeNavigate("/");
    return data; // { user, token } or whatever backend returns
  },

  register: async (userData) => {
    const data = await api.post("/auth/register", userData);
    if (data?.token) {
      setToken(data.token);
    }

    safeNavigate("/login");

    return data;
  },

  /**
   * Logout:
   * - Gọi API /auth/logout với { userId } để BE có thể cập nhật lastLogout/blacklist nếu cần
   * - Nếu không truyền userId, cố gắng lấy từ token lưu trên client
   * - Dù API trả lỗi hay không, vẫn xóa token ở client và redirect tới /login
   */
  logout: async (userId = null) => {
    try {
      // Try infer userId from token if not provided
      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) userId = getUserIdFromToken(token);
      }

      // Gọi API logout (BE: authController.logoutUser expects userId in body or null)
      // Nếu BE là stateless JWT (không cần logout server-side), API có thể chỉ cập nhật lastLogout.
      try {
        await api.post("/auth/logout", { userId });
      } catch (apiError) {
        // Không block logout client vì server có thể không cần xử lý (stateless)
        // Log để dev debug; caller vẫn sẽ bị redirect
        console.warn("Server logout failed or returned error:", apiError?.response?.data ?? apiError.message);
      }

      // Xóa token trên client và redirect
      clearToken();
      safeNavigate("/login");

      // Optionally return something for caller
      return { status: "ok" };
    } catch (error) {
      // Even if unexpected error, still clear token and redirect to avoid stuck state
      clearToken();
      safeNavigate("/login");
      throw error;
    }
  },
};
