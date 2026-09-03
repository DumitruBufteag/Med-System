import type { Doctor, ServiceResponse } from '../types';
import { mockClinics, mockDoctors } from '../data/mockData';
import { extractServiceError, mapDoctorFromApi } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';

/** Every doctor in the catalogue, for building id → doctor lookups. */
export async function getDoctors(): Promise<ServiceResponse<Doctor[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, data: mockDoctors };
  }

  try {
    const response = await getApiClient().get('/api/doctors/getAll');
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapDoctorFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca medicii.'),
    };
  }
}

/** Doctors are addressed by clinic slug, the same identifier used in the URL. */
export async function getDoctorsByClinic(slug: string): Promise<ServiceResponse<Doctor[]>> {
  if (!slug) return { success: true, data: [] };

  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = mockClinics.find((item) => item.slug === slug);
    return {
      success: true,
      data: clinic ? mockDoctors.filter((doctor) => doctor.clinicId === clinic.id) : [],
    };
  }

  try {
    const response = await getApiClient().get(`/api/doctors/getByClinic/${slug}`);
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapDoctorFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca echipa medicală.'),
    };
  }
}
