// ─── Services – barrel export ───────────────────────────────────
// Central re-export so consumers can do:
//   import { getClinics, getSpecialties, applyClinicFilters } from '@/services';
// ────────────────────────────────────────────────────────────────

export { loginUser, registerUser, logoutUser, restoreSession } from './authService';

export { updateProfile, changePassword } from './userService';

export { getClinics, getFeaturedClinics, getClinicBySlug } from './clinicService';

export { getSpecialties } from './specialtyService';

export { getDoctors, getDoctorsByClinic } from './doctorService';

export { getReviewsByClinic } from './reviewService';

export {
  createAppointment,
  cancelAppointment,
  getAppointmentsByPatient,
  getTakenSlots,
  TIME_SLOTS,
} from './appointmentService';

export {
  searchByText,
  sortItems,
  paginate,
  applyClinicFilters,
} from './filterService';

export { getApiClient, setApiClient, createApiClient, apiBaseUrl } from './httpClient';

export { USE_MOCK_DATA } from './config';

// Re-export service-specific types for convenience
export type { AuthResult } from './authService';
export type { SortDirection, SortConfig, PaginatedResult } from './filterService';
