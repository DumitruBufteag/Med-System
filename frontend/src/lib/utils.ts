import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Language, TranslationKey } from '../i18n';
import type { ClinicType, WorkingHours } from '../types';

/** Merges conditional class names and resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats an amount in Moldovan lei, e.g. 450 → "450 MDL". */
export function formatPrice(amount: number): string {
  return `${new Intl.NumberFormat('ro-MD').format(amount)} MDL`;
}

/** Formats a rating with a single decimal, e.g. 4.5 → "4.5". */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Turns a name into a URL-safe slug, e.g. "Clinica Sănătatea" → "clinica-sanatatea". */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Builds initials from a clinic or person name, e.g. "Medpark" → "MP". */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

const CLINIC_TYPE_KEYS: Record<ClinicType, TranslationKey> = {
  hospital: 'typeHospital',
  medical_center: 'typeMedicalCenter',
  specialized_clinic: 'typeSpecializedClinic',
  laboratory: 'typeLaboratory',
};

/** Translates a clinic type into the currently selected language. */
export function getClinicTypeLabel(type: ClinicType, t: (key: TranslationKey) => string): string {
  return t(CLINIC_TYPE_KEYS[type]);
}

/** The `Intl`/`toLocaleDateString` locale matching the selected language. */
export function dateLocale(language: Language): string {
  return language === 'en' ? 'en-US' : 'ro-MD';
}

/** Translates the "Lun–Vin" / "Sâm" day abbreviations used in mock working hours. */
export function translateWorkingHours(label: string, language: Language): string {
  if (language !== 'en') return label;
  return label.replace('Lun–Vin', 'Mon–Fri').replace('Sâm', 'Sat');
}

/**
 * Whether a clinic is open right now, using the viewer's own device clock —
 * so every visitor sees the status for their own local time, not a fixed one.
 */
export function isClinicOpenNow(workingHours: WorkingHours, now: Date = new Date()): boolean {
  if (workingHours.alwaysOpen) return true;

  const day = now.getDay();
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  return (workingHours.periods ?? []).some((period) => {
    if (!period.days.includes(day)) return false;

    const [startHour, startMinute] = period.start.split(':').map(Number);
    const [endHour, endMinute] = period.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return minutesNow >= startMinutes && minutesNow < endMinutes;
  });
}
