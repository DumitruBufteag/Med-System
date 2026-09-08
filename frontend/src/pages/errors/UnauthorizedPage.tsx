import { Link, useLocation } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ErrorPageLayout from './ErrorPageLayout';

/** 401 — shown when an anonymous visitor opens a route that needs an account. */
export default function UnauthorizedPage() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <ErrorPageLayout
      status={401}
      icon={LockKeyhole}
      label={t('err401Label')}
      title={t('err401Title')}
      text={t('err401Text')}
      actions={
        <>
          <Link
            to="/login"
            state={{ from: `${location.pathname}${location.search}` }}
            className="btn-primary"
          >
            {t('login')}
          </Link>
          <Link to="/" className="btn-secondary">
            {t('backHome')}
          </Link>
        </>
      }
    />
  );
}
