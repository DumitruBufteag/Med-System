import type { Clinic, Doctor, Specialty } from '../types';
import { toServiceError } from './serviceErrors';

import medparkLogo from '../assets/logos/medpark.svg';
import terramedLogo from '../assets/logos/terramed.png';
import repromedLogo from '../assets/logos/repromed.svg';
import excellenceLogo from '../assets/logos/excellence.png';
import santeLogo from '../assets/logos/sante.svg';
import terradentLogo from '../assets/logos/terradent.png';

/** Pulls a readable message out of a failed request, with a safe fallback. */
export function extractServiceError(error: unknown, fallback: string): string {
  const serviceError = toServiceError(error);
  return serviceError.message || fallback;
}

/**
 * Logos are bundled with the frontend, not stored in the database: they are
 * artwork owned by each clinic, versioned with the interface that renders them.
 * The API returns no `logo`, so it is matched back on by slug here — a clinic
 * added from the admin panel simply has none, and `ClinicLogo` falls back to
 * its initials on the brand colour.
 */
const CLINIC_LOGOS: Record<string, string> = {
  medpark: medparkLogo,
  terramed: terramedLogo,
  repromed: repromedLogo,
  excellence: excellenceLogo,
  'clinica-sante-balti': santeLogo,
  terradent: terradentLogo,
};

/** Maps a clinic returned by the API onto the shape used by the UI. */
export function mapClinicFromApi(raw: Record<string, unknown>): Clinic {
  const clinic = raw as unknown as Clinic;

  return {
    ...clinic,
    logo: clinic.logo ?? CLINIC_LOGOS[clinic.slug],
  };
}

/** Maps a specialty returned by the API onto the shape used by the UI. */
export function mapSpecialtyFromApi(raw: Record<string, unknown>): Specialty {
  return raw as unknown as Specialty;
}

/** Maps a doctor returned by the API onto the shape used by the UI. */
export function mapDoctorFromApi(raw: Record<string, unknown>): Doctor {
  return raw as unknown as Doctor;
}
