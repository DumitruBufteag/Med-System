import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterDTO, User, UserRole } from '../types';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  restoreSession,
} from '../services/authService';
import { millisecondsUntilExpiry, readStoredClaims } from '../services/jwt';
import { HTTP_STATUS, getErrorStatus } from '../services/serviceErrors';
import { translate } from '../i18n';

interface AuthContextType {
  user: User | null;
  /** True while a token is present, in date, and not yet rejected by the API. */
  isAuthenticated: boolean;
  /** The `sub` claim — the id the API will attribute every request to. */
  userId: string | null;
  /** The `role` claim, which is what the API enforces on protected endpoints. */
  role: UserRole | null;
  isAdmin: boolean;
  /**
   * True while a token restored from storage is being confirmed with the API.
   * Route guards wait for this rather than deciding on a session that may be
   * about to be revoked.
   */
  isVerifyingSession: boolean;
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
  // Rebuilt from the token's claims on the first render, so a reload keeps the
  // session without a round trip and the guards have an answer immediately.
  const [user, setUser] = useState<User | null>(restoreSession);
  // Only a restored session needs confirming. Arriving with no token at all is
  // already a final answer, and making the guards wait for it would flash a
  // loading state on every public page.
  const [isVerifyingSession, setIsVerifyingSession] = useState(() => user !== null);
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
  // a redirect for a visitor who simply left on purpose, so the session ends with
  // a move away from that page.
  //
  // Both updates go in one transition on purpose. The router applies its own as
  // a transition, so an ordinary `setUser(null)` renders first, while the page
  // being left is still the current location: the guard sees a visitor with no
  // session on a protected page and redirects to /login carrying that page, which
  // is what put people back on it at the next sign-in. Committing the cleared
  // session together with the move away leaves no render for that to happen in.
  const logout = useCallback(
    (redirectTo = '/') => {
      logoutUser();
      startTransition(() => {
        setUser(null);
        navigate(redirectTo, { replace: true, state: null });
      });
    },
    [navigate],
  );

  // Confirms a restored token with the API, once, on start-up. The browser can
  // read a token but has no key to verify it, so this is the only way to find out
  // that one was signed with a different key, or belongs to an account that has
  // since been deleted.
  useEffect(() => {
    if (!isVerifyingSession) return;

    let cancelled = false;

    fetchCurrentUser()
      .then((confirmed) => {
        if (!cancelled && confirmed) setUser(confirmed);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;

        // Only a rejected token ends the session. An unreachable API is a
        // different problem, and signing the visitor out over a network blip
        // would lose a session that is perfectly valid.
        if (getErrorStatus(cause) === HTTP_STATUS.UNAUTHORIZED) {
          logoutUser();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsVerifyingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isVerifyingSession]);

  // A token that runs out while the tab is open would otherwise leave the
  // interface showing a signed-in user whose every request comes back 401.
  useEffect(() => {
    const claims = readStoredClaims();
    if (!claims) return;

    const timer = setTimeout(() => logout('/login'), millisecondsUntilExpiry(claims));
    return () => clearTimeout(timer);
  }, [user, logout]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        userId: user?.id ?? null,
        role: user?.role ?? null,
        isAdmin: user?.role === 'admin',
        isVerifyingSession,
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
