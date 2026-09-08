import { useCallback, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { AppointmentStatus } from '../../types';
import { cancelAppointment, getAllAppointments, getAllUsers, getDoctors } from '../../services';
import { useServiceData } from '../../hooks';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { dateLocale } from '../../lib/utils';
import Dropdown from '../../components/ui/Dropdown';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  confirmed: 'badge-success',
  pending: 'badge-muted',
  cancelled: 'badge-danger',
  done: 'badge-muted',
};

export default function AdminAppointmentsPage() {
  const { t, language } = useLanguage();
  const { clinics } = useClinics();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'all'>('all');
  const [reloadToken, setReloadToken] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadAppointments = useCallback(() => {
    void reloadToken;
    return getAllAppointments();
  }, [reloadToken]);
  const appointmentsState = useServiceData(loadAppointments);

  const loadUsers = useCallback(() => getAllUsers(), []);
  const usersState = useServiceData(loadUsers);

  const loadDoctors = useCallback(() => getDoctors(), []);
  const doctorsState = useServiceData(loadDoctors);

  const clinicsById = useMemo(() => new Map(clinics.map((clinic) => [clinic.id, clinic])), [clinics]);
  const doctorsById = useMemo(
    () => new Map((doctorsState.data ?? []).map((doctor) => [doctor.id, doctor])),
    [doctorsState.data],
  );
  const usersById = useMemo(
    () => new Map((usersState.data ?? []).map((user) => [user.id, user])),
    [usersState.data],
  );

  const statusOptions = [
    { value: 'all', label: t('filterAllStatuses') },
    { value: 'confirmed', label: t('statusConfirmed') },
    { value: 'pending', label: t('statusPending') },
    { value: 'cancelled', label: t('statusCancelled') },
    { value: 'done', label: t('statusDone') },
  ];

  const visibleAppointments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (appointmentsState.data ?? []).filter((appointment) => {
      if (status !== 'all' && appointment.status !== status) return false;
      if (!needle) return true;

      const patientName = usersById.get(appointment.patientId)?.name ?? '';
      const clinicName = clinicsById.get(appointment.clinicId)?.name ?? '';
      return (
        patientName.toLowerCase().includes(needle) || clinicName.toLowerCase().includes(needle)
      );
    });
  }, [appointmentsState.data, status, query, usersById, clinicsById]);

  async function handleCancel(id: string) {
    if (!window.confirm(t('cancelConfirm'))) return;

    setCancellingId(id);
    await cancelAppointment(id);
    setCancellingId(null);
    setReloadToken((token) => token + 1);
  }

  const isLoading = appointmentsState.isLoading || usersState.isLoading || doctorsState.isLoading;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {t('adminNavAppointments')}
        </h1>
        <p className="mt-1.5 text-surface-500 dark:text-surface-400">
          {t('adminAppointmentsSubtitle')}
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('searchAppointmentsPlaceholder')}
            className="input pl-10"
          />
        </div>
        <Dropdown
          className="w-48"
          label={t('statusLabel')}
          value={status}
          options={statusOptions}
          onChange={(value) => setStatus(value as AppointmentStatus | 'all')}
        />
      </div>

      {appointmentsState.error ? (
        <ErrorState title={t('errorTitle')} message={appointmentsState.error} />
      ) : isLoading ? (
        <Spinner className="py-20" label={t('loading')} />
      ) : visibleAppointments.length === 0 ? (
        <EmptyState title={t('noAppointmentsYetAdmin')} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-surface-200 text-xs uppercase tracking-wide text-surface-400 dark:border-surface-800">
                <th className="px-4 py-3 font-semibold">{t('tablePatient')}</th>
                <th className="px-4 py-3 font-semibold">{t('clinic')}</th>
                <th className="px-4 py-3 font-semibold">{t('doctor')}</th>
                <th className="px-4 py-3 font-semibold">{t('date')}</th>
                <th className="px-4 py-3 font-semibold">{t('statusLabel')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('tableActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {visibleAppointments.map((appointment) => {
                const patient = usersById.get(appointment.patientId);
                const clinic = clinicsById.get(appointment.clinicId);
                const doctor = doctorsById.get(appointment.doctorId);
                const canCancel = appointment.status === 'confirmed' || appointment.status === 'pending';

                return (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3">
                      <strong className="block truncate text-surface-900 dark:text-white">
                        {patient?.name ?? appointment.patientId}
                      </strong>
                      <span className="block truncate text-xs text-surface-500 dark:text-surface-400">
                        {patient?.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                      {clinic?.name ?? appointment.clinicId}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                      {doctor?.name ?? appointment.doctorId}
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                      {new Date(appointment.date).toLocaleDateString(dateLocale(language))} ·{' '}
                      {appointment.time}
                    </td>
                    <td className="px-4 py-3">
                      <span className={STATUS_BADGE[appointment.status]}>
                        {t(
                          appointment.status === 'confirmed'
                            ? 'statusConfirmed'
                            : appointment.status === 'pending'
                              ? 'statusPending'
                              : appointment.status === 'cancelled'
                                ? 'statusCancelled'
                                : 'statusDone',
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canCancel && (
                        <button
                          type="button"
                          aria-label={t('cancelAppointment')}
                          disabled={cancellingId === appointment.id}
                          onClick={() => void handleCancel(appointment.id)}
                          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50 dark:text-surface-400 dark:hover:bg-danger-500/10"
                        >
                          <X size={16} />
                        </button>
                      )}
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
