import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-32 text-center">
      <Compass size={48} className="mb-5 text-primary-500" />
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
        {t('notFoundLabel')}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
        {t('notFoundTitle')}
      </h1>
      <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">{t('notFoundText')}</p>
      <Link to="/" className="btn-primary mt-7">
        {t('backHome')}
      </Link>
    </div>
  );
}
