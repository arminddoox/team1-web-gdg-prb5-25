// frontend/src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/authApi";
import { api /*, getToken, clearToken*/ } from "../api/axios";
import { useNavigate } from "react-router-dom";

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
 */

// -- internal provider hook
function useProvideAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // current user object
  // const [loading, setLoading] = useState(true); // initial loading (check token)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch profile if token exists
  const loadProfile = useCallback(async () => {
    // setLoading(true);
    // setError(null);
    try {
      // const token = getToken();
      // if (!token) {
      //   setUser(null);
      //   return;
      // }
      // // call your API to get profile (expects /users/profile or similar)
      // // using `api.get('/users/profile')` will auto-unwrap response per axios.js
      // const profile = await api.get("/users/profile");
      // setUser(profile);
    } catch (err) {
      // // token invalid, clear
      // clearToken();
      // setUser(null);
      // if (import.meta.env.DEV) console.error("Failed to fetch profile:", err);
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

//cần đọc lại

      if (data?.user) {
        setUser(data.user);
      } else {
        try {
          const profile = await api.get("/users/profile");
          setUser(profile);
        } catch (err) { /* ignore */ }
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
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
        try {
          const profile = await api.get("/users/profile");
          setUser(profile);
        } catch (err) { /* ignore */ }
      }
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  };

  // logout
  const logout = () => {
    authApi.logout();
    setUser(null);
    setLoading(false);
    // navigate to login (authApi.logout already redirects as safeguard)
    try {
      navigate("/login");
    } catch (err) { /* ignore */ }
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
