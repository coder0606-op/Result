import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import SchoolSettings from './pages/SchoolSettings';
import Subjects from './pages/Subjects';
import ReportCardPage from './pages/ReportCardPage';
import UpdateReportCardPage from './pages/UpdateReportCardPage';
import CreateReportCardPage from './pages/CreateReportCardPage';
import AdmitCardPage from './pages/AdmitCardPage';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xs font-bold text-maroon">Loading Application...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root Route - Force login first */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      
      {/* Login Route */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />

      {/* Protected Report Card & Management Routes (Require Email & Password Login) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedLayout>
            <Students />
          </ProtectedLayout>
        }
      />
      <Route
        path="/add-student"
        element={
          <ProtectedLayout>
            <AddStudent />
          </ProtectedLayout>
        }
      />
      <Route
        path="/edit-student/:id"
        element={
          <ProtectedLayout>
            <EditStudent />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <SchoolSettings />
          </ProtectedLayout>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedLayout>
            <Subjects />
          </ProtectedLayout>
        }
      />
      <Route
        path="/create-report-card"
        element={
          <ProtectedLayout>
            <CreateReportCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/update-report-card"
        element={
          <ProtectedLayout>
            <UpdateReportCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/update-report-card/:id"
        element={
          <ProtectedLayout>
            <UpdateReportCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/report-cards"
        element={
          <ProtectedLayout>
            <ReportCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/admit-card"
        element={
          <ProtectedLayout>
            <AdmitCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/admit-card/:id"
        element={
          <ProtectedLayout>
            <AdmitCardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedLayout>
            <ReportCardPage />
          </ProtectedLayout>
        }
      />

      {/* Catch-all redirects to Login if unauthenticated */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
