// ─── Domain Types ───────────────────────────────────────────────

/** Allowed user roles in the application. */
export type UserRole = 'patient' | 'clinic' | 'admin';

/** Type of medical institution listed in the catalogue. */
export type ClinicType =
  | 'hospital'
  | 'medical_center'
  | 'specialized_clinic'
  | 'laboratory';

/** Cities covered by the catalogue. */
export type City =
  | 'Chișinău'
  | 'Bălți'
  | 'Cahul'
  | 'Orhei'
  | 'Ungheni'
  | 'Comrat';

/** Status of an appointment request. */
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';

/** Represents a registered user in the system. */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

/** A medical specialty (e.g. Cardiology) used for filtering. */
export interface Specialty {
  id: string;
  /** Stable slug used in URLs and filters. */
  slug: string;
  name: string;
  /** Name of the lucide-react icon rendered for this specialty. */
  icon: string;
  doctorsCount: number;
}

/** A block of opening hours, e.g. Mon–Fri 08:00–19:00. */
export interface WorkingHoursPeriod {
  /** Days this period applies to: 0 = Sunday … 6 = Saturday. */
  days: number[];
  /** 24h "HH:mm" time the clinic opens. */
  start: string;
  /** 24h "HH:mm" time the clinic closes. */
  end: string;
}

/** Opening hours of a clinic. `isOpenNow` is derived live from the viewer's clock. */
export interface WorkingHours {
  /** e.g. "Lun–Vin, 08:00–20:00" or "Non-stop, 24/7" */
  label: string;
  /** True for a clinic that never closes (e.g. round-the-clock emergency hospital). */
  alwaysOpen?: boolean;
  /** Time ranges the clinic is open, used to compute the live open/closed status. */
  periods?: WorkingHoursPeriod[];
}

/** A private clinic or hospital listed in the catalogue. */
export interface Clinic {
  id: string;
  slug: string;
  name: string;
  type: ClinicType;
  city: City;
  address: string;
  phone: string;
  website?: string;
  description: string;
  rating: number;
  reviewsCount: number;
  /** Specialty slugs offered by this clinic. */
  specialties: string[];
  /** Lowest consultation price, in MDL. */
  consultationFrom: number;
  workingHours: WorkingHours;
  hasEmergency: boolean;
  acceptsInsurance: boolean;
  /** Brand colour used behind the logo and on the cover. */
  brandColor: string;
  /** Official logo. Falls back to `initials` when missing. */
  logo?: string;
  initials: string;
}

/** A doctor working at one of the listed clinics. */
export interface Doctor {
  id: string;
  name: string;
  specialtySlug: string;
  clinicId: string;
  yearsOfExperience: number;
  rating: number;
  initials: string;
}

/** An appointment booked by a patient. */
export interface Appointment {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Time slot in "HH:mm" format. */
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

/** A patient review left for a clinic. */
export interface Review {
  id: string;
  clinicId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/** Aggregated numbers shown on the landing page. */
export interface CatalogStats {
  clinicsCount: number;
  doctorsCount: number;
  specialtiesCount: number;
  citiesCount: number;
}

// ─── Service Types ──────────────────────────────────────────────

/**
 * Standard response wrapper used by all service functions.
 * Mirrors a typical REST API response shape.
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Result returned by authentication operations (login / register). */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/** Filters applied when searching the clinic catalogue. */
export interface ClinicFilters {
  /** Free-text query matched against name, address and specialties. */
  query?: string;
  city?: City | 'all';
  type?: ClinicType | 'all';
  specialtySlug?: string;
  minRating?: number;
  maxPrice?: number;
  openNow?: boolean;
  hasEmergency?: boolean;
}

// ─── Data Transfer Objects (DTOs) ───────────────────────────────

/** Payload required to book an appointment. */
export interface CreateAppointmentDTO {
  clinicId: string;
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
}

/** Payload for updating an existing appointment (all fields optional). */
export interface UpdateAppointmentDTO extends Partial<CreateAppointmentDTO> {
  status?: AppointmentStatus;
}

/** Payload required to create an account. */
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/** Payload for editing the signed-in user's own profile. */
export interface UpdateProfileDTO {
  name: string;
  email: string;
  phone?: string;
}

/** Payload for changing the signed-in user's password. */
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

/** Payload required to submit a review. */
export interface CreateReviewDTO {
  clinicId: string;
  rating: number;
  comment: string;
}

/** Simplified weekly schedule captured by the admin clinic form. */
export interface ClinicScheduleInput {
  alwaysOpen: boolean;
  weekdayStart: string;
  weekdayEnd: string;
  saturdayEnabled: boolean;
  saturdayStart: string;
  saturdayEnd: string;
}

/** Payload required to create or fully replace a clinic from the admin panel. */
export interface ClinicInputDTO {
  name: string;
  type: ClinicType;
  city: City;
  address: string;
  phone: string;
  website?: string;
  description: string;
  consultationFrom: number;
  hasEmergency: boolean;
  acceptsInsurance: boolean;
  /** Specialty slugs offered by this clinic. */
  specialties: string[];
  brandColor: string;
  schedule: ClinicScheduleInput;
}

// ─── Constants ──────────────────────────────────────────────────

/** Every clinic type, in display order. */
export const CLINIC_TYPES: ClinicType[] = [
  'hospital',
  'medical_center',
  'specialized_clinic',
  'laboratory',
];

/** Every city covered by the catalogue, in display order. */
export const CITIES: City[] = [
  'Chișinău',
  'Bălți',
  'Cahul',
  'Orhei',
  'Ungheni',
  'Comrat',
];

/**
 * Centralised localStorage key map.
 * Prevents typos and makes it easy to find every persistence point.
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  JWT_TOKEN: 'jwt_token',
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  CLINICS: 'clinics',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches',
  FAVOURITE_CLINICS: 'favouriteClinics',
} as const;
