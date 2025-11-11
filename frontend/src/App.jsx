// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

/* ===== NOTE =====
  For now we keep a top-level flag so both RouteGuard and the root redirect can read it.
  Replace with your real auth check (context/hook) later.
*/
const isAuthenticated = true; // TODO: replace with real auth logic

// ========== RouteGuard ==========
const RouteGuard = ({ type, children }) => {
  const isAuthenticated = true; // TODO: replace with real auth logic

  if (type === "protected" && !isAuthenticated) {
    // return <Navigate to="/login" replace />;
  }
  if (type === "public" && isAuthenticated) {
    // return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ========== AppLayout ==========
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main>{children}</main>
  </div>
);

// ========== App ==========
export default function App() {
  return (
    
      <Routes>
        {/* Root: redirect depending on auth */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
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
