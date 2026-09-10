import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import { createApiClient, setApiClient } from '../services/httpClient';
import { HTTP_STATUS, toServiceError } from '../services/serviceErrors';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS } from '../types';

interface AxiosContextType {
  apiClient: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextType | undefined>(undefined);

/**
 * Endpoints whose 401 the caller handles itself, so the interceptor leaves it be.
 *
 * On the sign-in form a 401 means "wrong password", not "your session expired".
 * On /me it does mean an expired session, but that check runs on start-up from
 * whatever page the visitor opened: AuthContext clears the session in place,
 * rather than throwing someone reading a public page out to the login form.
 */
const SELF_HANDLED_401 = ['/api/auth/login', '/api/auth/register', '/api/auth/me'];

function handlesOwn401(url?: string): boolean {
  return SELF_HANDLED_401.some((endpoint) => url?.includes(endpoint));
}

/**
 * Owns the single axios instance every service uses.
 *
 * Two interceptors run on it:
 *  - the request one attaches the stored JWT, so no service has to think about
 *    authentication;
 *  - the response one turns every failure into a `ServiceError` carrying the
 *    HTTP status, and handles the two statuses that are about the session rather
 *    than about the request (401 and 403) in one place.
 *
 * Everything else — 404, 409, 400, 500 — is deliberately left to the caller: a
 * clinic that does not exist has to render an inline "not found" on the page the
 * visitor is on, not navigate them somewhere else.
 */
export function AxiosProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const apiClient = useMemo(() => {
    const client = createApiClient();

    client.interceptors.request.use((config) => {
      const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    client.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        const serviceError = toServiceError(error);
        const requestUrl = (error as { config?: { url?: string } })?.config?.url;

        if (serviceError.status === HTTP_STATUS.UNAUTHORIZED && !handlesOwn401(requestUrl)) {
          // The token is missing, expired or no longer accepted. Keeping the
          // stale session would leave the interface showing a signed-in user
          // whose every request fails, so it ends here and the visitor lands on
          // the sign-in form.
          logout('/login');
        } else if (serviceError.status === HTTP_STATUS.FORBIDDEN) {
          // Signed in, but not allowed — a patient reaching an admin endpoint.
          navigate('/403', { replace: true });
        }

        return Promise.reject(serviceError);
      },
    );

    // Set synchronously rather than in an effect: a service called during the
    // first render would otherwise use the bare client, with no interceptors.
    setApiClient(client);

    return client;
  }, [logout, navigate]);

  return <AxiosContext.Provider value={{ apiClient }}>{children}</AxiosContext.Provider>;
}

export function useAxios() {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context;
}
