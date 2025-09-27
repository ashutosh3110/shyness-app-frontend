import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import TopicSelection from './pages/TopicSelection';
import Scripts from './pages/Scripts';
import VideoUpload from './pages/VideoUpload';
import MyVideos from './pages/MyVideos';
import Payments from './pages/Payments';
import PaymentInfo from './pages/PaymentInfo';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading, token, isAuthenticated } = useAuth();

  // Check if we're on admin routes
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  // Only show user auth context for non-admin routes
  if (!isAdminRoute) {
    console.log('App component - user:', user, 'loading:', loading, 'token:', token, 'isAuthenticated:', isAuthenticated());

    // Show loading spinner while checking authentication
    if (loading) {
      return <LoadingSpinner />;
    }
  }

  // Additional check: if we have a token but no user, we might be in a loading state
  const hasToken = !!localStorage.getItem('token');
  if (hasToken && !user && !loading) {
    console.log('App component - Has token but no user, showing loading');
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={!user ? <Landing /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/forgot-password" 
        element={!user ? <ForgotPassword /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/reset-password" 
        element={!user ? <ResetPassword /> : <Navigate to="/app/dashboard" />} 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin/login" 
        element={<AdminLogin />} 
      />
      <Route 
        path="/admin/dashboard" 
        element={<AdminDashboard />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/app" 
        element={user ? <Layout /> : <Navigate to="/login" />} 
      >
        <Route index element={<Navigate to="/app/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="topics" element={<TopicSelection />} />
        <Route path="scripts" element={<Scripts />} />
        <Route path="upload" element={<VideoUpload />} />
        <Route path="my-videos" element={<MyVideos />} />
        <Route path="payments" element={<Payments />} />
        <Route path="payment-info" element={<PaymentInfo />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Legacy routes for backward compatibility */}
      <Route 
        path="/dashboard" 
        element={user ? <Navigate to="/app/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/topics" 
        element={user ? <Navigate to="/app/topics" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/upload" 
        element={user ? <Navigate to="/app/upload" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/my-videos" 
        element={user ? <Navigate to="/app/my-videos" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/profile" 
        element={user ? <Navigate to="/app/profile" /> : <Navigate to="/login" />} 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/app/dashboard" : "/"} />} 
      />
    </Routes>
  );
}

export default App;
