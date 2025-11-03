import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import AboutUsPage from "./pages/AboutUsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/tracking/DashboardPage";
import HabitsPage from "./pages/tracking/HabitsPage";
import ProgressPage from "./pages/tracking/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Components
import Sidebar from "./components/Sidebar";

// ========== RouteGuard ==========
const RouteGuard = ({ type, children }) => {
  const isAuthenticated = true; // replace later with real auth

  if (type === "protected" && !isAuthenticated)
    return <Navigate to="/login" replace />;
  if (type === "public" && isAuthenticated)
    return <Navigate to="/dashboard" replace />;

  return children;
};

// ========== AppLayout ==========
const AppLayout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

// ========== AppProviders ==========
const AppProviders = ({ children, routeType }) => {
  // sau này có thể thêm AuthProvider, ThemeProvider, QueryClientProvider, ...
  return (
    <RouteGuard type={routeType}>
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUsPage />} />

        {/* Public Routes */}
        <Route path="/login" element={
          <AppProviders routeType="public">
            <LoginPage />
          </AppProviders>
        } />
        <Route path="/register" element={
          <AppProviders routeType="public">
            <RegisterPage />
          </AppProviders>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AppProviders routeType="protected">
            <DashboardPage />
          </AppProviders>
        } />
        <Route path="/habits" element={
          <AppProviders routeType="protected">
            <HabitsPage />
          </AppProviders>
        } />
        <Route path="/progress" element={
          <AppProviders routeType="protected">
            <ProgressPage />
          </AppProviders>
        } />
        <Route path="/settings" element={
          <AppProviders routeType="protected">
            <SettingsPage />
          </AppProviders>
        } />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}