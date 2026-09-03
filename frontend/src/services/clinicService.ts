import type { Clinic, ClinicFilters, ServiceResponse } from '../types';
import { mockClinics } from '../data/mockData';
import { extractServiceError, mapClinicFromApi } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { applyClinicFilters } from './filterService';

export async function getClinics(
  filters: ClinicFilters = {},
): Promise<ServiceResponse<Clinic[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, data: applyClinicFilters(mockClinics, filters) };
  }

  try {
    const response = await getApiClient().get('/api/clinics/getAll', { params: filters });
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapClinicFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca lista de clinici.'),
    };
  }
}

export async function getFeaturedClinics(limit = 6): Promise<ServiceResponse<Clinic[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const featured = [...mockClinics]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    return { success: true, data: featured };
  }

  try {
    const response = await getApiClient().get('/api/clinics/getFeatured', { params: { limit } });
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapClinicFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca clinicile recomandate.'),
    };
  }
}

export async function getClinicBySlug(slug: string): Promise<ServiceResponse<Clinic>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = mockClinics.find((item) => item.slug === slug);
    return clinic
      ? { success: true, data: clinic }
      : { success: false, error: `Clinica "${slug}" nu a fost găsită.` };
  }

  try {
    const response = await getApiClient().get(`/api/clinics/getBySlug/${slug}`);
    return { success: true, data: mapClinicFromApi(response.data) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, `Clinica "${slug}" nu a fost găsită.`),
    };
  }
}
