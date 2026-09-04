import { useEffect, useState } from 'react';
import type { ServiceResponse } from '../types';
import { translate } from '../i18n';

interface ServiceDataState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
}

/**
 * Runs a service call and exposes its result as loading / data / error.
 *
 * `load` must be memoised by the caller (useCallback), because it is the
 * effect's only dependency. A response that arrives after the inputs changed
 * is discarded, so the state always matches the latest request.
 */
export function useServiceData<T>(load: () => Promise<ServiceResponse<T>>): ServiceDataState<T> {
  const [state, setState] = useState<ServiceDataState<T>>({
    data: undefined,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;

    // Fetching is the whole purpose of this effect; the state update happens
    // after the promise resolves and stale responses are dropped above.
    void load().then((result) => {
      if (!isCurrent) return;

      setState({
        data: result.data,
        isLoading: false,
        error: result.success ? null : (result.error ?? translate('errUnexpected')),
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [load]);

  return state;
}
