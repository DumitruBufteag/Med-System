import { STORAGE_KEYS } from '../types';
import { translate } from '../i18n';
import { HTTP_STATUS, ServiceError } from './serviceErrors';

/**
 * Every service goes through axios to the API by default.
 *
 * Setting `VITE_USE_MOCK_DATA=true` sends them back to `src/data/mockData.ts`
 * instead, which is what lets the interface be demonstrated with no backend
 * running. Both branches keep the same signatures, so nothing above the service
 * layer can tell the difference.
 */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/** Simulates network latency so loading states are exercised in development. */
export function mockDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Emulates a backend that is down, so the 500 path can be exercised without a
 * real server. Flip it from the browser console:
 * `localStorage.setItem('simulateServerError', 'true')`.
 */
export function isServerErrorSimulated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.SIMULATE_SERVER_ERROR) === 'true';
  } catch {
    return false;
  }
}

/** Throws a 500 from a mock service while the simulation flag is on. */
export function simulateBackendFailure(): void {
  if (isServerErrorSimulated()) {
    throw new ServiceError(HTTP_STATUS.SERVER_ERROR, translate('err500ServiceMessage'));
  }
}
