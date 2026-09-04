import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarClock, Clock, MapPin, StickyNote, X } from 'lucide-react';
import type { Appointment, AppointmentStatus, Clinic, Doctor } from '../types';
import { cancelAppointment, getAppointmentsByPatient, getDoctors } from '../services';
import { useServiceData } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../i18n';
import { dateLocale } from '../lib/utils';
import ClinicLogo from '../components/ui/ClinicLogo';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

/** Maps a status onto its badge class and label key. */
const statusStyles: Record<AppointmentStatus, { className: string; labelKey: TranslationKey }> = {
  confirmed: { className: 'badge-success', labelKey: 'statusConfirmed' },
  pending: { className: 'badge-muted', labelKey: 'statusPending' },
  cancelled: { className: 'badge-danger', labelKey: 'statusCancelled' },
  done: { className: 'badge-muted', labelKey: 'statusDone' },
};

export default function MyAppointmentsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { clinics } = useClinics();

  const patientId = user?.id ?? '';

  // Read once at mount: the split between upcoming and past must not shift
  // just because the component happened to re-render.
  const [now] = useState(() => Date.now());

  // Bumped after a cancellation, to re-run the load.
  const [reloadToken, setReloadToken] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadAppointments = useCallback(
    () => {
      void reloadToken;
      return getAppointmentsByPatient(patientId);
    },
    [patientId, reloadToken],
  );
  const appointmentsState = useServiceData(loadAppointments);

  const loadDoctors = useCallback(() => getDoctors(), []);
  const doctorsState = useServiceData(loadDoctors);

  const clinicsById = useMemo(
    () => new Map<string, Clinic>(clinics.map((clinic) => [clinic.id, clinic])),
    [clinics],
  );
  const doctorsById = useMemo(
    () => new Map<string, Doctor>((doctorsState.data ?? []).map((doctor) => [doctor.id, doctor])),
    [doctorsState.data],
  );

  const { upcoming, past } = useMemo(() => {
    const all = appointmentsState.data ?? [];

    const isUpcoming = (appointment: Appointment) =>
      appointment.status !== 'cancelled' &&
      appointment.status !== 'done' &&
      new Date(`${appointment.date}T${appointment.time}`).getTime() >= now;

    return {
      upcoming: all.filter(isUpcoming),
      // Most recent first, so the latest visit is at the top of the history.
      past: all.filter((appointment) => !isUpcoming(appointment)).reverse(),
    };
  }, [appointmentsState.data, now]);

  async function handleCancel(id: string) {
    if (!window.confirm(t('cancelConfirm'))) return;

    setCancellingId(id);
    await cancelAppointment(id);
    setCancellingId(null);
    setReloadToken((token) => token + 1);
  }

  function renderAppointment(appointment: Appointment) {
    const clinic = clinicsById.get(appointment.clinicId);
    const doctor = doctorsById.get(appointment.doctorId);
    const status = statusStyles[appointment.status];
    const canCancel = appointment.status === 'confirmed' || appointment.status === 'pending';

    return (
      <li key={appointment.id} className="card p-5">
        <div className="flex flex-wrap items-start gap-4">
          {clinic && <ClinicLogo clinic={clinic} />}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-surface-900 dark:text-white">
                {clinic?.name ?? appointment.clinicId}
              </h3>
              <span className={status.className}>{t(status.labelKey)}</span>
            </div>

            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              {doctor?.name ?? appointment.doctorId}
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-surface-500 dark:text-surface-400">
              <li className="flex items-center gap-1.5">
                <CalendarClock size={15} className="text-primary-600" />
                <time dateTime={`${appointment.date}T${appointment.time}`}>
                  {new Date(appointment.date).toLocaleDateString(dateLocale(language), {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock size={15} className="text-primary-600" />
                {appointment.time}
              </li>
              {clinic && (
                <li className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-primary-600" />
                  {clinic.city}, {clinic.address}
                </li>
              )}
            </ul>

            {appointment.notes && (
              <p className="mt-3 flex gap-2 rounded-lg bg-surface-50 p-3 text-sm text-surface-600 dark:bg-surface-800/50 dark:text-surface-300">
                <StickyNote size={15} className="mt-0.5 shrink-0 text-surface-400" />
                <span>
                  <strong className="font-semibold">{t('appointmentNotes')}: </strong>
                  {appointment.notes}
                </span>
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            {clinic && (
              <Link to={`/clinici/${clinic.slug}`} className="btn-secondary">
                {t('viewDetails')}
              </Link>
            )}
            {canCancel && (
              <button
                type="button"
                disabled={cancellingId === appointment.id}
                onClick={() => void handleCancel(appointment.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-surface-200 px-5 py-2.5 text-sm font-semibold text-danger-600 transition-colors hover:border-danger-500 hover:bg-danger-50 disabled:opacity-50 dark:border-surface-700 dark:hover:bg-danger-500/10"
              >
                <X size={16} />
                {t('cancelAppointment')}
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
            {t('myAppointmentsTitle')}
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            {t('myAppointmentsSubtitle')}
          </p>
        </div>

        <Link to="/programare" className="btn-primary">
          <CalendarCheck size={17} />
          {t('bookAppointment')}
        </Link>
      </header>

      {appointmentsState.error ? (
        <ErrorState title={t('errorTitle')} message={appointmentsState.error} />
      ) : appointmentsState.isLoading ? (
        <Spinner className="py-24" label={t('loading')} />
      ) : upcoming.length === 0 && past.length === 0 ? (
        <EmptyState
          title={t('noAppointments')}
          description={t('noAppointmentsText')}
          icon={<CalendarClock size={40} />}
          action={
            <Link to="/programare" className="btn-primary">
              {t('bookFirstAppointment')}
            </Link>
          }
        />
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
                {t('upcomingAppointments')} ({upcoming.length})
              </h2>
              <ul className="space-y-4">{upcoming.map(renderAppointment)}</ul>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-surface-400">
                {t('pastAppointments')} ({past.length})
              </h2>
              <ul className="space-y-4 opacity-75">{past.map(renderAppointment)}</ul>
            </section>
          )}
        </div>
      )}
    </section>
  );
}
