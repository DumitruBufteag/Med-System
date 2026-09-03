import { isAxiosError } from 'axios';
import type { Clinic, Doctor, Specialty } from '../types';

/** Pulls a readable message out of an axios error, with a safe fallback. */
export function extractServiceError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/** Maps a clinic returned by the API onto the shape used by the UI. */
export function mapClinicFromApi(raw: Record<string, unknown>): Clinic {
  return raw as unknown as Clinic;
}

/** Maps a specialty returned by the API onto the shape used by the UI. */
export function mapSpecialtyFromApi(raw: Record<string, unknown>): Specialty {
  return raw as unknown as Specialty;
}

/** Maps a doctor returned by the API onto the shape used by the UI. */
export function mapDoctorFromApi(raw: Record<string, unknown>): Doctor {
  return raw as unknown as Doctor;
}
