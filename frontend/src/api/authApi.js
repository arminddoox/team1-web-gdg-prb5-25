import { api, setToken, clearToken } from "./axios";
//cnay chắc cần đọc lại 
export const authApi = {
  login: async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    // Expect `data.token` and `data.user` per your backend contract
    if (data?.token) {
      setToken(data.token);
    }
    return data; // { user, token } or whatever backend returns
  },

  register: async (userData) => {
    const data = await api.post("/auth/register", userData);
    if (data?.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: () => {
    clearToken();
    window.location.href = "/login";
  },
};
