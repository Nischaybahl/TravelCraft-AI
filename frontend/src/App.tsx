import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TripProvider } from '@/contexts/TripContext';
import { ToastProvider } from '@/components/common/Toast';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CreateTripPage from '@/pages/CreateTripPage';
import RecommendationsPage from '@/pages/RecommendationsPage';
import ItineraryPage from '@/pages/ItineraryPage';
import MyTripsPage from '@/pages/MyTripsPage';
import TripDetailsPage from '@/pages/TripDetailsPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/create-trip"
        element={<ProtectedRoute><MainLayout><CreateTripPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/recommendations"
        element={<ProtectedRoute><MainLayout><RecommendationsPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/itinerary"
        element={<ProtectedRoute><MainLayout><ItineraryPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/my-trips"
        element={<ProtectedRoute><MainLayout><MyTripsPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/trips/:id"
        element={<ProtectedRoute><MainLayout><TripDetailsPage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TripProvider>
          <AppRoutes />
        </TripProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
