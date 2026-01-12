import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import RegistrationPage from './pages/user/RegistrationPage';
import CheckoutPage from './pages/user/CheckoutPage';
import PaymentStatusPage from './pages/user/PaymentStatusPage';
import AccommodationListPage from './pages/user/AccommodationListPage';
import AccommodationDetailPage from './pages/user/AccommodationDetailPage';
import AccommodationCheckoutPage from './pages/user/AccommodationCheckoutPage';
import ConferenceDaysPage from './pages/user/ConferenceDaysPage';
import AbstractRulesPage from './pages/user/AbstractRulesPage';
import AbstractUploadPage from './pages/user/AbstractUploadPage';
import FeedbackPage from './pages/user/FeedbackPage';
import RegistrationFeesPage from './pages/user/RegistrationFeesPage';
import CommitteePage from './pages/user/CommitteePage';
import VenuePage from './pages/user/VenuePage';
import ContactPage from './pages/user/ContactPage';
import GalleryPage from './pages/user/GalleryPage';
import HomePage from './pages/user/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import RegistrationsManagementPage from './pages/admin/RegistrationsManagementPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import AccommodationManagementPage from './pages/admin/AccommodationManagementPage';
import PaymentsManagementPage from './pages/admin/PaymentsManagementPage';
import AbstractReviewPage from './pages/admin/AbstractReviewPage';
import FeedbackViewerPage from './pages/admin/FeedbackViewerPage';
import { useEffect } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import QrScanner from './pages/admin/QrScanner';
import AttendanceManagementPage from './pages/admin/AttendanceManagement';
import OfficeBearersPage from './pages/user/OfficeBearersPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005aa9]"></div>
      </div>
    );
  }
  
  return isAuthenticated ?children : <Navigate to="/login" replace />;
};

const ProfileGateRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005aa9]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && user?.isProfileComplete === false) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />; 
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005aa9]"></div>
      </div>
    );
  }
  
  // If authenticated user visits public page, redirect to dashboard/home
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>

        <Router>
          <ScrollToTop/>
          <div className="App">
            <Routes>
              {}
              <Route path="/" element={
                  <HomePage />
              } />
              
              <Route path="/register-details" element={
                  <RegistrationFeesPage />
              } />
              
              <Route path="/venue" element={
                  <VenuePage />
              } />
              
              <Route path="/committee" element={
                  <CommitteePage />
              } />
              
              <Route path="/contact" element={
                  <ContactPage />
              } />
              <Route path="/gallery" element={
                  <GalleryPage />
              } />
               <Route path="/office-bearers" element={
                  <OfficeBearersPage />
              } />
              
              
              <Route path="/register" element={
                  <RegisterPage />
              } />

              {}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin/forgot-password" element={<ForgotPasswordPage isAdmin />} />
              <Route path="/admin/reset-password" element={<ResetPasswordPage isAdmin />} />

              {}
              <Route path="/dashboard" element={
                <ProfileGateRoute>
                  <DashboardPage />
                </ProfileGateRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/registration" element={
                <ProtectedRoute>
                  <RegistrationPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/payment-status" element={
                <ProtectedRoute>
                  <PaymentStatusPage />
                </ProtectedRoute>
              } />
              <Route path="/accommodation" element={
                <ProtectedRoute>
                  <AccommodationListPage />
                </ProtectedRoute>
              } />
              <Route path="/accommodation/:id" element={
                <ProtectedRoute>
                  <AccommodationDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/accommodation/checkout" element={
                <ProtectedRoute>
                  <AccommodationCheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/conference-days" element={
                <ProtectedRoute>
                  <ConferenceDaysPage />
                </ProtectedRoute>
              } />
              <Route path="/abstract/rules" element={
                <ProtectedRoute>
                  <AbstractRulesPage />
                </ProtectedRoute>
              } />
              <Route path="/abstract/upload" element={
                <ProtectedRoute>
                  <AbstractUploadPage />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              } />

              {}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
              <Route path="/admin/registrations" element={
                <AdminRoute>
                  <RegistrationsManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UsersManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/scanner" element={
                <AdminRoute>
                  <QrScanner />
                </AdminRoute>
              } />
              <Route path="/admin/check/attendance" element={
                <AdminRoute>
                  <AttendanceManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/accommodations" element={
                <AdminRoute>
                  <AccommodationManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/payments" element={
                <AdminRoute>
                  <PaymentsManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/abstracts" element={
                <AdminRoute>
                  <AbstractReviewPage />
                </AdminRoute>
              } />
              <Route path="/admin/feedback" element={
                <AdminRoute>
                  <FeedbackViewerPage />
                </AdminRoute>
              } />

              {}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              
              {}
              <Route path="*" element={
                <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                  <div className="text-center max-w-md">
                    <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">404</h1>
                    <p className="text-lg text-slate-600 mb-8">Page not found</p>
                    <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#005aa9] text-white rounded-xl hover:bg-[#004684] transition-colors font-medium shadow-sm hover:shadow-md">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
