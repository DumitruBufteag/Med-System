import { Link } from 'react-router-dom';
import type { Specialty } from '../../types';
import SpecialtyIcon from './SpecialtyIcon';
import { useLanguage } from '../../contexts/LanguageContext';

interface SpecialtyCardProps {
  specialty: Specialty;
}

export default function SpecialtyCard({ specialty }: SpecialtyCardProps) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/clinici?specialitate=${specialty.slug}`}
      className="card flex h-full flex-col items-start p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-md dark:hover:border-primary-500/40"
    >
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
        <SpecialtyIcon name={specialty.icon} size={22} />
      </span>
      <strong className="text-base font-semibold text-surface-900 dark:text-white">
        {specialty.name}
      </strong>
      <small className="text-sm text-surface-500 dark:text-surface-400">
        {specialty.doctorsCount} {t('doctors')}
      </small>
    </Link>
  );
}
