// ─── Services – barrel export ───────────────────────────────────
// Central re-export so consumers can do:
//   import { getClinics, getSpecialties, applyClinicFilters } from '@/services';
// ────────────────────────────────────────────────────────────────

export {
  loginUser,
  registerUser,
  logoutUser,
  restoreSession,
  fetchCurrentUser,
} from './authService';

export {
  decodeToken,
  isExpired,
  millisecondsUntilExpiry,
  readStoredToken,
  readStoredClaims,
} from './jwt';

export { updateProfile, changePassword, getAllUsers, deleteUser } from './userService';

export {
  getClinics,
  getFeaturedClinics,
  getClinicBySlug,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic,
} from './clinicService';

export { getSpecialties } from './specialtyService';

export {
  getDoctors,
  getDoctorsByClinic,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from './doctorService';

export { getReviewsByClinic } from './reviewService';

export {
  createAppointment,
  cancelAppointment,
  getAppointmentsByPatient,
  getAllAppointments,
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
export type { JwtClaims } from './jwt';
export type { SortDirection, SortConfig, PaginatedResult } from './filterService';
