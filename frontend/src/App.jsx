// frontend/src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { registerNavigate } from './api/axios';

// Pages
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/tracking/DashboardPage";
import HabitsPage from "./pages/tracking/HabitsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import Sidebar from "./components/Sidebar";

// Hooks
import useAuth from './hooks/useAuth';

// ========== RouteGuard ==========
const RouteGuard = ({ type, children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; 
  const authenticated = !!user;

  if (type === "public" && authenticated) {
    return <Navigate to="/home" replace />;
  }
  if (type === "protected" && !authenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ========== AppLayout ==========
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <main>{children}</main>
  </div>
);

// ========== App ==========
export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return (
    
      <Routes>
        {/* Root: redirect depending on auth */}
        <Route
          path="/"
          element={
            <RouteGuard type="protected">
              <Navigate to="/home" replace />
            </RouteGuard>
          }
        />

        {/* Public / informational */}
        <Route path="/about" element={<AboutUsPage />} />

        {/* Public Routes (auth pages) */}
        <Route
          path="/login"
          element={
            <RouteGuard type="public">
              <LoginPage />
            </RouteGuard>
          }
        />
        <Route
          path="/register"
          element={
            <RouteGuard type="public">
              <RegisterPage />
            </RouteGuard>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <RouteGuard type="protected">
              <HomePage />
            </RouteGuard>
          }
        />


        <Route
          path="/dashboard"
          element={
            <RouteGuard type="protected">
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </RouteGuard>
          }
        />

        <Route
          path="/habits"
          element={
            <RouteGuard type="protected">
              <AppLayout>
                <HabitsPage />
              </AppLayout>
            </RouteGuard>
          }
        />

        <Route
          path="/settings"
          element={
            <RouteGuard type="protected">
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </RouteGuard>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}
