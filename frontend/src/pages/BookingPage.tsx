import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react';
import type { Appointment } from '../types';
import { createAppointment, getDoctorsByClinic, getTakenSlots, TIME_SLOTS } from '../services';
import { useServiceData } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import { cn, dateLocale, formatPrice } from '../lib/utils';
import Dropdown from '../components/ui/Dropdown';
import ClinicLogo from '../components/ui/ClinicLogo';
import Spinner from '../components/ui/Spinner';

interface FieldErrors {
  clinic?: string;
  doctor?: string;
  date?: string;
  slot?: string;
}

/** Today in YYYY-MM-DD, used as the earliest bookable day. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { clinics, isLoading: isCatalogLoading } = useClinics();
  const [searchParams] = useSearchParams();

  const [clinicSlug, setClinicSlug] = useState(searchParams.get('clinica') ?? '');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);

  const clinic = clinics.find((item) => item.slug === clinicSlug);

  const loadDoctors = useCallback(() => getDoctorsByClinic(clinicSlug), [clinicSlug]);
  const doctorsState = useServiceData(loadDoctors);
  const doctors = useMemo(() => doctorsState.data ?? [], [doctorsState.data]);

  const loadTakenSlots = useCallback(() => getTakenSlots(doctorId, date), [doctorId, date]);
  const takenSlotsState = useServiceData(loadTakenSlots);
  const takenSlots = takenSlotsState.data ?? [];

  const doctor = doctors.find((item) => item.id === doctorId);
  const freeSlots = TIME_SLOTS.filter((time) => !takenSlots.includes(time));

  const clinicOptions = useMemo(
    () => clinics.map((item) => ({ value: item.slug, label: item.name })),
    [clinics],
  );

  const doctorOptions = useMemo(
    () => doctors.map((item) => ({ value: item.id, label: item.name })),
    [doctors],
  );

  function handleClinicChange(nextSlug: string) {
    setClinicSlug(nextSlug);
    // The previous doctor belongs to another clinic.
    setDoctorId('');
    setSlot('');
  }

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!clinic) errors.clinic = t('errClinicRequired');
    if (!doctorId) errors.doctor = t('errDoctorRequired');
    if (!date) errors.date = t('errDateRequired');
    if (!slot) errors.slot = t('errSlotRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!validate() || !clinic || !user) return;

    setIsSubmitting(true);
    const result = await createAppointment(user.id, {
      clinicId: clinic.id,
      doctorId,
      date,
      time: slot,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);

    if (result.success && result.data) {
      setConfirmed(result.data);
      return;
    }
    setError(result.error ?? t('errCreateAppointmentGeneric'));
  }

  function startOver() {
    setConfirmed(null);
    setDoctorId('');
    setSlot('');
    setNotes('');
  }

  if (isCatalogLoading) {
    return <Spinner className="py-40" label={t('loading')} />;
  }

  // ─── Confirmation ─────────────────────────────────────────────
  if (confirmed && clinic) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/10">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
          {t('bookingDone')}
        </h1>
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
          {t('bookingDoneText')}
        </p>

        <dl className="card mt-8 space-y-3 p-6 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">{t('clinic')}</dt>
            <dd className="font-semibold text-surface-900 dark:text-white">{clinic.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">{t('doctor')}</dt>
            <dd className="font-semibold text-surface-900 dark:text-white">{doctor?.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">{t('date')}</dt>
            <dd className="font-semibold text-surface-900 dark:text-white">
              {new Date(confirmed.date).toLocaleDateString(dateLocale(language))} · {confirmed.time}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-surface-200 pt-3 dark:border-surface-800">
            <dt className="text-surface-500">{t('consultationFrom')}</dt>
            <dd className="font-semibold text-surface-900 dark:text-white">
              {formatPrice(clinic.consultationFrom)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" className="btn-secondary" onClick={startOver}>
            {t('newBooking')}
          </button>
          <Link to="/programarile-mele" className="btn-primary">
            {t('myAppointmentsTitle')}
          </Link>
        </div>
      </section>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {t('bookingTitle')}
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">{t('bookingSubtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <div>
          <span className="label">{t('clinic')}</span>
          <Dropdown
            label={t('clinic')}
            placeholder={t('chooseClinic')}
            value={clinicSlug}
            options={clinicOptions}
            onChange={handleClinicChange}
          />
          {fieldErrors.clinic && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.clinic}</p>
          )}
        </div>

        {clinic && (
          <div className="flex items-center gap-3.5 rounded-xl border border-surface-200 p-4 dark:border-surface-800">
            <ClinicLogo clinic={clinic} />
            <div className="min-w-0">
              <strong className="block truncate text-sm text-surface-900 dark:text-white">
                {clinic.name}
              </strong>
              <small className="text-xs text-surface-500">
                {clinic.city}, {clinic.address} · {t('consultationFrom').toLowerCase()}{' '}
                {formatPrice(clinic.consultationFrom)}
              </small>
            </div>
          </div>
        )}

        <div>
          <span className="label">{t('doctor')}</span>
          {doctorsState.isLoading && clinicSlug ? (
            <Spinner className="py-3" />
          ) : !clinicSlug ? (
            <p className="text-sm text-surface-400">{t('chooseClinicFirst')}</p>
          ) : doctorOptions.length === 0 ? (
            <p className="text-sm text-surface-400">{t('noDoctorsForClinic')}</p>
          ) : (
            <Dropdown
              label={t('doctor')}
              placeholder={t('chooseDoctor')}
              value={doctorId}
              options={doctorOptions}
              onChange={(value) => {
                setDoctorId(value);
                setSlot('');
              }}
            />
          )}
          {fieldErrors.doctor && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.doctor}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-date" className="label">
            {t('date')}
          </label>
          <input
            id="booking-date"
            type="date"
            className="input"
            value={date}
            min={today()}
            onChange={(event) => {
              setDate(event.target.value);
              setSlot('');
            }}
          />
          {fieldErrors.date && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.date}</p>
          )}
        </div>

        <div>
          <span className="label">{t('availableSlots')}</span>

          {!doctorId || !date ? (
            <p className="text-sm text-surface-400">{t('chooseDoctorAndDate')}</p>
          ) : takenSlotsState.isLoading ? (
            <Spinner className="py-3" />
          ) : freeSlots.length === 0 ? (
            <p className="text-sm text-surface-400">{t('noSlotsAvailable')}</p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TIME_SLOTS.map((time) => {
                const isTaken = takenSlots.includes(time);

                return (
                  <li key={time}>
                    <button
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSlot(time)}
                      className={cn(
                        'w-full rounded-lg border py-2.5 text-sm font-semibold transition-colors',
                        slot === time
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : isTaken
                            ? 'cursor-not-allowed border-surface-200 bg-surface-50 text-surface-300 line-through dark:border-surface-800 dark:bg-surface-800/50 dark:text-surface-600'
                            : 'border-surface-200 text-surface-700 hover:border-primary-400 dark:border-surface-700 dark:text-surface-300',
                      )}
                    >
                      {time}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {fieldErrors.slot && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.slot}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-notes" className="label">
            {t('notesOptional')}
          </label>
          <textarea
            id="booking-notes"
            rows={3}
            className="input resize-y"
            placeholder={t('notesPlaceholder')}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <CalendarCheck size={17} />
          )}
          {t('confirmBooking')}
        </button>
      </form>
    </section>
  );
}
