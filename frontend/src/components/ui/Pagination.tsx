import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Builds a page list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 12]. */
function buildPages(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const visible = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);

  return visible.flatMap((value, index) => {
    const previous = visible[index - 1];
    return previous !== undefined && value - previous > 1 ? ['gap' as const, value] : [value];
  });
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useLanguage();
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginare">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label={t('previous')}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 text-surface-600 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-200 disabled:hover:text-surface-600 dark:border-surface-700 dark:text-surface-400"
      >
        <ChevronLeft size={17} />
      </button>

      {pages.map((entry, index) =>
        entry === 'gap' ? (
          <span
            key={`gap-${index}`}
            className="px-1.5 text-sm text-surface-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold transition-colors',
              entry === page
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-surface-200 text-surface-600 hover:border-primary-300 hover:text-primary-700 dark:border-surface-700 dark:text-surface-400',
            )}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label={t('next')}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 text-surface-600 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-200 disabled:hover:text-surface-600 dark:border-surface-700 dark:text-surface-400"
      >
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}
