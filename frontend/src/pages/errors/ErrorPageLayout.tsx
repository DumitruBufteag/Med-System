import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface ErrorPageLayoutProps {
  status: number;
  icon: LucideIcon;
  label: string;
  title: string;
  text: string;
  /** Extra detail under the message, e.g. the role the visitor is signed in as. */
  note?: ReactNode;
  actions: ReactNode;
}

/** Shared shell for the 401 / 403 / 404 / 500 pages. */
export default function ErrorPageLayout({
  status,
  icon: Icon,
  label,
  title,
  text,
  note,
  actions,
}: ErrorPageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <span className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
        <Icon size={34} />
        <span className="absolute -bottom-3 rounded-full bg-surface-900 px-2.5 py-0.5 text-xs font-bold text-white dark:bg-white dark:text-surface-900">
          {status}
        </span>
      </span>

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
        {label}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">{text}</p>

      {note && (
        <p className="mt-4 rounded-xl border border-surface-200 px-4 py-2.5 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
          {note}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{actions}</div>
    </div>
  );
}
