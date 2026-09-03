import type { ChangePasswordDTO, ServiceResponse, UpdateProfileDTO, User } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import {
  hashPassword,
  loadUsers,
  toPublicUser,
  updateSessionUser,
  writeStoredUsers,
} from './localUserStore';

export async function updateProfile(
  userId: string,
  dto: UpdateProfileDTO,
): Promise<ServiceResponse<User>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) return { success: false, error: 'Contul nu a fost găsit.' };

    const normalisedEmail = dto.email.trim().toLowerCase();
    const isTaken = users.some(
      (user) => user.id !== userId && user.email.toLowerCase() === normalisedEmail,
    );
    if (isTaken) return { success: false, error: 'Există deja un cont cu acest e-mail.' };

    const updated = {
      ...users[index],
      name: dto.name.trim(),
      email: normalisedEmail,
      phone: dto.phone?.trim() || undefined,
    };

    const next = [...users];
    next[index] = updated;
    writeStoredUsers(next);

    const user = toPublicUser(updated);
    updateSessionUser(user);
    return { success: true, data: user };
  }

  try {
    const response = await getApiClient().put(`/api/users/updateProfile/${userId}`, dto);
    const user = response.data as User;
    updateSessionUser(user);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut salva modificările.'),
    };
  }
}

export async function changePassword(
  userId: string,
  dto: ChangePasswordDTO,
): Promise<ServiceResponse<void>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) return { success: false, error: 'Contul nu a fost găsit.' };

    if (users[index].passwordHash !== (await hashPassword(dto.currentPassword))) {
      return { success: false, error: 'Parola actuală este incorectă.' };
    }

    const next = [...users];
    next[index] = { ...users[index], passwordHash: await hashPassword(dto.newPassword) };
    writeStoredUsers(next);

    return { success: true };
  }

  try {
    await getApiClient().put(`/api/users/changePassword/${userId}`, dto);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut schimba parola.'),
    };
  }
}
