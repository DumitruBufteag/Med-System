import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  ShieldX,
  Star,
} from 'lucide-react';
import { getDoctorsByClinic, getReviewsByClinic } from '../services';
import { useServiceData, useNow } from '../hooks';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  cn,
  dateLocale,
  formatPrice,
  formatRating,
  getClinicTypeLabel,
  isClinicOpenNow,
  translateWorkingHours,
} from '../lib/utils';
import ClinicLogo from '../components/ui/ClinicLogo';
import SpecialtyIcon from '../components/ui/SpecialtyIcon';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function ClinicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const now = useNow();
  const { clinics, specialties, isLoading } = useClinics();

  const clinic = clinics.find((item) => item.slug === slug);

  // Both services key off the slug from the URL, so they do not have to wait
  // for the catalogue to resolve.
  const loadDoctors = useCallback(() => getDoctorsByClinic(slug ?? ''), [slug]);
  const loadReviews = useCallback(() => getReviewsByClinic(slug ?? ''), [slug]);

  const doctorsState = useServiceData(loadDoctors);
  const reviewsState = useServiceData(loadReviews);

  if (isLoading) {
    return <Spinner className="py-40" label={t('loading')} />;
  }

  if (!clinic) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          title={t('clinicNotFound')}
          description={t('clinicNotFoundText')}
          action={
            <Link to="/clinici" className="btn-primary">
              {t('backToClinics')}
            </Link>
          }
        />
      </div>
    );
  }

  const isOpen = isClinicOpenNow(clinic.workingHours, now);
  const clinicSpecialties = specialties.filter((specialty) =>
    clinic.specialties.includes(specialty.slug),
  );
  const doctors = doctorsState.data ?? [];
  const reviews = reviewsState.data ?? [];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${clinic.name}, ${clinic.address}, ${clinic.city}`,
  )}`;

  return (
    <>
      {/* ─── Header ────────────────────────────────────────── */}
      <section
        className="relative pb-8 pt-6"
        style={{
          background: `linear-gradient(135deg, ${clinic.brandColor}22, transparent 55%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/clinici"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400"
          >
            <ArrowLeft size={16} />
            {t('backToClinics')}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <ClinicLogo clinic={clinic} size="lg" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-muted">{getClinicTypeLabel(clinic.type, t)}</span>
                {clinic.hasEmergency && (
                  <span className="badge-danger">
                    <Plus size={12} strokeWidth={3} />
                    {t('emergency')}
                  </span>
                )}
                <span className={cn('gap-1.5', isOpen ? 'badge-success' : 'badge-muted')}>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      isOpen ? 'bg-success-500' : 'bg-surface-400',
                    )}
                  />
                  {isOpen ? t('openNow') : t('closed')}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
                {clinic.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-surface-500 dark:text-surface-400">
                <span className="flex items-center gap-1.5 font-semibold text-surface-900 dark:text-white">
                  <Star size={16} className="fill-warning-500 text-warning-500" />
                  {formatRating(clinic.rating)}
                  <span className="font-normal text-surface-400">
                    ({clinic.reviewsCount} {t('reviews').toLowerCase()})
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-surface-300" />
                  {clinic.city}, {clinic.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-surface-300" />
                  {translateWorkingHours(clinic.workingHours.label, language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Body ──────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="space-y-6">
            <article className="card p-6">
              <h2 className="mb-3 text-xl font-bold text-surface-900 dark:text-white">
                {t('aboutClinic')}
              </h2>
              <p className="text-surface-600 dark:text-surface-300">{clinic.description}</p>
            </article>

            <article className="card p-6">
              <h2 className="mb-4 text-xl font-bold text-surface-900 dark:text-white">
                {t('servicesOffered')}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {clinicSpecialties.map((specialty) => (
                  <li key={specialty.id}>
                    <Link
                      to={`/clinici?specialitate=${specialty.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-surface-200 px-4 py-3 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/5"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                        <SpecialtyIcon name={specialty.icon} size={18} />
                      </span>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">
                        {specialty.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <h2 className="mb-4 text-xl font-bold text-surface-900 dark:text-white">
                {t('medicalTeam')}
              </h2>

              {doctorsState.isLoading ? (
                <Spinner className="py-8" />
              ) : doctors.length === 0 ? (
                <p className="text-sm text-surface-500 dark:text-surface-400">{t('noDoctors')}</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {doctors.map((doctor) => {
                    const specialtyName = specialties.find(
                      (item) => item.slug === doctor.specialtySlug,
                    )?.name;

                    return (
                      <li
                        key={doctor.id}
                        className="flex items-center gap-3.5 rounded-xl border border-surface-200 p-4 dark:border-surface-800"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                          {doctor.initials}
                        </span>
                        <div className="min-w-0">
                          <strong className="block truncate text-sm text-surface-900 dark:text-white">
                            {doctor.name}
                          </strong>
                          <small className="text-xs text-surface-500 dark:text-surface-400">
                            {specialtyName ?? doctor.specialtySlug} ·{' '}
                            {doctor.yearsOfExperience} {t('yearsExperience')}
                          </small>
                        </div>
                        <span className="ml-auto flex shrink-0 items-center gap-1 text-sm font-bold text-surface-900 dark:text-white">
                          <Star size={13} className="fill-warning-500 text-warning-500" />
                          {formatRating(doctor.rating)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>

            <article className="card p-6">
              <h2 className="mb-4 text-xl font-bold text-surface-900 dark:text-white">
                {t('reviews')}
              </h2>

              {reviewsState.isLoading ? (
                <Spinner className="py-8" />
              ) : reviews.length === 0 ? (
                <p className="text-sm text-surface-500 dark:text-surface-400">{t('noReviews')}</p>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="border-b border-surface-200 pb-4 last:border-0 last:pb-0 dark:border-surface-800"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <strong className="text-sm text-surface-900 dark:text-white">
                          {review.authorName}
                        </strong>
                        <time className="text-xs text-surface-400" dateTime={review.createdAt}>
                          {new Date(review.createdAt).toLocaleDateString(dateLocale(language))}
                        </time>
                      </div>
                      <div className="mb-2 flex gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            size={14}
                            className={cn(
                              index < review.rating
                                ? 'fill-warning-500 text-warning-500'
                                : 'text-surface-300 dark:text-surface-700',
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-surface-600 dark:text-surface-300">
                        {review.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          {/* ─── Sidebar ─────────────────────────────────────── */}
          <aside>
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="card p-6">
                <small className="text-sm text-surface-500 dark:text-surface-400">
                  {t('consultationFrom')}
                </small>
                <strong className="mt-1 block text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
                  {formatPrice(clinic.consultationFrom)}
                </strong>

                <div className="mt-5 space-y-2.5">
                  <Link to={`/programare?clinica=${clinic.slug}`} className="btn-primary w-full">
                    <CalendarCheck size={17} />
                    {t('bookAppointment')}
                  </Link>
                  <a href={`tel:${clinic.phone.replace(/\s/g, '')}`} className="btn-secondary w-full">
                    <Phone size={17} />
                    {t('callClinic')}
                  </a>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="mb-4 text-base font-bold text-surface-900 dark:text-white">
                  {t('contactDetails')}
                </h2>

                <dl className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-primary-600" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                        {t('address')}
                      </dt>
                      <dd className="text-surface-700 dark:text-surface-300">
                        {clinic.address}, {clinic.city}
                      </dd>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {t('openInMaps')}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={17} className="mt-0.5 shrink-0 text-primary-600" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                        {t('phone')}
                      </dt>
                      <dd>
                        <a
                          href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                          className="text-surface-700 hover:text-primary-600 dark:text-surface-300"
                        >
                          {clinic.phone}
                        </a>
                      </dd>
                    </div>
                  </div>

                  {clinic.website && (
                    <div className="flex gap-3">
                      <Globe size={17} className="mt-0.5 shrink-0 text-primary-600" />
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                          {t('website')}
                        </dt>
                        <dd>
                          <a
                            href={clinic.website}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate text-surface-700 hover:text-primary-600 dark:text-surface-300"
                          >
                            {clinic.website.replace(/^https?:\/\//, '')}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Clock size={17} className="mt-0.5 shrink-0 text-primary-600" />
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                        {t('schedule')}
                      </dt>
                      <dd className="text-surface-700 dark:text-surface-300">
                        {translateWorkingHours(clinic.workingHours.label, language)}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-surface-200 pt-4 dark:border-surface-800">
                    {clinic.acceptsInsurance ? (
                      <ShieldCheck size={17} className="mt-0.5 shrink-0 text-success-500" />
                    ) : (
                      <ShieldX size={17} className="mt-0.5 shrink-0 text-surface-400" />
                    )}
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                        {t('insurance')}
                      </dt>
                      <dd className="text-surface-700 dark:text-surface-300">
                        {clinic.acceptsInsurance
                          ? t('insuranceAccepted')
                          : t('insuranceNotAccepted')}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
