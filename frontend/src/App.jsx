import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import pages (these will need to be created)
// import AboutUsPage from './pages/AboutUsPage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import DashboardPage from './pages/tracking/DashboardPage';
// import HabitsPage from './pages/tracking/HabitsPage';
// import ProgressPage from './pages/tracking/ProgressPage';
// import SettingsPage from './pages/SettingsPage';
// import NotFoundPage from './pages/NotFoundPage';

// Temporary placeholder components
const AboutUsPage = () => <h1>About Us</h1>;
const LoginPage = () => <h1>Login Page</h1>;
const RegisterPage = () => <h1>Register Page</h1>;
const DashboardPage = () => <h1>Dashboard</h1>;
const HabitsPage = () => <h1>Habits</h1>;
const ProgressPage = () => <h1>Progress</h1>;
const SettingsPage = () => <h1>Settings</h1>;
const NotFoundPage = () => <h1>404 - Page Not Found</h1>;

// Protected Route Component (redirect if not authenticated)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // mock authentication status
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = false; // mock authentication status
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUsPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute>
          <LoginPage />
        </PublicRoute>} />
        <Route path="/register" element={<PublicRoute>
          <RegisterPage />
        </PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute>
          <HabitsPage />
        </ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute>
          <ProgressPage />
        </ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;