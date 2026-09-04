import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AxiosProvider } from './contexts/AxiosContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ClinicProvider } from './contexts/ClinicContext';

import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage from './pages/HomePage';
import ClinicsPage from './pages/ClinicsPage';
import ClinicDetailPage from './pages/ClinicDetailPage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { NotFoundPage } from './pages/errors';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminClinicsPage from './pages/admin/AdminClinicsPage';
import AdminClinicFormPage from './pages/admin/AdminClinicFormPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AxiosProvider>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <ClinicProvider>
                <ErrorBoundary>
                  <Routes>
                    {/* Auth Routes — own full-screen layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Admin Routes — own layout, admin-only */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="clinici" element={<AdminClinicsPage />} />
                      <Route path="clinici/nou" element={<AdminClinicFormPage />} />
                      <Route path="clinici/:id/editare" element={<AdminClinicFormPage />} />
                      <Route path="pacienti" element={<AdminPatientsPage />} />
                      <Route path="programari" element={<AdminAppointmentsPage />} />
                    </Route>

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/clinici" element={<ClinicsPage />} />
                      <Route path="/clinici/:slug" element={<ClinicDetailPage />} />
                      <Route path="/specialitati" element={<SpecialtiesPage />} />
                      <Route path="/cum-functioneaza" element={<HowItWorksPage />} />
                      <Route path="/contact" element={<ContactPage />} />

                      {/* These require an account */}
                      <Route
                        path="/programare"
                        element={
                          <ProtectedRoute>
                            <BookingPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/programarile-mele"
                        element={
                          <ProtectedRoute>
                            <MyAppointmentsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profil"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch-all: any unknown route → 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </ErrorBoundary>
              </ClinicProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export default App;
