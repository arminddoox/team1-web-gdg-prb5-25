import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import pages (these will need to be created)
import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';
// import HabitsPage from './pages/HabitsPage';
// import RoutinesPage from './pages/RoutinesPage';
// import ProfilePage from './pages/ProfilePage';
// import NotFoundPage from './pages/NotFoundPage';

// Temporary placeholder components
// const HomePage = () => <h1>Home Page</h1>;
const LoginPage = () => <h1>Login Page</h1>;
const RegisterPage = () => <h1>Register Page</h1>;
const DashboardPage = () => <h1>Dashboard</h1>;
const HabitsPage = () => <h1>Habits</h1>;
const RoutinesPage = () => <h1>Routines</h1>;
const ProfilePage = () => <h1>Profile</h1>;
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
        <Route path="/" element={<HomePage />} />

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
        <Route path="/routines" element={<ProtectedRoute>
          <RoutinesPage />
        </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;