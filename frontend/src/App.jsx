import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importing all page components
import AboutUsPage from './pages/AboutUsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/tracking/DashboardPage';
import HabitsPage from './pages/tracking/HabitsPage';
import ProgressPage from './pages/tracking/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// ========== Layout & Providers ==========
// Importing Layout component
import Layout from "./components/Layout"; // layout tổng thể (navbar, sidebar...)
// RouteType Component to handle route protection
const RouteType = ({ type, children }) => {
  const isAuthenticated = true; // this will need to be replaced with actual authentication check

  // Protected Route Component (redirect if not authenticated)
  if (type === "protected" && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Public Route Component (redirect if already authenticated)
  if (type === "public" && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};
// Wrapper component to include Providers and Layout
const ProviderWrap = ({ children, routeType }) => {
  // Sau này có thể thêm các Provider khác vào đây
  return (
    <RouteType type={routeType}>
      <Layout>
        {children}
      </Layout>
    </RouteType>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUsPage />} />

        {/* Public Routes */}
        <Route path="/login" element={
          <ProviderWrap routeType="public">
            <LoginPage />
          </ProviderWrap>
        } />
        <Route path="/register" element={
          <ProviderWrap routeType="public">
            <RegisterPage />
          </ProviderWrap>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProviderWrap routeType="protected">
            <DashboardPage />
          </ProviderWrap>
        } />
        <Route path="/habits" element={
          <ProviderWrap routeType="protected">
            <HabitsPage />
          </ProviderWrap>
        } />
        <Route path="/progress" element={
          <ProviderWrap routeType="protected">
            <ProgressPage />
          </ProviderWrap>
        } />
        <Route path="/settings" element={
          <ProviderWrap routeType="protected">
            <SettingsPage />
          </ProviderWrap>
        } />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}