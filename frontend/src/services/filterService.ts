import type { Clinic, ClinicFilters } from '../types';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Case- and diacritic-insensitive text search across the given fields. */
export function searchByText<T>(items: T[], query: string, fields: (keyof T)[]): T[] {
  const needle = normalise(query);
  if (!needle) return items;

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (Array.isArray(value)) return value.some((entry) => normalise(String(entry)).includes(needle));
      return normalise(String(value ?? '')).includes(needle);
    }),
  );
}

/** Sorts a copy of `items` by the given field and direction. */
export function sortItems<T>(items: T[], config: SortConfig<T>): T[] {
  const factor = config.direction === 'asc' ? 1 : -1;

  return [...items].sort((a, b) => {
    const left = a[config.field];
    const right = b[config.field];
    if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
    return String(left).localeCompare(String(right), 'ro') * factor;
  });
}

/** Splits `items` into pages and returns the requested one. */
export function paginate<T>(items: T[], page = 1, pageSize = 9): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    totalItems: items.length,
    totalPages,
  };
}

/**
 * Applies every catalogue filter in one pass.
 * Kept here so the same logic serves both the mock data and a future
 * client-side refinement of results returned by the API.
 */
export function applyClinicFilters(clinics: Clinic[], filters: ClinicFilters): Clinic[] {
  let result = clinics;

  if (filters.query) {
    result = searchByText(result, filters.query, ['name', 'address', 'city', 'specialties']);
  }
  if (filters.city && filters.city !== 'all') {
    result = result.filter((clinic) => clinic.city === filters.city);
  }
  if (filters.type && filters.type !== 'all') {
    result = result.filter((clinic) => clinic.type === filters.type);
  }
  if (filters.specialtySlug) {
    result = result.filter((clinic) => clinic.specialties.includes(filters.specialtySlug!));
  }
  if (filters.minRating !== undefined) {
    result = result.filter((clinic) => clinic.rating >= filters.minRating!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((clinic) => clinic.consultationFrom <= filters.maxPrice!);
  }
  if (filters.openNow) {
    result = result.filter((clinic) => clinic.workingHours.isOpenNow);
  }
  if (filters.hasEmergency) {
    result = result.filter((clinic) => clinic.hasEmergency);
  }

  return result;
}

/** Lowercases and strips diacritics so "Chișinău" matches "chisinau". */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
