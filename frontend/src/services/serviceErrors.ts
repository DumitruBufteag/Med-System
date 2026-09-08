import { isAxiosError } from 'axios';
import { translate } from '../i18n';

/** HTTP-like statuses the interface reacts to, mirrored by the mock services. */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Thrown by the services so callers can branch on the status, not the message.
 *
 * The axios response interceptor rejects with one of these too, so a page sees
 * the same error shape whether the failure came from a mock service or from the
 * API — which is what lets `getErrorStatus` stay this simple.
 */
export class ServiceError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

/** Reads the status out of a thrown service or axios error, when there is one. */
export function getErrorStatus(error: unknown): number | null {
  if (error instanceof ServiceError) return error.status;
  if (isAxiosError(error) && error.response) return error.response.status;
  return null;
}

/** The error body the API returns on every non-2xx response. */
interface ApiErrorBody {
  status?: number;
  message?: string;
  error?: string;
}

/**
 * Turns whatever axios rejected with into a `ServiceError` carrying the status
 * and the server's own message.
 *
 * A request that never reached the server (the API is down, the network dropped)
 * has no response at all, and is reported as a 500 — from the caller's point of
 * view "the backend did not answer" and "the backend failed" need the same screen.
 */
export function toServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceError) return error;

  if (isAxiosError(error)) {
    const response = error.response;

    if (!response) {
      return new ServiceError(HTTP_STATUS.SERVER_ERROR, translate('err500ServiceMessage'));
    }

    const body = response.data as ApiErrorBody | undefined;
    const message = body?.message ?? body?.error ?? error.message;

    return new ServiceError(response.status, message);
  }

  const message = error instanceof Error ? error.message : String(error);
  return new ServiceError(HTTP_STATUS.SERVER_ERROR, message);
}
