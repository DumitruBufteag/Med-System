import type { Appointment, CreateAppointmentDTO, ServiceResponse } from '../types';
import { STORAGE_KEYS } from '../types';
import { extractServiceError } from './apiMappers';
import { getApiClient } from './httpClient';
import { USE_MOCK_DATA, mockDelay } from './config';

/** Slots a clinic offers in a day, before removing the taken ones. */
export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
] as const;

// ─── Local store (mock mode) ────────────────────────────────────

function readAppointments(): Appointment[] {
  const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Appointment[]) : [];
  } catch {
    return [];
  }
}

function writeAppointments(appointments: Appointment[]): void {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

/**
 * Stable pseudo-random busy slots, so the same doctor and date always show the
 * same availability instead of reshuffling on every render.
 */
function seededBusySlots(doctorId: string, date: string): string[] {
  const key = `${doctorId}|${date}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return TIME_SLOTS.filter((_, index) => ((hash >>> index) & 1) === 1);
}

// ─── Public API ─────────────────────────────────────────────────

/** Slots already booked for a doctor on a given day. */
export async function getTakenSlots(
  doctorId: string,
  date: string,
): Promise<ServiceResponse<string[]>> {
  if (!doctorId || !date) return { success: true, data: [] };

  if (USE_MOCK_DATA) {
    await mockDelay(150);

    const booked = readAppointments()
      .filter(
        (appointment) =>
          appointment.doctorId === doctorId &&
          appointment.date === date &&
          appointment.status !== 'cancelled',
      )
      .map((appointment) => appointment.time);

    return { success: true, data: [...new Set([...seededBusySlots(doctorId, date), ...booked])] };
  }

  try {
    const response = await getApiClient().get('/api/appointments/getTakenSlots', {
      params: { doctorId, date },
    });
    return { success: true, data: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca orele disponibile.'),
    };
  }
}

export async function createAppointment(
  patientId: string,
  dto: CreateAppointmentDTO,
): Promise<ServiceResponse<Appointment>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const appointments = readAppointments();
    const isTaken = appointments.some(
      (appointment) =>
        appointment.doctorId === dto.doctorId &&
        appointment.date === dto.date &&
        appointment.time === dto.time &&
        appointment.status !== 'cancelled',
    );

    if (isTaken) {
      return { success: false, error: 'Ora aleasă tocmai a fost rezervată. Alege alta.' };
    }

    const appointment: Appointment = {
      id: `apt-${Date.now().toString(36)}`,
      patientId,
      clinicId: dto.clinicId,
      doctorId: dto.doctorId,
      date: dto.date,
      time: dto.time,
      status: 'confirmed',
      notes: dto.notes,
    };

    writeAppointments([...appointments, appointment]);
    return { success: true, data: appointment };
  }

  try {
    const response = await getApiClient().post('/api/appointments/create', dto);
    return { success: true, data: response.data as Appointment };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut înregistra programarea.'),
    };
  }
}

export async function cancelAppointment(id: string): Promise<ServiceResponse<Appointment>> {
  if (USE_MOCK_DATA) {
    await mockDelay();

    const appointments = readAppointments();
    const target = appointments.find((appointment) => appointment.id === id);

    if (!target) return { success: false, error: 'Programarea nu a fost găsită.' };

    const cancelled: Appointment = { ...target, status: 'cancelled' };
    writeAppointments(
      appointments.map((appointment) => (appointment.id === id ? cancelled : appointment)),
    );

    return { success: true, data: cancelled };
  }

  try {
    const response = await getApiClient().put(`/api/appointments/cancel/${id}`);
    return { success: true, data: response.data as Appointment };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut anula programarea.'),
    };
  }
}

export async function getAppointmentsByPatient(
  patientId: string,
): Promise<ServiceResponse<Appointment[]>> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const appointments = readAppointments()
      .filter((appointment) => appointment.patientId === patientId)
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

    return { success: true, data: appointments };
  }

  try {
    const response = await getApiClient().get(`/api/appointments/getByPatient/${patientId}`);
    return { success: true, data: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    return {
      success: false,
      error: extractServiceError(error, 'Nu am putut încărca programările.'),
    };
  }
}
