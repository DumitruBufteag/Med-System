import type { AuthResult, RegisterDTO, User } from '../types';
import { STORAGE_KEYS } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
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
      return { success: false, error: 'E-mail sau parolă incorectă.' };
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
    return { success: false, error: extractServiceError(error, 'Autentificare eșuată.') };
  }
}

export async function registerUser(dto: RegisterDTO): Promise<AuthResult> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const normalisedEmail = dto.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === normalisedEmail)) {
      return { success: false, error: 'Există deja un cont cu acest e-mail.' };
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
    return { success: false, error: extractServiceError(error, 'Înregistrare eșuată.') };
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/** Restores the signed-in user from localStorage after a page reload. */
export function restoreSession(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!raw || !localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
