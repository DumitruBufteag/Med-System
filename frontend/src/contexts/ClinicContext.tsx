import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Clinic, Specialty } from '../types';
import { getClinics, getSpecialties } from '../services';

interface ClinicContextType {
  /** The whole catalogue. Pages narrow it down with `applyClinicFilters`. */
  clinics: Clinic[];
  specialties: Specialty[];
  /** Specialty slug → display name, for components that only store slugs. */
  specialtyNames: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

/**
 * Loads the catalogue once and keeps it available to every page.
 * Filtering stays in the pages (see `services/filterService`) so a filter
 * change does not trigger a refetch — once the API is live, swap the call in
 * `load` for a server-side query and the pages keep working unchanged.
 */
export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialtyNames, setSpecialtyNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isCurrent: () => boolean = () => true) => {
    const [clinicResult, specialtyResult] = await Promise.all([
      getClinics(),
      getSpecialties(),
    ]);

    // A newer request may have started while this one was in flight.
    if (!isCurrent()) return;

    if (clinicResult.success) {
      setClinics(clinicResult.data ?? []);
      setError(null);
    } else {
      setError(clinicResult.error ?? 'Nu am putut încărca clinicile.');
    }

    if (specialtyResult.success) {
      const items = specialtyResult.data ?? [];
      setSpecialties(items);
      setSpecialtyNames(Object.fromEntries(items.map((item) => [item.slug, item.name])));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    // Fetching on mount is exactly what this effect is for; the state updates
    // happen after the request resolves, and a stale response is discarded by
    // the guard inside `load`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(() => isCurrent);

    return () => {
      isCurrent = false;
    };
  }, [load]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    return load();
  }, [load]);

  return (
    <ClinicContext.Provider
      value={{ clinics, specialties, specialtyNames, isLoading, error, refresh }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinics() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinics must be used within a ClinicProvider');
  }
  return context;
}
