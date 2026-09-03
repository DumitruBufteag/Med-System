import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import type { City, Clinic, ClinicFilters, ClinicType } from '../types';
import { CLINIC_TYPE_LABELS } from '../types';
import { applyClinicFilters, paginate, sortItems } from '../services';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn, formatPrice } from '../lib/utils';
import SearchBar from '../components/ui/SearchBar';
import Dropdown from '../components/ui/Dropdown';
import ClinicCard from '../components/ui/ClinicCard';
import ClinicFiltersPanel from '../components/ui/ClinicFiltersPanel';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

type SortOption = 'rating' | 'price-asc' | 'price-desc' | 'name';

const PAGE_SIZE = 9;

/**
 * The URL is the single source of truth for this page, so a filtered result
 * list can be shared or reloaded without losing the selection.
 */
function readFilters(params: URLSearchParams): ClinicFilters {
  const rating = Number(params.get('rating'));
  const price = Number(params.get('pret'));

  return {
    query: params.get('q') ?? '',
    city: (params.get('oras') as City | null) ?? 'all',
    type: (params.get('tip') as ClinicType | null) ?? 'all',
    specialtySlug: params.get('specialitate') ?? undefined,
    minRating: rating > 0 ? rating : undefined,
    maxPrice: price > 0 ? price : undefined,
    openNow: params.get('deschis') === '1' ? true : undefined,
    hasEmergency: params.get('urgente') === '1' ? true : undefined,
  };
}

/** Maps a filter key onto the query-string parameter that carries it. */
const paramNames: Record<keyof ClinicFilters, string> = {
  query: 'q',
  city: 'oras',
  type: 'tip',
  specialtySlug: 'specialitate',
  minRating: 'rating',
  maxPrice: 'pret',
  openNow: 'deschis',
  hasEmergency: 'urgente',
};

