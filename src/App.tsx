import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ManageUsers } from './pages/admin/ManageUsers';
import { CreateMember } from './pages/admin/CreateMember';
import { MembershipRequests } from './pages/admin/MembershipRequests';
import { ManageWebsiteContent } from './pages/admin/ManageWebsiteContent';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { MemberDashboardPage } from './pages/MemberDashboardPage';
import { SubmitContent } from './pages/member/SubmitContent';
import { MySubmissions } from './pages/member/MySubmissions';
import { TeamsPage } from './pages/TeamsPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { EventsPage } from './pages/EventsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrismPage } from './pages/PrismPage';
import { PaymentsPassesPage } from './pages/PaymentsPassesPage';
import { UserRole } from './types';
import { authService } from './services/authService';

// Role-Aware Protected Route Wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, addToast, switchTabRole } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role authorization check is specified
  if (allowedRoles && allowedRoles.length > 0 && !authService.hasRole(user, allowedRoles)) {
    const wantsAdmin = allowedRoles.some((r) => r.toLowerCase().includes('admin'));
    const wantsMember = allowedRoles.some((r) => r.toLowerCase().includes('member'));

    if (wantsAdmin) {
      switchTabRole('admin');
      return <>{children}</>;
    }

    if (wantsMember) {
      switchTabRole('member');
      return <>{children}</>;
    }

    // Redirect to the role's appropriate home
    const userRole = (user?.role || 'student').toLowerCase();
    const fallbackPath =
      userRole === 'admin' || userRole === 'administrator' ? '/admin' :
        userRole === 'member' || userRole === 'team lead' ? '/member' :
          '/';

    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

// Login Route Wrapper (redirects to appropriate dashboard if already logged in)
const LoginRoute: React.FC = () => {
  const { isAuthenticated, user } = useApp();
  if (isAuthenticated) {
    const userRole = (user?.role || 'student').toLowerCase();
    const dest =
      userRole === 'admin' || userRole === 'administrator' ? '/admin' :
        userRole === 'member' || userRole === 'team lead' ? '/member' :
          '/';
    return <Navigate to={dest} replace />;
  }
  return <LoginPage />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Login Page with 3-Option Role System */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Main Platform: Direct Open Without Login Requirement */}
      <Route path="/" element={<MainLayout />}>
        {/* Student / Common User Dashboard */}
        <Route index element={<HomePage />} />

        {/* Executive Admin Suite (Protected: Admin Only) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/create-member"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <CreateMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/membership-requests"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <MembershipRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/content"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <ManageWebsiteContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/logs"
          element={
            <ProtectedRoute allowedRoles={['admin', 'Administrator']}>
              <AdminAuditLogs />
            </ProtectedRoute>
          }
        />

        {/* PRISM Member Suite (Protected: Member & Admin) */}
        <Route
          path="member"
          element={
            <ProtectedRoute allowedRoles={['member', 'admin', 'Team Lead', 'Administrator']}>
              <MemberDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/add-content"
          element={
            <ProtectedRoute allowedRoles={['member', 'admin', 'Team Lead', 'Administrator']}>
              <SubmitContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="member/submissions"
          element={
            <ProtectedRoute allowedRoles={['member', 'admin', 'Team Lead', 'Administrator']}>
              <MySubmissions />
            </ProtectedRoute>
          }
        />

        {/* Existing Collegiate Modules */}
        <Route path="teams" element={<TeamsPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="prism" element={<PrismPage />} />
        <Route path="payments-and-passes" element={<PaymentsPassesPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
