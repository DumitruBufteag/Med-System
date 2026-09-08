import { useCallback, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { deleteUser, getAllAppointments, getAllUsers } from '../../services';
import { useServiceData } from '../../hooks';
import { useLanguage } from '../../contexts/LanguageContext';
import { dateLocale, getInitials } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminPatientsPage() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    void reloadToken;
    return getAllUsers();
  }, [reloadToken]);
  const usersState = useServiceData(loadUsers);

  const loadAppointments = useCallback(() => getAllAppointments(), []);
  const appointmentsState = useServiceData(loadAppointments);

  const patients = useMemo(
    () => (usersState.data ?? []).filter((user) => user.role === 'patient'),
    [usersState.data],
  );

  const appointmentCountByPatient = useMemo(() => {
    const counts = new Map<string, number>();
    for (const appointment of appointmentsState.data ?? []) {
      counts.set(appointment.patientId, (counts.get(appointment.patientId) ?? 0) + 1);
    }
    return counts;
  }, [appointmentsState.data]);

  const visiblePatients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(needle) || patient.email.toLowerCase().includes(needle),
    );
  }, [patients, query]);

  const isLoading = usersState.isLoading || appointmentsState.isLoading;
  const error = usersState.error ?? appointmentsState.error;

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(t('confirmDeletePatient').replace('{name}', name))) return;

    setDeletingId(id);
    const result = await deleteUser(id);
    setDeletingId(null);

    if (result.success) {
      setReloadToken((token) => token + 1);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {t('adminNavPatients')}
        </h1>
        <p className="mt-1.5 text-surface-500 dark:text-surface-400">{t('adminPatientsSubtitle')}</p>
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
            placeholder={t('searchPatientsPlaceholder')}
            className="input pl-10"
          />
        </div>
      </div>

      {error ? (
        <ErrorState title={t('errorTitle')} message={error} />
      ) : isLoading ? (
        <Spinner className="py-20" label={t('loading')} />
      ) : visiblePatients.length === 0 ? (
        <EmptyState title={t('noPatientsYet')} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
                <th className="px-4 py-3 font-semibold">{t('tableName')}</th>
                <th className="px-4 py-3 font-semibold">{t('email')}</th>
                <th className="px-4 py-3 font-semibold">{t('phone')}</th>
                <th className="px-4 py-3 font-semibold">{t('memberSince')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('tableAppointmentsCount')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {visiblePatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {getInitials(patient.name)}
                      </span>
                      <strong className="truncate text-surface-900 dark:text-white">
                        {patient.name}
                      </strong>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">{patient.email}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {patient.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                    {new Date(patient.createdAt).toLocaleDateString(dateLocale(language))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-surface-900 dark:text-white">
                    {appointmentCountByPatient.get(patient.id) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={t('deleteAction')}
                      disabled={deletingId === patient.id}
                      onClick={() => void handleDelete(patient.id, patient.name)}
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50 dark:text-surface-400 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
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
