import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterDTO, User } from '../types';
import { loginUser, logoutUser, registerUser, restoreSession } from '../services/authService';
import { translate } from '../i18n';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** True while a login or register request is in flight. */
  isSubmitting: boolean;
  error: string | null;
  /** Resolves to the signed-in user, or `null` on failure — lets callers branch on role. */
  login: (email: string, password: string) => Promise<User | null>;
  register: (dto: RegisterDTO) => Promise<boolean>;
  /** Ends the session and leaves the protected area, home by default. */
  logout: (redirectTo?: string) => void;
  /** Replaces the session user after a profile edit. */
  setUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Restored once, on the first render — the session lives in localStorage.
  const [user, setUser] = useState<User | null>(() => restoreSession());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsSubmitting(true);

    const result = await loginUser(email, password);
    setIsSubmitting(false);

    if (result.success && result.user) {
      setUser(result.user);
      return result.user;
    }

    setError(result.error ?? translate('errLoginFailedGeneric'));
    return null;
  }, []);

  const register = useCallback(async (dto: RegisterDTO) => {
    setError(null);
    setIsSubmitting(true);

    const result = await registerUser(dto);
    setIsSubmitting(false);

    if (result.success && result.user) {
      setUser(result.user);
      return true;
    }

    setError(result.error ?? translate('errRegisterFailedGeneric'));
    return false;
  }, []);

  // Signing out from a protected page would otherwise leave the guard rendering
  // a 401 for a visitor who simply left on purpose, so the session ends with a
  // move away from that page.
  const logout = useCallback(
    (redirectTo = '/') => {
      logoutUser();
      setUser(null);
      navigate(redirectTo, { replace: true });
    },
    [navigate],
  );

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isSubmitting,
        error,
        login,
        register,
        logout,
        setUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
