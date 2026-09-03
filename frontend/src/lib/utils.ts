import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

/** Builds initials from a clinic or person name, e.g. "Medpark" → "MP". */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
