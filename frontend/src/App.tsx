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
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import {
  ForbiddenPage,
  NotFoundPage,
  ServerErrorPage,
  UnauthorizedPage,
} from './pages/errors';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminClinicsPage from './pages/admin/AdminClinicsPage';
import AdminClinicFormPage from './pages/admin/AdminClinicFormPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminDoctorFormPage from './pages/admin/AdminDoctorFormPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <AxiosProvider>
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
                      <Route path="medici" element={<AdminDoctorsPage />} />
                      <Route path="medici/nou" element={<AdminDoctorFormPage />} />
                      <Route path="medici/:id/editare" element={<AdminDoctorFormPage />} />
                      <Route path="pacienti" element={<AdminPatientsPage />} />
                      <Route path="programari" element={<AdminAppointmentsPage />} />
                      {/* Unknown /admin/* address: still guarded, then a 404. */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/clinici" element={<ClinicsPage />} />
                      <Route path="/clinici/:slug" element={<ClinicDetailPage />} />
                      <Route path="/specialitati" element={<SpecialtiesPage />} />
                      <Route path="/cum-functioneaza" element={<HowItWorksPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/despre" element={<AboutPage />} />
                      <Route path="/termeni" element={<TermsPage />} />
                      <Route path="/confidentialitate" element={<PrivacyPage />} />

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

                      {/* Error screens, reachable by address: the axios
                          response interceptor navigates here on a 403, and
                          the other two are linked from the interface. */}
                      <Route path="/401" element={<UnauthorizedPage />} />
                      <Route path="/403" element={<ForbiddenPage />} />
                      <Route path="/500" element={<ServerErrorPage />} />

                      {/* Catch-all: any unknown route → 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </ErrorBoundary>
              </ClinicProvider>
            </LanguageProvider>
          </AxiosProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
