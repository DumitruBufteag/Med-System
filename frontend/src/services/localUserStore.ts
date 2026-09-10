import type { User } from '../types';
import { STORAGE_KEYS } from '../types';
import { demoAccounts } from '../data/mockData';

/**
 * The local account store used while the app runs without a backend.
 * Shared by authService (sign in / sign up) and userService (profile edits)
 * so both work on the same records.
 */

/** A user as kept in localStorage: the account plus its password digest. */
export interface StoredUser extends User {
  passwordHash: string;
}

/**
 * Hashes a password before it touches localStorage.
 *
 * This is NOT authentication security — a digest computed in the browser is
 * only as strong as the browser. It exists so no plaintext password is ever
 * written to disk while the app runs without a backend. Real hashing (bcrypt
 * / Argon2, salted, server-side) arrives with the API.
 *
 * `crypto.subtle` only exists in a secure context (https or localhost), so
 * opening the dev server over a LAN address falls back to a plain checksum.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);

    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // FNV-1a — not a password hash, only an obfuscation for the demo store.
  let hash = 0x811c9dc5;
  for (let index = 0; index < password.length; index += 1) {
    hash ^= password.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return `fnv1a.${hash.toString(16)}`;
}

/** Random id that also works outside a secure context. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredUsers(): StoredUser[] | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : null;
  } catch {
    return null;
  }
}

export function writeStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/** Returns the local accounts, seeding the demo ones on first run. */
export async function loadUsers(): Promise<StoredUser[]> {
  const existing = readStoredUsers();
  if (existing) return existing;

  const seeded = await Promise.all(
    demoAccounts.map(async (account, index) => ({
      id: `usr-${index + 1}`,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(account.password),
    })),
  );

  writeStoredUsers(seeded);
  return seeded;
}

/** Strips the password digest before a user reaches the UI. */
export function toPublicUser(stored: StoredUser): User {
  const { passwordHash, ...user } = stored;
  void passwordHash;
  return user;
}

/** UTF-8 → base64url, the encoding a JWT segment uses. */
function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Builds a token shaped exactly like the one the API signs — same three segments,
 * same claims — but with a placeholder signature, since the browser has no key.
 *
 * It exists so mock mode exercises the real code path: the session is restored by
 * decoding a token, not by trusting a separate copy of the user, and switching
 * VITE_USE_MOCK_DATA does not change how authentication behaves. Nothing verifies
 * this token, which is precisely why mock mode is a demo and not a security model.
 */
function issueMockToken(user: User): string {
  const issuedAt = Math.floor(Date.now() / 1000);

  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    jti: createId(),
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + 60 * 60,
    iss: 'MedGidMock',
    aud: 'MedGidApp',
  };

  return `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(payload))}.mock-signature`;
}

export function startSession(user: User): void {
  localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, issueMockToken(user));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

/** Refreshes the cached session user after a profile edit. */
export function updateSessionUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}
