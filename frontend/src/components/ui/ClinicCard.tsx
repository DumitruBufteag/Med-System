import { Link } from 'react-router-dom';
import { Clock, MapPin, Plus, Star } from 'lucide-react';
import type { Clinic } from '../../types';
import {
  cn,
  formatPrice,
  formatRating,
  getClinicTypeLabel,
  isClinicOpenNow,
  translateWorkingHours,
} from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNow } from '../../hooks';
import ClinicLogo from './ClinicLogo';

interface ClinicCardProps {
  clinic: Clinic;
  /** Specialty slug → display name, so the card can show readable labels. */
  specialtyNames: Record<string, string>;
}

export default function ClinicCard({ clinic, specialtyNames }: ClinicCardProps) {
  const { t, language } = useLanguage();
  const now = useNow();
  const isOpen = isClinicOpenNow(clinic.workingHours, now);
  const visibleSpecialties = clinic.specialties.slice(0, 3);
  const hiddenCount = clinic.specialties.length - visibleSpecialties.length;

  return (
    <article className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Cover — a brand-coloured placeholder until real photos are available */}
      <div
        className="relative flex h-32 items-start justify-between p-4"
        style={{
          background: `linear-gradient(135deg, ${clinic.brandColor}, ${clinic.brandColor}b3)`,
        }}
      >
        <ClinicLogo clinic={clinic} />
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-surface-700">
          {getClinicTypeLabel(clinic.type, t)}
        </span>

        {clinic.hasEmergency && (
          <span className="absolute bottom-3.5 left-4 inline-flex items-center gap-1.5 rounded-full bg-danger-500 px-2.5 py-1 text-xs font-semibold text-white">
            <Plus size={13} strokeWidth={3} />
            {t('emergency')}
          </span>
        )}
      </div>

      <div className="flex-1 p-5">
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug text-surface-900 dark:text-white">
            {clinic.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-surface-900 dark:text-white">
            <Star size={15} className="fill-warning-500 text-warning-500" />
            {formatRating(clinic.rating)}
            <small className="font-medium text-surface-400">({clinic.reviewsCount})</small>
          </span>
        </div>

        <ul className="space-y-2 text-sm text-surface-500 dark:text-surface-400">
          <li className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-surface-300" />
            {clinic.city}, {clinic.address}
          </li>
          <li className="flex flex-col items-start gap-1.5">
            <span className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-surface-300" />
              {translateWorkingHours(clinic.workingHours.label, language)}
            </span>
            <span className={cn('gap-1.5', isOpen ? 'badge-success' : 'badge-muted')}>
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  isOpen ? 'bg-success-500' : 'bg-surface-400',
                )}
              />
              {isOpen ? t('openNow') : t('closed')}
            </span>
          </li>
        </ul>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {visibleSpecialties.map((slug) => (
            <li key={slug} className="badge-primary">
              {specialtyNames[slug] ?? slug}
            </li>
          ))}
          {hiddenCount > 0 && <li className="badge-muted">+{hiddenCount}</li>}
        </ul>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-surface-200 bg-surface-50 px-5 py-4 dark:border-surface-800 dark:bg-surface-950/40">
        <div>
          <small className="block text-xs text-surface-500 dark:text-surface-400">
            {t('consultationFrom')}
          </small>
          <strong className="text-base text-surface-900 dark:text-white">
            {formatPrice(clinic.consultationFrom)}
          </strong>
        </div>
        <Link to={`/clinici/${clinic.slug}`} className="btn-primary">
          {t('viewDetails')}
        </Link>
      </footer>
    </article>
  );
}
