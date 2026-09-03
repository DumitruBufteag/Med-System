import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AxiosProvider } from './contexts/AxiosContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ClinicProvider } from './contexts/ClinicContext';

import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/layout/ScrollToTop';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import HomePage from './pages/HomePage';
import ClinicsPage from './pages/ClinicsPage';
import ClinicDetailPage from './pages/ClinicDetailPage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { NotFoundPage } from './pages/errors';

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

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/clinici" element={<ClinicsPage />} />
                      <Route path="/clinici/:slug" element={<ClinicDetailPage />} />

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
