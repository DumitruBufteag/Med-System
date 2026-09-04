import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
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
  logout: () => void;
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

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

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
