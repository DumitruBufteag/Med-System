import type { Doctor, DoctorInputDTO, ServiceResponse } from '../types';
import { STORAGE_KEYS } from '../types';
import { mockDoctors } from '../data/mockData';
import { extractServiceError, mapDoctorFromApi } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';
import { translate } from '../i18n';
import { getInitials } from '../lib/utils';
import { loadClinics } from './clinicService';
import { loadAppointments } from './appointmentService';
import { createId } from './localUserStore';

// ─── Local store (mock mode) ────────────────────────────────────
// The demo dataset seeds the store on first read; every write after that goes
// to localStorage, so the admin panel and the public clinic pages stay in sync.

function readStoredDoctors(): Doctor[] | null {
  const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Doctor[]) : null;
  } catch {
    return null;
  }
}

function writeStoredDoctors(doctors: Doctor[]): void {
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
}

/** Returns the local doctors, seeding the demo team on first run. */
export function loadDoctors(): Doctor[] {
  const existing = readStoredDoctors();
  if (existing) return existing;

  writeStoredDoctors(mockDoctors);
  return mockDoctors;
}

/** Two doctors with the same name in the same clinic would be indistinguishable. */
function isNameTaken(doctors: Doctor[], input: DoctorInputDTO, exceptId?: string): boolean {
  const name = input.name.trim().toLowerCase();

  return doctors.some(
    (doctor) =>
      doctor.id !== exceptId &&
      doctor.clinicId === input.clinicId &&
      doctor.name.trim().toLowerCase() === name,
  );
}

// ─── Read ───────────────────────────────────────────────────────

/** Every doctor in the catalogue, for building id → doctor lookups. */
export async function getDoctors(): Promise<ServiceResponse<Doctor[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { success: true, data: loadDoctors() };
  }

  try {
    const response = await getApiClient().get('/api/doctors/getAll');
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapDoctorFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadDoctors')),
    };
  }
}

/** Doctors are addressed by clinic slug, the same identifier used in the URL. */
export async function getDoctorsByClinic(slug: string): Promise<ServiceResponse<Doctor[]>> {
  if (!slug) return { success: true, data: [] };

  if (USE_MOCK_DATA) {
    await mockDelay();
    const clinic = loadClinics().find((item) => item.slug === slug);
    return {
      success: true,
      data: clinic ? loadDoctors().filter((doctor) => doctor.clinicId === clinic.id) : [],
    };
  }

  try {
    const response = await getApiClient().get(`/api/doctors/getByClinic/${slug}`);
    const items = Array.isArray(response.data) ? response.data : [];
    return { success: true, data: items.map(mapDoctorFromApi) };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, translate('errLoadTeam')),
    };
  }
}

/** Used by the admin edit form, which addresses a doctor by its stable id. */
export async function getDoctorById(id: string): Promise<ServiceResponse<Doctor>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const doctor = loadDoctors().find((item) => item.id === id);
    return doctor
      ? { success: true, data: doctor }
      : { success: false, error: translate('errDoctorNotFound') };
  }

  try {
    const response = await getApiClient().get(`/api/doctors/getById/${id}`);
    return { success: true, data: mapDoctorFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errDoctorNotFound')) };
  }
}

// ─── Write ──────────────────────────────────────────────────────

/** Admin-only: adds a doctor to a clinic's team. */
export async function createDoctor(input: DoctorInputDTO): Promise<ServiceResponse<Doctor>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const doctors = loadDoctors();
    if (isNameTaken(doctors, input)) {
      return { success: false, error: translate('errDoctorNameTaken') };
    }

    const doctor: Doctor = {
      id: `dr-${createId()}`,
      name: input.name.trim(),
      specialtySlug: input.specialtySlug,
      clinicId: input.clinicId,
      yearsOfExperience: input.yearsOfExperience,
      // Ratings come from patient reviews, so a new doctor starts without one.
      rating: 0,
      initials: getInitials(input.name),
    };

    writeStoredDoctors([...doctors, doctor]);
    return { success: true, data: doctor };
  }

  try {
    const response = await getApiClient().post('/api/doctors/create', input);
    return { success: true, data: mapDoctorFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errSaveChangesGeneric')) };
  }
}

/** Admin-only: replaces a doctor's editable fields, keeping the earned rating. */
export async function updateDoctor(
  id: string,
  input: DoctorInputDTO,
): Promise<ServiceResponse<Doctor>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const doctors = loadDoctors();
    const index = doctors.findIndex((item) => item.id === id);
    if (index === -1) return { success: false, error: translate('errDoctorNotFound') };

    if (isNameTaken(doctors, input, id)) {
      return { success: false, error: translate('errDoctorNameTaken') };
    }

    const updated: Doctor = {
      ...doctors[index],
      name: input.name.trim(),
      specialtySlug: input.specialtySlug,
      clinicId: input.clinicId,
      yearsOfExperience: input.yearsOfExperience,
      initials: getInitials(input.name),
    };

    const next = [...doctors];
    next[index] = updated;
    writeStoredDoctors(next);
    return { success: true, data: updated };
  }

  try {
    const response = await getApiClient().put(`/api/doctors/update/${id}`, input);
    return { success: true, data: mapDoctorFromApi(response.data) };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errSaveChangesGeneric')) };
  }
}

/** Admin-only: removes a doctor, unless patients are still booked with them. */
export async function deleteDoctor(id: string): Promise<ServiceResponse<void>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const doctors = loadDoctors();
    if (!doctors.some((doctor) => doctor.id === id)) {
      return { success: false, error: translate('errDoctorNotFound') };
    }

    // Deleting a doctor with live bookings would leave those appointments
    // pointing at nothing, so the admin has to cancel them first.
    const activeBookings = loadAppointments().filter(
      (appointment) => appointment.doctorId === id && appointment.status !== 'cancelled',
    ).length;

    if (activeBookings > 0) {
      return {
        success: false,
        error: translate('errDoctorHasAppointments').replace('{count}', String(activeBookings)),
      };
    }

    writeStoredDoctors(doctors.filter((doctor) => doctor.id !== id));
    return { success: true };
  }

  try {
    await getApiClient().delete(`/api/doctors/delete/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractServiceError(error, translate('errDeleteDoctorGeneric')) };
  }
}
