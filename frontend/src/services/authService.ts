import type { AuthResult, RegisterDTO, User } from '../types';
import { STORAGE_KEYS } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { readStoredClaims } from './jwt';
import { translate } from '../i18n';
import {
  createId,
  hashPassword,
  loadUsers,
  startSession,
  toPublicUser,
  writeStoredUsers,
  type StoredUser,
} from './localUserStore';

export type { AuthResult } from '../types';

// ─── Public API ─────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const normalisedEmail = email.trim().toLowerCase();
    const match = users.find((user) => user.email.toLowerCase() === normalisedEmail);

    // The same message for both cases, so the form cannot be used to find out
    // which e-mail addresses are registered.
    if (!match || match.passwordHash !== (await hashPassword(password))) {
      return { success: false, error: translate('errLoginFailed') };
    }

    const user = toPublicUser(match);
    startSession(user);
    return { success: true, user };
  }

  try {
    const response = await getApiClient().post('/api/auth/login', { email, password });
    const { token, user } = response.data as { token: string; user: User };

    localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errLoginFailedGeneric')) };
  }
}

export async function registerUser(dto: RegisterDTO): Promise<AuthResult> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const normalisedEmail = dto.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === normalisedEmail)) {
      return { success: false, error: translate('errEmailTaken') };
    }

    const stored: StoredUser = {
      id: `usr-${createId()}`,
      name: dto.name.trim(),
      email: normalisedEmail,
      phone: dto.phone?.trim() || undefined,
      role: 'patient',
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(dto.password),
    };

    writeStoredUsers([...users, stored]);

    const user = toPublicUser(stored);
    startSession(user);
    return { success: true, user };
  }

  try {
    const response = await getApiClient().post('/api/auth/register', dto);
    const { token, user } = response.data as { token: string; user: User };

    localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errRegisterFailedGeneric')),
    };
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/** The cached profile, used only to fill in fields the token carries no claim for. */
function readCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/**
 * Rebuilds the signed-in user from the stored token after a page reload.
 *
 * The token is the authority on id, e-mail and role — those are claims the server
 * signed, and the same values the API will enforce on every request. The cached
 * profile is consulted only for the fields no claim carries, and only when it
 * belongs to the same account; a leftover copy of a different user is ignored
 * rather than merged. No token, an unreadable one, or an expired one ends the
 * session here, so a stale cached user can never outlive the token.
 */
export function restoreSession(): User | null {
  const claims = readStoredClaims();
  if (!claims) {
    logoutUser();
    return null;
  }

  const cached = readCachedUser();
  const profile = cached?.id === claims.sub ? cached : null;

  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name ?? profile?.name ?? claims.email,
    role: claims.role,
    phone: profile?.phone,
    avatar: profile?.avatar,
    createdAt: profile?.createdAt ?? '',
  };
}

/**
 * Asks the API who the stored token belongs to.
 *
 * The browser can read a token but not verify it, so this is the only way to
 * learn that one has been revoked, signed with a different key, or issued to an
 * account that no longer exists. Also refreshes the profile fields that live in
 * the database rather than in the claims. Throws on a rejected token — the axios
 * interceptor turns that 401 into a sign-out.
 */
export async function fetchCurrentUser(): Promise<User | null> {
  if (USE_MOCK_DATA) {
    // No server to ask; the locally issued token is all there is.
    return restoreSession();
  }

  const response = await getApiClient().get('/api/auth/me');
  const user = response.data as User;

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
}
