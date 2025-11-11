import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
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
    <BrowserRouter>
      <Routes>


        <Route path="/" element={
          <HomePage />
        } />
        <Route path="/about" element={
          <AboutUsPage />
        } />

        {/* Public Routes */}
        <Route path="/login" element={<RouteGuard type="public">
          <LoginPage />
        </RouteGuard>} />
        <Route path="/register" element={<RouteGuard type="public">
          <RegisterPage />
        </RouteGuard>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<RouteGuard type="protected">
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </RouteGuard>} />
        <Route path="/habits" element={<RouteGuard type="protected">
          <AppLayout>
            <HabitsPage />
          </AppLayout>
        </RouteGuard>} />
        <Route path="/progress" element={<RouteGuard type="protected">
          <AppLayout>
            <ProgressPage />
          </AppLayout>
        </RouteGuard>} />
        <Route path="/settings" element={<RouteGuard type="protected">
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        </RouteGuard>} />

        {/* 404 Not Found */}
        <Route path="*" element={
          <NotFoundPage />
        } />
      </Routes>
    </BrowserRouter>
  );
}
