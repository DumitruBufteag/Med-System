import { useMemo, useState } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import SpecialtyCard from '../components/ui/SpecialtyCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

export default function SpecialtiesPage() {
  const { t } = useLanguage();
  const { specialties, isLoading, error, refresh } = useClinics();
  const [query, setQuery] = useState('');

  const visibleSpecialties = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return specialties;
    return specialties.filter((specialty) => specialty.name.toLowerCase().includes(normalized));
  }, [specialties, query]);

  const totalDoctors = useMemo(
    () => specialties.reduce((sum, specialty) => sum + specialty.doctorsCount, 0),
    [specialties],
  );

  return (
    <>
      {/* ─── Header ────────────────────────────────────────── */}
      <section className="border-b border-surface-200 bg-surface-50 py-16 dark:border-surface-800 dark:bg-surface-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">{t('specialties')}</span>
            <h1 className="section-title mt-3">{t('specialtiesTitle')}</h1>
            <p className="section-subtitle mt-3">{t('specialtiesSubtitle')}</p>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('specialtySearchPlaceholder')}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid ──────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading && specialties.length === 0 ? (
            <Spinner className="py-16" label={t('loading')} />
          ) : error ? (
            <ErrorState
              title={t('errorTitle')}
              message={error}
              onRetry={() => void refresh()}
              retryLabel={t('retry')}
            />
          ) : visibleSpecialties.length === 0 ? (
            <EmptyState
              icon={<Stethoscope size={40} />}
              title={t('noSpecialtyFoundTitle')}
              description={t('noSpecialtyFoundText')}
            />
          ) : (
            <>
              <p className="mb-6 text-sm text-surface-500 dark:text-surface-400">
                {visibleSpecialties.length} {t('specialtiesAvailableSuffix')} · {totalDoctors}+{' '}
                {t('doctorsVerifiedSuffix')}
              </p>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {visibleSpecialties.map((specialty) => (
                  <li key={specialty.id}>
                    <SpecialtyCard specialty={specialty} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
