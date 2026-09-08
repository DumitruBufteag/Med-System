import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ForbiddenPage, UnauthorizedPage } from '../../pages/errors';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Restrict the route to a single role, e.g. "admin". */
  role?: 'patient' | 'clinic' | 'admin';
}

/**
 * Guards a route on two levels: anonymous visitors get a 401 page with a way to
 * sign in, signed-in users without the required role get a 403 instead — the
 * protected page itself is never rendered in either case.
 */
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <UnauthorizedPage />;

  if (role && user?.role !== role) return <ForbiddenPage />;

  return <>{children}</>;
}
