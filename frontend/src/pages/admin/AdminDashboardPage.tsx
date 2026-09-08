import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarClock, Stethoscope, Users } from 'lucide-react';
import { getAllAppointments, getAllUsers, getDoctors } from '../../services';
import { useServiceData } from '../../hooks';
import { useClinics } from '../../contexts/ClinicContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { dateLocale } from '../../lib/utils';
import Spinner from '../../components/ui/Spinner';

interface StatCardProps {
  icon: typeof Building2;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
        <Icon size={20} />
      </span>
      <div>
        <strong className="block text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {value}
        </strong>
        <span className="text-sm text-surface-500 dark:text-surface-400">{label}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const { clinics, isLoading: isClinicsLoading } = useClinics();

  const loadUsers = useCallback(() => getAllUsers(), []);
  const usersState = useServiceData(loadUsers);

  const loadAppointments = useCallback(() => getAllAppointments(), []);
  const appointmentsState = useServiceData(loadAppointments);

  const loadDoctors = useCallback(() => getDoctors(), []);
  const doctorsState = useServiceData(loadDoctors);

  const patients = useMemo(
    () => (usersState.data ?? []).filter((user) => user.role === 'patient'),
    [usersState.data],
  );
  const appointments = appointmentsState.data ?? [];
  const doctors = useMemo(() => doctorsState.data ?? [], [doctorsState.data]);

  const clinicsById = useMemo(
    () => new Map(clinics.map((clinic) => [clinic.id, clinic])),
    [clinics],
  );
  const doctorsById = useMemo(() => new Map(doctors.map((doctor) => [doctor.id, doctor])), [doctors]);
  const usersById = useMemo(
    () => new Map((usersState.data ?? []).map((user) => [user.id, user])),
    [usersState.data],
  );

  const recentAppointments = appointments.slice(0, 5);

  const isLoading = isClinicsLoading || usersState.isLoading || appointmentsState.isLoading || doctorsState.isLoading;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {t('adminNavDashboard')}
        </h1>
        <p className="mt-1.5 text-surface-500 dark:text-surface-400">{t('adminDashboardSubtitle')}</p>
      </header>

      {isLoading ? (
        <Spinner className="py-20" label={t('loading')} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Building2} label={t('clinics')} value={clinics.length} />
            <StatCard icon={Users} label={t('adminNavPatients')} value={patients.length} />
            <StatCard icon={CalendarClock} label={t('adminNavAppointments')} value={appointments.length} />
            <StatCard icon={Stethoscope} label={t('adminStatDoctors')} value={doctors.length} />
          </div>

          <section className="card mt-8 p-6">
            <h2 className="mb-4 text-lg font-bold text-surface-900 dark:text-white">
              {t('recentAppointmentsTitle')}
            </h2>

            {recentAppointments.length === 0 ? (
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {t('noRecentAppointments')}
              </p>
            ) : (
              <ul className="divide-y divide-surface-200 dark:divide-surface-800">
                {recentAppointments.map((appointment) => {
                  const clinic = clinicsById.get(appointment.clinicId);
                  const doctor = doctorsById.get(appointment.doctorId);
                  const patient = usersById.get(appointment.patientId);

                  return (
                    <li key={appointment.id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-sm text-surface-900 dark:text-white">
                          {patient?.name ?? appointment.patientId}
                        </strong>
                        <span className="block truncate text-xs text-surface-500 dark:text-surface-400">
                          {clinic?.name ?? appointment.clinicId} · {doctor?.name ?? appointment.doctorId}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-surface-500 dark:text-surface-400">
                        {new Date(appointment.date).toLocaleDateString(dateLocale(language))} ·{' '}
                        {appointment.time}
                      </span>
                      <span
                        className={
                          appointment.status === 'cancelled'
                            ? 'badge-danger'
                            : appointment.status === 'confirmed'
                              ? 'badge-success'
                              : 'badge-muted'
                        }
                      >
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
                    </li>
                  );
                })}
              </ul>
            )}

            {recentAppointments.length > 0 && (
              <div className="mt-4">
                <Link
                  to="/admin/programari"
                  className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                >
                  {t('adminNavAppointments')}
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
