import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { deleteDoctor, getDoctors } from '../../services';
import { useServiceData } from '../../hooks';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRating } from '../../lib/utils';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminDoctorsPage() {
  const { t } = useLanguage();
  // Clinic and specialty names come from the catalogue, so the table waits for
  // both requests before rendering rows with unresolved ids.
  const { clinics, specialtyNames, isLoading: isLoadingCatalogue } = useClinics();

  const [query, setQuery] = useState('');
  const [clinicFilter, setClinicFilter] = useState('all');
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDoctors = useCallback(() => {
    void reloadToken;
    return getDoctors();
  }, [reloadToken]);
  const { data, isLoading, error } = useServiceData(loadDoctors);

  const clinicNames = useMemo(
    () => new Map(clinics.map((clinic) => [clinic.id, clinic.name])),
    [clinics],
  );

  const visibleDoctors = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return (data ?? []).filter((doctor) => {
      if (clinicFilter !== 'all' && doctor.clinicId !== clinicFilter) return false;
      if (!needle) return true;

      const specialty = specialtyNames[doctor.specialtySlug] ?? doctor.specialtySlug;
      return (
        doctor.name.toLowerCase().includes(needle) || specialty.toLowerCase().includes(needle)
      );
    });
  }, [data, query, clinicFilter, specialtyNames]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(t('confirmDeleteDoctor').replace('{name}', name))) return;

    setActionError(null);
    setDeletingId(id);
    const result = await deleteDoctor(id);
    setDeletingId(null);

    if (result.success) {
      setReloadToken((token) => token + 1);
      return;
    }
    // A refused delete (the doctor still has bookings) has to be visible.
    setActionError(result.error ?? t('errDeleteDoctorGeneric'));
  }

  const clinicOptions = [
    { value: 'all', label: t('allClinics') },
    ...clinics.map((clinic) => ({ value: clinic.id, label: clinic.name })),
  ];

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
            {t('adminDoctorsTitle')}
          </h1>
          <p className="mt-1.5 text-surface-500 dark:text-surface-400">
            {t('adminDoctorsSubtitle')}
          </p>
        </div>

        <Link to="/admin/medici/nou" className="btn-primary">
          <Plus size={17} />
          {t('addDoctor')}
        </Link>
      </header>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchDoctorsPlaceholder')}
            className="input pl-10"
          />
        </div>
        <div className="w-full sm:w-64">
          <Dropdown
            label={t('clinic')}
            value={clinicFilter}
            options={clinicOptions}
            onChange={setClinicFilter}
          />
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {actionError}
        </p>
      )}

      {error ? (
        <ErrorState title={t('errorTitle')} message={error} />
      ) : isLoading || isLoadingCatalogue ? (
        <Spinner className="py-20" label={t('loading')} />
      ) : visibleDoctors.length === 0 ? (
        <EmptyState title={t('adminNoDoctors')} description={t('emptyDescription')} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
                <th className="px-4 py-3 font-semibold">{t('tableDoctor')}</th>
                <th className="px-4 py-3 font-semibold">{t('clinic')}</th>
                <th className="px-4 py-3 font-semibold">{t('specialty')}</th>
                <th className="px-4 py-3 font-semibold">{t('tableExperience')}</th>
                <th className="px-4 py-3 font-semibold">{t('rating')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {visibleDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {doctor.initials}
                      </span>
                      <strong className="truncate text-surface-900 dark:text-white">
                        {doctor.name}
                      </strong>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {clinicNames.get(doctor.clinicId) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {specialtyNames[doctor.specialtySlug] ?? doctor.specialtySlug}
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {t('yearsShort').replace('{years}', String(doctor.yearsOfExperience))}
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {doctor.rating > 0 ? formatRating(doctor.rating) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        to={`/admin/medici/${doctor.id}/editare`}
                        aria-label={t('editAction')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-primary-600 dark:text-surface-400 dark:hover:bg-surface-800"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        aria-label={t('deleteAction')}
                        disabled={deletingId === doctor.id}
                        onClick={() => void handleDelete(doctor.id, doctor.name)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50 dark:text-surface-400 dark:hover:bg-danger-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
