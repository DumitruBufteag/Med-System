import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { deleteClinic } from '../../services';
import { useNow } from '../../hooks';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  formatPrice,
  formatRating,
  getClinicTypeLabel,
  isClinicOpenNow,
} from '../../lib/utils';
import ClinicLogo from '../../components/ui/ClinicLogo';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminClinicsPage() {
  const { t } = useLanguage();
  const now = useNow();
  // Shared with the public catalogue, so a delete here disappears there too,
  // without waiting for a full page reload.
  const { clinics, isLoading, error, refresh } = useClinics();
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visibleClinics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return clinics;
    return clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(needle) || clinic.city.toLowerCase().includes(needle),
    );
  }, [clinics, query]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(t('confirmDeleteClinic').replace('{name}', name))) return;

    setDeletingId(id);
    const result = await deleteClinic(id);
    setDeletingId(null);

    if (result.success) {
      await refresh();
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
            {t('adminClinicsTitle')}
          </h1>
          <p className="mt-1.5 text-surface-500 dark:text-surface-400">{t('adminClinicsSubtitle')}</p>
        </div>

        <Link to="/admin/clinici/nou" className="btn-primary">
          <Plus size={17} />
          {t('addClinic')}
        </Link>
      </header>

      <div className="mb-5 max-w-sm">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchClinicsPlaceholder')}
            className="input pl-10"
          />
        </div>
      </div>

      {error ? (
        <ErrorState title={t('errorTitle')} message={error} />
      ) : isLoading ? (
        <Spinner className="py-20" label={t('loading')} />
      ) : visibleClinics.length === 0 ? (
        <EmptyState title={t('adminNoClinics')} description={t('emptyDescription')} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
                <th className="px-4 py-3 font-semibold">{t('clinic')}</th>
                <th className="px-4 py-3 font-semibold">{t('city')}</th>
                <th className="px-4 py-3 font-semibold">{t('clinicType')}</th>
                <th className="px-4 py-3 font-semibold">{t('tablePriceShort')}</th>
                <th className="px-4 py-3 font-semibold">{t('statusLabel')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {visibleClinics.map((clinic) => {
                const isOpen = isClinicOpenNow(clinic.workingHours, now);

                return (
                  <tr key={clinic.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ClinicLogo clinic={clinic} />
                        <div className="min-w-0">
                          <strong className="block truncate text-surface-900 dark:text-white">
                            {clinic.name}
                          </strong>
                          <span className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                            {formatRating(clinic.rating)} · {clinic.reviewsCount} {t('reviews').toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">{clinic.city}</td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                      {getClinicTypeLabel(clinic.type, t)}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                      {formatPrice(clinic.consultationFrom)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={isOpen ? 'badge-success gap-1.5' : 'badge-muted gap-1.5'}>
                        <span
                          className={
                            isOpen
                              ? 'h-1.5 w-1.5 shrink-0 rounded-full bg-success-500'
                              : 'h-1.5 w-1.5 shrink-0 rounded-full bg-surface-400'
                          }
                        />
                        {isOpen ? t('openNow') : t('closed')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/admin/clinici/${clinic.id}/editare`}
                          aria-label={t('editAction')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-primary-600 dark:text-surface-400 dark:hover:bg-surface-800"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          aria-label={t('deleteAction')}
                          disabled={deletingId === clinic.id}
                          onClick={() => void handleDelete(clinic.id, clinic.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50 dark:text-surface-400 dark:hover:bg-danger-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
