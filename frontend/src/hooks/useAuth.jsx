// frontend/src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/authApi";
import { getToken, clearToken } from "../api/axios";

/**
 * AuthContext + Provider + useAuth hook
 *
 * Usage:
 *  - Wrap your App (or Routes) with <AuthProvider> in main.jsx (optional)
 *  - call const auth = useAuth(); then auth.login(...) / auth.register(...) / auth.logout()
 *
 * This hook:
 *  - loads profile on mount if token exists
 *  - provides user, loading, error and auth methods
 *
 * Hoạt động tốt dù BE chưa có /users/profile
 */

// 👉 Hàm decode payload từ JWT
function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

// -- internal provider hook
function useProvideAuth() {
  const [user, setUser] = useState(null); // current user object
  const [loading, setLoading] = useState(true); // initial loading (check token)
  const [error, setError] = useState(null);

  /**
   * ✅ loadProfile:
   * Nếu có token -> decode để lấy userId.
   * Nếu BE chưa có /users/profile thì vẫn giữ login state dựa vào token.
   */
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        return;
      }

      // // nếu BE có /users/profile -> bạn có thể bật lại dòng dưới
      // const profile = await api.get("/users/profile");
      // setUser(profile);

      // decode token để lấy id (tạm thời thay cho /profile)
      const decoded = decodeJwtPayload(token);
      if (decoded?.id) {
        setUser({ _id: decoded.id });
      } else {
        // token hỏng
        clearToken();
        setUser(null);
      }
    } catch (error) {
      clearToken();
      setUser(null);
      if (import.meta.env.DEV) 
        console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // login action
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      // authApi stores token already via setToken
      // server may return { user, token } or { token, user: {...} }

      if (data?.user) {
        setUser(data.user);
      } else {
        // try {
        //   const profile = await api.get("/users/profile");
        //   setUser(profile);
        // } catch (error) { /* ignore */ }
        const token = getToken();
        const decoded = decodeJwtPayload(token);
        if (decoded?.id) setUser({ _id: decoded.id });
      }
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error);
      throw error;
    }
  };

  // register action
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(userData);
      if (data?.user) {
        setUser(data.user);
      } else {
        // try {
        //   const profile = await api.get("/users/profile");
        //   setUser(profile);
        // } catch (error) { /* ignore */ }
        const token = getToken();
        const decoded = decodeJwtPayload(token);
        if (decoded?.id) setUser({ _id: decoded.id });
      }
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error);
      throw error;
    }
  };

  // logout
  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout(); // await so server revoke can run if implemented
    } catch (error) {
      if (import.meta.env.DEV) console.warn("logout error:", error);
    } finally {
      clearToken();
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    reload: loadProfile,
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
