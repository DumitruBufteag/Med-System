/**
 * While the backend is not implemented yet, services resolve from the local
 * mock dataset. Set `VITE_USE_MOCK_DATA=false` once the API is running to make
 * every service hit the real endpoints instead.
 */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/** Simulates network latency so loading states are exercised in development. */
export function mockDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
