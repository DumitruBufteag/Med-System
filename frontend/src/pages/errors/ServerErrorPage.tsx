import { Link } from 'react-router-dom';
import { ServerCrash } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ErrorPageLayout from './ErrorPageLayout';

interface ServerErrorPageProps {
  /** Message reported by the failing service, shown as extra detail. */
  detail?: string;
  /** Retries the failed request; falls back to a full page reload. */
  onRetry?: () => void;
}

/** 500 — shown when a service throws or reports a failed status. */
export default function ServerErrorPage({ detail, onRetry }: ServerErrorPageProps) {
  const { t } = useLanguage();

  return (
    <ErrorPageLayout
      status={500}
      icon={ServerCrash}
      label={t('err500Label')}
      title={t('err500Title')}
      text={t('err500Text')}
      note={detail}
      actions={
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={onRetry ?? (() => window.location.reload())}
          >
            {onRetry ? t('retry') : t('reloadPage')}
          </button>
          <Link to="/" className="btn-secondary">
            {t('backHome')}
          </Link>
        </>
      }
    />
  );
}
