import type { ChangePasswordDTO, ServiceResponse, UpdateProfileDTO, User } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { translate } from '../i18n';
import {
  hashPassword,
  loadUsers,
  toPublicUser,
  updateSessionUser,
  writeStoredUsers,
} from './localUserStore';

/** Admin-only: every registered account, for the patients list. */
export async function getAllUsers(): Promise<ServiceResponse<User[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const users = await loadUsers();
    return { success: true, data: users.map(toPublicUser) };
  }

  try {
    const response = await getApiClient().get('/api/users/getAll');
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items as User[] };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadPatients')),
    };
  }
}

/** Admin-only: permanently removes a patient account. */
export async function deleteUser(userId: string): Promise<ServiceResponse<void>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    if (!users.some((user) => user.id === userId)) {
      return { success: false, error: translate('errAccountNotFound') };
    }

    writeStoredUsers(users.filter((user) => user.id !== userId));
    return { success: true };
  }

  try {
    await getApiClient().delete(`/api/users/delete/${userId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errDeletePatientGeneric')),
    };
  }
}

export async function updateProfile(
  userId: string,
  dto: UpdateProfileDTO,
): Promise<ServiceResponse<User>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const users = await loadUsers();
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) return { success: false, error: translate('errAccountNotFound') };

    const normalisedEmail = dto.email.trim().toLowerCase();
    const isTaken = users.some(
      (user) => user.id !== userId && user.email.toLowerCase() === normalisedEmail,
    );
    if (isTaken) return { success: false, error: translate('errEmailTaken') };

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
      error: extractServiceError(error, translate('errSaveChangesGeneric')),
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
    if (index === -1) return { success: false, error: translate('errAccountNotFound') };

    if (users[index].passwordHash !== (await hashPassword(dto.currentPassword))) {
      return { success: false, error: translate('errCurrentPasswordWrong') };
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
      error: extractServiceError(error, translate('errChangePasswordGeneric')),
    };
  }
}
