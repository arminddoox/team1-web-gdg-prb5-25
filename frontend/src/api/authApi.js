import { safeNavigate, api /*, setToken, clearToken */ } from "./axios";

export const authApi = {
  login: async (credentials) => {
    const data = await api.post("/auth/login", credentials);
    // Expect `data.token` and `data.user` per your backend contract
    // if (data?.token) {
    //   setToken(data.token);
    // }

    safeNavigate("/");

    return data; // { user, token } or whatever backend returns
  },

  register: async (userData) => {
    const data = await api.post("/auth/register", userData);
    // if (data?.token) {
    //   setToken(data.token);
    // }

    safeNavigate("/login");

    return data;
  },

  logout: () => {
    // clearToken();
    safeNavigate("/login");
  },
};
