import type { UserRole } from '../types';
import { STORAGE_KEYS } from '../types';

/**
 * Reading the bearer token the API issued.
 *
 * What this can and cannot do is worth being precise about: the payload of a JWT
 * is only base64url, so the browser can read the claims, but it holds no signing
 * key and therefore cannot tell a genuine token from a forged one. Everything
 * here is for deciding what to *render* — which is why the server re-checks the
 * signature on every request, and why `/api/auth/me` exists to confirm a restored
 * session before the interface trusts it.
 *
 * Claim names match those written by MedGid.BusinessLayer AuthActions.
 */

/** The claims MedGid signs into a token. */
export interface JwtClaims {
  /** The user id. */
  sub: string;
  email: string;
  name?: string;
  role: UserRole;
  /** Expiry, in seconds since the epoch — the JWT convention, not milliseconds. */
  exp: number;
  iat?: number;
  jti?: string;
  iss?: string;
  aud?: string;
}

const USER_ROLES: readonly UserRole[] = ['patient', 'clinic', 'admin'];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}

/**
 * base64url → string. `atob` handles neither the url-safe alphabet nor the
 * missing padding, and returns one byte per character, so a name with diacritics
 * has to be walked back through UTF-8 or it arrives mojibake.
 */
function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

/**
 * Reads the claims out of a token, or returns null if it is not a JWT at all.
 * A token that parses is not thereby a valid one — see the note at the top.
 */
export function decodeToken(token: string | null | undefined): JwtClaims | null {
  if (!token) return null;

  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(segments[1])) as Record<string, unknown>;

    // A payload missing any of these is not one this application issued, and
    // guessing defaults for them would hand the interface a session with no
    // identity behind it.
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.exp !== 'number' ||
      !isUserRole(payload.role)
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
      role: payload.role,
      exp: payload.exp,
      iat: typeof payload.iat === 'number' ? payload.iat : undefined,
      jti: typeof payload.jti === 'string' ? payload.jti : undefined,
      iss: typeof payload.iss === 'string' ? payload.iss : undefined,
      aud: typeof payload.aud === 'string' ? payload.aud : undefined,
    };
  } catch {
    return null;
  }
}

/** True once the `exp` claim is in the past. */
export function isExpired(claims: JwtClaims): boolean {
  return claims.exp * 1000 <= Date.now();
}

/** Milliseconds until expiry, floored at zero. */
export function millisecondsUntilExpiry(claims: JwtClaims): number {
  return Math.max(0, claims.exp * 1000 - Date.now());
}

export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
  } catch {
    // Storage can throw outright in a browser set to block site data.
    return null;
  }
}

/**
 * The claims of the stored token, but only while it is still readable and
 * in date. This is the single check behind "is anyone signed in".
 */
export function readStoredClaims(): JwtClaims | null {
  const claims = decodeToken(readStoredToken());
  if (!claims || isExpired(claims)) return null;

  return claims;
}
