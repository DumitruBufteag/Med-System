import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';
import Spinner from '../ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Restrict the route to one role, or to any of several. */
  role?: UserRole | UserRole[];
}

/**
 * Guards a route on the same two levels the API does.
 *
 * Authentication comes first: without a token that is present, readable and in
 * date there is no session, and the visitor goes to the sign-in form with the
 * address they wanted, so they land back on it afterwards. Authorisation comes
 * second: a signed-in account whose role does not match is sent to 403, which is
 * a different answer from "sign in" and deserves a different screen.
 *
 * This only decides what to render. The token travels with every request and the
 * API enforces the same rules again — editing `role` in storage changes the menu,
 * never what the server will actually do.
 */
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { isAuthenticated, isVerifyingSession, role: currentRole } = useAuth();
  const location = useLocation();

  // A token restored from storage is not trusted until the API has confirmed it,
  // so the guard waits rather than admitting someone on a token about to be
  // rejected, or bouncing someone whose session is in fact fine.
  if (isVerifyingSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
    );
  }

  const allowedRoles = role === undefined ? null : Array.isArray(role) ? role : [role];
  if (allowedRoles && (currentRole === null || !allowedRoles.includes(currentRole))) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
