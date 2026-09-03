import type { ReactNode } from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          {icon}
        </span>
      )}
      <div>
        <strong className="block text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {value}
        </strong>
        <span className="text-sm text-surface-500 dark:text-surface-400">{label}</span>
      </div>
    </div>
  );
}
