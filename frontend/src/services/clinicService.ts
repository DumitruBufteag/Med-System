import type { Clinic, ClinicFilters, ClinicInputDTO, ServiceResponse, WorkingHours } from '../types';
import { STORAGE_KEYS } from '../types';
import { mockClinics } from '../data/mockData';
import { extractServiceError, mapClinicFromApi } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { applyClinicFilters } from './filterService';
import { translate } from '../i18n';
import { getInitials, slugify } from '../lib/utils';
import { createId } from './localUserStore';

// ─── Local store (mock mode) ────────────────────────────────────
// Clinics start out as the read-only demo dataset, but the admin panel needs
// to create, edit and remove them — so, like appointments and users, they are
// copied into localStorage on first read and every service function after
// that works off the stored copy.

function readStoredClinics(): Clinic[] | null {
  const raw = localStorage.getItem(STORAGE_KEYS.CLINICS);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Clinic[]) : null;
  } catch {
    return null;
  }
}

function writeStoredClinics(clinics: Clinic[]): void {
  localStorage.setItem(STORAGE_KEYS.CLINICS, JSON.stringify(clinics));
}

/**
 * Returns the local clinics, seeding the demo catalogue on first run.
 * Exported so `doctorService`/`reviewService` resolve a clinic slug against
 * the same store admins edit, instead of the frozen `mockClinics` array.
 */
export function loadClinics(): Clinic[] {
  const existing = readStoredClinics();
  if (existing) return existing;

  writeStoredClinics(mockClinics);
  return mockClinics;
}

/** Turns the admin form's simplified schedule into a display label and periods. */
function buildWorkingHours(schedule: ClinicInputDTO['schedule']): WorkingHours {
  if (schedule.alwaysOpen) {
    return { label: 'Non-stop, 24/7', alwaysOpen: true };
  }

  const labelParts = [`Lun–Vin, ${schedule.weekdayStart}–${schedule.weekdayEnd}`];
  const periods = [{ days: [1, 2, 3, 4, 5], start: schedule.weekdayStart, end: schedule.weekdayEnd }];

  if (schedule.saturdayEnabled) {
    labelParts.push(`Sâm, ${schedule.saturdayStart}–${schedule.saturdayEnd}`);
    periods.push({ days: [6], start: schedule.saturdayStart, end: schedule.saturdayEnd });
  }

  return { label: labelParts.join(' · '), periods };
}

// ─── Public API ─────────────────────────────────────────────────

export async function getClinics(
  filters: ClinicFilters = {},
): Promise<ServiceResponse<Clinic[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, data: applyClinicFilters(loadClinics(), filters) };
  }

  try {
    const response = await getApiClient().get('/api/clinics/getAll', { params: filters });
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapClinicFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadClinics')),
    };
  }
}

export async function getFeaturedClinics(limit = 6): Promise<ServiceResponse<Clinic[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const featured = [...loadClinics()].sort((a, b) => b.rating - a.rating).slice(0, limit);
    return { success: true, data: featured };
  }

  try {
    const response = await getApiClient().get('/api/clinics/getFeatured', { params: { limit } });
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapClinicFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadFeaturedClinics')),
    };
  }
}

export async function getClinicBySlug(slug: string): Promise<ServiceResponse<Clinic>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = loadClinics().find((item) => item.slug === slug);
    return clinic
      ? { success: true, data: clinic }
      : { success: false, error: translate('errClinicNotFoundBySlug').replace('{slug}', slug) };
  }

  try {
    const response = await getApiClient().get(`/api/clinics/getBySlug/${slug}`);
    return { success: true, data: mapClinicFromApi(response.data) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(
        error,
        translate('errClinicNotFoundBySlug').replace('{slug}', slug),
      ),
    };
  }
}

/** Used by the admin edit form, which addresses a clinic by its stable id. */
export async function getClinicById(id: string): Promise<ServiceResponse<Clinic>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = loadClinics().find((item) => item.id === id);
    return clinic
      ? { success: true, data: clinic }
      : { success: false, error: translate('errClinicNotFound') };
  }

  try {
    const response = await getApiClient().get(`/api/clinics/getById/${id}`);
    return { success: true, data: mapClinicFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errClinicNotFound')) };
  }
}

/** Admin-only: adds a new clinic to the catalogue. */
export async function createClinic(input: ClinicInputDTO): Promise<ServiceResponse<Clinic>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const clinics = loadClinics();
    const slug = slugify(input.name);
    if (!slug || clinics.some((item) => item.slug === slug)) {
      return { success: false, error: translate('errClinicSlugTaken') };
    }

    const clinic: Clinic = {
      id: `cl-${createId()}`,
      slug,
      name: input.name.trim(),
      type: input.type,
      city: input.city,
      address: input.address.trim(),
      phone: input.phone.trim(),
      website: input.website?.trim() || undefined,
      description: input.description.trim(),
      rating: 0,
      reviewsCount: 0,
      specialties: input.specialties,
      consultationFrom: input.consultationFrom,
      workingHours: buildWorkingHours(input.schedule),
      hasEmergency: input.hasEmergency,
      acceptsInsurance: input.acceptsInsurance,
      brandColor: input.brandColor,
      initials: getInitials(input.name),
    };

    writeStoredClinics([...clinics, clinic]);
    return { success: true, data: clinic };
  }

  try {
    const response = await getApiClient().post('/api/clinics/create', input);
    return { success: true, data: mapClinicFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errSaveChangesGeneric')) };
  }
}

/** Admin-only: replaces an existing clinic's editable fields. */
export async function updateClinic(
  id: string,
  input: ClinicInputDTO,
): Promise<ServiceResponse<Clinic>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const clinics = loadClinics();
    const index = clinics.findIndex((item) => item.id === id);
    if (index === -1) return { success: false, error: translate('errClinicNotFound') };

    const slug = slugify(input.name);
    const slugTaken = clinics.some((item) => item.id !== id && item.slug === slug);
    if (!slug || slugTaken) {
      return { success: false, error: translate('errClinicSlugTaken') };
    }

    const updated: Clinic = {
      ...clinics[index],
      slug,
      name: input.name.trim(),
      type: input.type,
      city: input.city,
      address: input.address.trim(),
      phone: input.phone.trim(),
      website: input.website?.trim() || undefined,
      description: input.description.trim(),
      specialties: input.specialties,
      consultationFrom: input.consultationFrom,
      workingHours: buildWorkingHours(input.schedule),
      hasEmergency: input.hasEmergency,
      acceptsInsurance: input.acceptsInsurance,
      brandColor: input.brandColor,
      initials: getInitials(input.name),
    };

    const next = [...clinics];
    next[index] = updated;
    writeStoredClinics(next);
    return { success: true, data: updated };
  }

  try {
    const response = await getApiClient().put(`/api/clinics/update/${id}`, input);
    return { success: true, data: mapClinicFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errSaveChangesGeneric')) };
  }
}

/** Admin-only: removes a clinic from the catalogue. */
export async function deleteClinic(id: string): Promise<ServiceResponse<void>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const clinics = loadClinics();
    writeStoredClinics(clinics.filter((item) => item.id !== id));
    return { success: true };
  }

  try {
    await getApiClient().delete(`/api/clinics/delete/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errDeleteClinicGeneric')) };
  }
}