export default function ClinicsPage() {
  const { t } = useLanguage();
  const { clinics, specialties, specialtyNames, isLoading, error, refresh } = useClinics();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const sort = (searchParams.get('sort') as SortOption | null) ?? 'rating';
  const page = Math.max(1, Number(searchParams.get('pagina')) || 1);

  const priceCeiling = useMemo(() => {
    const highest = clinics.reduce((max, clinic) => Math.max(max, clinic.consultationFrom), 0);
    // Round up to the next 100 so the slider ends on a clean number.
    return highest > 0 ? Math.ceil(highest / 100) * 100 : 1000;
  }, [clinics]);

  const results = useMemo(() => {
    const filtered = applyClinicFilters(clinics, filters);
    return sortClinics(filtered, sort);
  }, [clinics, filters, sort]);

  const pageResult = useMemo(() => paginate(results, page, PAGE_SIZE), [results, page]);

  /** Writes one parameter and resets pagination, since the result set changed. */
  function setParam(name: string, value: string | undefined) {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === 'all') {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    next.delete('pagina');
    setSearchParams(next);
  }

  function handleFilterChange<K extends keyof ClinicFilters>(key: K, value: ClinicFilters[K]) {
    if (typeof value === 'boolean') {
      setParam(paramNames[key], value ? '1' : undefined);
      return;
    }
    setParam(paramNames[key], value === undefined ? undefined : String(value));
  }

  function handleSearch(query: string, city: City | 'all') {
    const next = new URLSearchParams(searchParams);
    if (query) next.set('q', query);
    else next.delete('q');
    if (city !== 'all') next.set('oras', city);
    else next.delete('oras');
    next.delete('pagina');
    setSearchParams(next);
  }

  function resetFilters() {
    setSearchParams(new URLSearchParams());
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set('pagina', String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeChips = buildActiveChips(filters, specialtyNames, t);

  const sortOptions = [
    { value: 'rating', label: t('sortRating') },
    { value: 'price-asc', label: t('sortPriceAsc') },
    { value: 'price-desc', label: t('sortPriceDesc') },
    { value: 'name', label: t('sortName') },
  ];

  return (
    <>
      {/* ─── Page header ───────────────────────────────────── */}
      <section className="border-b border-surface-200 bg-gradient-to-b from-primary-50 to-white py-12 dark:border-surface-800 dark:from-primary-950/40 dark:to-surface-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
            {t('clinicsPageTitle')}
          </h1>
          <p className="mt-3 max-w-2xl text-surface-500 dark:text-surface-400">
            {t('clinicsPageSubtitle')}
          </p>

          <div className="mt-7">
            <SearchBar
              key={`${filters.query}-${filters.city}`}
              initialQuery={filters.query}
              initialCity={filters.city}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* ─── Results ───────────────────────────────────────── */}
      <section className="py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <aside className={cn('lg:block', showFilters ? 'block' : 'hidden')}>
            <div className="lg:sticky lg:top-24">
              <ClinicFiltersPanel
                filters={filters}
                specialties={specialties}
                priceCeiling={priceCeiling}
                onChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters((open) => !open)}
                  className="btn-secondary lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  {showFilters ? t('hideFilters') : t('showFilters')}
                </button>

                <p className="text-sm text-surface-500 dark:text-surface-400">
                  <strong className="font-bold text-surface-900 dark:text-white">
                    {results.length}
                  </strong>{' '}
                  {results.length === 1 ? t('oneResultFound') : t('resultsFound')}
                </p>
              </div>

              <Dropdown
                className="w-56"
                label={t('sortBy')}
                value={sort}
                options={sortOptions}
                onChange={(value) => setParam('sort', value)}
              />
            </div>

            {activeChips.length > 0 && (
              <ul className="mb-5 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange(chip.key, undefined)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 py-1 pl-3 pr-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
                    >
                      {chip.label}
                      <X size={13} />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-2 text-xs font-semibold text-surface-500 underline-offset-2 hover:underline dark:text-surface-400"
                  >
                    {t('clearAll')}
                  </button>
                </li>
              </ul>
            )}

            {error ? (
              <ErrorState
                title={t('errorTitle')}
                message={error}
                onRetry={() => void refresh()}
                retryLabel={t('retry')}
              />
            ) : isLoading ? (
              <Spinner className="py-24" label={t('loading')} />
            ) : pageResult.items.length === 0 ? (
              <EmptyState
                title={t('emptyTitle')}
                description={t('emptyDescription')}
                action={
                  <button type="button" className="btn-primary" onClick={resetFilters}>
                    {t('clearAll')}
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pageResult.items.map((clinic) => (
                    <ClinicCard
                      key={clinic.id}
                      clinic={clinic}
                      specialtyNames={specialtyNames}
                    />
                  ))}
                </div>

                <Pagination
                  page={pageResult.page}
                  totalPages={pageResult.totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function sortClinics(clinics: Clinic[], sort: SortOption): Clinic[] {
  switch (sort) {
    case 'price-asc':
      return sortItems(clinics, { field: 'consultationFrom', direction: 'asc' });
    case 'price-desc':
      return sortItems(clinics, { field: 'consultationFrom', direction: 'desc' });
    case 'name':
      return sortItems(clinics, { field: 'name', direction: 'asc' });
    case 'rating':
    default:
      return sortItems(clinics, { field: 'rating', direction: 'desc' });
  }
}

interface ActiveChip {
  key: keyof ClinicFilters;
  label: string;
}

/** Builds the removable chips shown above the results. */
function buildActiveChips(
  filters: ClinicFilters,
  specialtyNames: Record<string, string>,
  t: (key: 'onlyOpenNow' | 'onlyEmergency') => string,
): ActiveChip[] {
  const chips: ActiveChip[] = [];

  if (filters.query) chips.push({ key: 'query', label: `„${filters.query}"` });
  if (filters.city && filters.city !== 'all') chips.push({ key: 'city', label: filters.city });
  if (filters.type && filters.type !== 'all') {
    chips.push({ key: 'type', label: CLINIC_TYPE_LABELS[filters.type] });
  }
  if (filters.specialtySlug) {
    chips.push({
      key: 'specialtySlug',
      label: specialtyNames[filters.specialtySlug] ?? filters.specialtySlug,
    });
  }
  if (filters.minRating) chips.push({ key: 'minRating', label: `${filters.minRating}+` });
  if (filters.maxPrice) {
    chips.push({ key: 'maxPrice', label: `≤ ${formatPrice(filters.maxPrice)}` });
  }
  if (filters.openNow) chips.push({ key: 'openNow', label: t('onlyOpenNow') });
  if (filters.hasEmergency) chips.push({ key: 'hasEmergency', label: t('onlyEmergency') });

  return chips;
}
