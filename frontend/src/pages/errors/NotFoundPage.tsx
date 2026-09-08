import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ErrorPageLayout from './ErrorPageLayout';

/** 404 — shown for any address that does not match a route. */
export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <ErrorPageLayout
      status={404}
      icon={Compass}
      label={t('notFoundLabel')}
      title={t('notFoundTitle')}
      text={t('notFoundText')}
      actions={
        <>
          <Link to="/" className="btn-primary">
            {t('backHome')}
          </Link>
          <Link to="/clinici" className="btn-secondary">
            {t('viewAllClinics')}
          </Link>
        </>
      }
    />
  );
}
