import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle login
  const handleLogin = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', status);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Check authentication status on load
  useEffect(() => {
    const storedAuthState = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuthState);
    setIsLoading(false);
  }, []);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Dynamic navbar visibility logic
  const location = useLocation();
  const hideNavbarRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password/:token',
  ];
  const shouldHideNavbar = hideNavbarRoutes.some(route =>
    new RegExp(`^${route.replace(':token', '[^/]+')}$`).test(location.pathname)
  );

  return (
    <div>
      {!shouldHideNavbar && <Navbar onLogout={handleLogout} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
