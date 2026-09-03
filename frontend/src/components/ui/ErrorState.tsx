import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({ title, message, onRetry, retryLabel }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger-500/20 bg-danger-50 px-6 py-16 text-center dark:bg-danger-500/5">
      <AlertTriangle size={40} className="mb-4 text-danger-500" />
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-surface-500 dark:text-surface-400">{message}</p>
      )}
      {onRetry && (
        <button type="button" className="btn-primary mt-5" onClick={onRetry}>
          {retryLabel ?? 'Încearcă din nou'}
        </button>
      )}
    </div>
  );
}
