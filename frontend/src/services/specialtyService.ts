import type { ServiceResponse, Specialty } from '../types';
import { mockSpecialties } from '../data/mockData';
import { extractServiceError, mapSpecialtyFromApi } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay, simulateBackendFailure } from './config';
import { getErrorStatus } from './serviceErrors';
import { translate } from '../i18n';

export async function getSpecialties(): Promise<ServiceResponse<Specialty[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    simulateBackendFailure();
    return { success: true, data: mockSpecialties };
  }

  try {
    const response = await getApiClient().get('/api/specialties/getAll');
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapSpecialtyFromApi) };
  } catch (error) {
    return {
      success: false,
      status: getErrorStatus(error) ?? undefined,
      error: extractServiceError(error, translate('errLoadSpecialties')),
    };
  }
}
