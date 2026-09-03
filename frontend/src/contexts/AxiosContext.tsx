import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import { createApiClient, setApiClient } from '../services/httpClient';
import { STORAGE_KEYS } from '../types';

interface AxiosContextType {
  apiClient: AxiosInstance;
}

const AxiosContext = createContext<AxiosContextType | undefined>(undefined);

/**
 * Owns the single axios instance used by every service and keeps the
 * Authorization header in sync with the stored JWT.
 */
export function AxiosProvider({ children }: { children: ReactNode }) {
  const apiClient = useMemo(() => {
    const client = createApiClient();

    client.interceptors.request.use((config) => {
      const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return client;
  }, []);

  useEffect(() => {
    setApiClient(apiClient);
  }, [apiClient]);

  return <AxiosContext.Provider value={{ apiClient }}>{children}</AxiosContext.Provider>;
}

export function useAxios() {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context;
}
