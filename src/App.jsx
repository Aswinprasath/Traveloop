import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import EditTrip from './pages/EditTrip';
import Budget from './pages/Budget';
import Packing from './pages/Packing';
import Notes from './pages/Notes';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import SharedItinerary from './pages/SharedItinerary';

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/share/:token" element={<SharedItinerary />} />

      {/* Protected (with sidebar layout) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips" element={
        <ProtectedRoute>
          <Layout><MyTrips /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/new" element={
        <ProtectedRoute>
          <Layout><CreateTrip /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/:id" element={
        <ProtectedRoute>
          <Layout><TripDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/:id/edit" element={
        <ProtectedRoute>
          <Layout><EditTrip /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/:id/budget" element={
        <ProtectedRoute>
          <Layout><Budget /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/:id/packing" element={
        <ProtectedRoute>
          <Layout><Packing /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/trips/:id/notes" element={
        <ProtectedRoute>
          <Layout><Notes /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/explore" element={
        <ProtectedRoute>
          <Layout><Explore /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
