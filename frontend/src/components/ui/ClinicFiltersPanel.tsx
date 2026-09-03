import { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import type { ClinicFilters, Specialty } from '../../types';
import { CITIES, CLINIC_TYPE_LABELS } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import Dropdown from './Dropdown';

interface ClinicFiltersPanelProps {
  filters: ClinicFilters;
  specialties: Specialty[];
  /** Highest consultation price in the catalogue, used as the slider ceiling. */
  priceCeiling: number;
  onChange: <K extends keyof ClinicFilters>(key: K, value: ClinicFilters[K]) => void;
  onReset: () => void;
}

export default function ClinicFiltersPanel({
  filters,
  specialties,
  priceCeiling,
  onChange,
  onReset,
}: ClinicFiltersPanelProps) {
  const { t } = useLanguage();

  const cityOptions = useMemo(
    () => [
      { value: 'all', label: t('allCities') },
      ...CITIES.map((city) => ({ value: city, label: city })),
    ],
    [t],
  );

  const typeOptions = useMemo(
    () => [
      { value: 'all', label: t('allTypes') },
      ...Object.entries(CLINIC_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    ],
    [t],
  );

  const specialtyOptions = useMemo(
    () => [
      { value: 'all', label: t('allSpecialties') },
      ...specialties.map((specialty) => ({ value: specialty.slug, label: specialty.name })),
    ],
    [specialties, t],
  );

  const ratingOptions = useMemo(
    () => [
      { value: '0', label: t('anyRating') },
      { value: '4', label: '4.0+' },
      { value: '4.5', label: '4.5+' },
      { value: '4.8', label: '4.8+' },
    ],
    [t],
  );

  const maxPrice = filters.maxPrice ?? priceCeiling;

  return (
    <div className="card p-5">
      <header className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-surface-900 dark:text-white">{t('filters')}</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
        >
          <RotateCcw size={14} />
          {t('resetFilters')}
        </button>
      </header>

      <div className="space-y-4">
        <div>
          <span className="label">{t('city')}</span>
          <Dropdown
            label={t('city')}
            value={filters.city ?? 'all'}
            options={cityOptions}
            onChange={(value) => onChange('city', value as ClinicFilters['city'])}
          />
        </div>

        <div>
          <span className="label">{t('clinicType')}</span>
          <Dropdown
            label={t('clinicType')}
            value={filters.type ?? 'all'}
            options={typeOptions}
            onChange={(value) => onChange('type', value as ClinicFilters['type'])}
          />
        </div>

        <div>
          <span className="label">{t('specialty')}</span>
          <Dropdown
            label={t('specialty')}
            value={filters.specialtySlug ?? 'all'}
            options={specialtyOptions}
            onChange={(value) => onChange('specialtySlug', value === 'all' ? undefined : value)}
          />
        </div>

        <div>
          <span className="label">{t('minRating')}</span>
          <Dropdown
            label={t('minRating')}
            value={String(filters.minRating ?? 0)}
            options={ratingOptions}
            onChange={(value) =>
              onChange('minRating', Number(value) === 0 ? undefined : Number(value))
            }
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {t('maxPrice')}
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={priceCeiling}
            step={50}
            value={maxPrice}
            aria-label={t('maxPrice')}
            onChange={(event) => onChange('maxPrice', Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-200 accent-primary-600 dark:bg-surface-700"
          />
        </div>

        <fieldset className="space-y-2.5 border-t border-surface-200 pt-4 dark:border-surface-800">
          <legend className="sr-only">{t('filters')}</legend>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={filters.openNow ?? false}
              onChange={(event) => onChange('openNow', event.target.checked || undefined)}
              className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('onlyOpenNow')}
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={filters.hasEmergency ?? false}
              onChange={(event) => onChange('hasEmergency', event.target.checked || undefined)}
              className="h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('onlyEmergency')}
          </label>
        </fieldset>
      </div>
    </div>
  );
}
