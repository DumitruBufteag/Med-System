import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { TranslationKey } from '../../i18n';
import ErrorPageLayout from './ErrorPageLayout';

const ROLE_LABEL_KEYS: Record<string, TranslationKey> = {
  patient: 'roleNamePatient',
  clinic: 'roleNameClinic',
  admin: 'roleNameAdmin',
};

/** 403 — shown when a signed-in user lacks the role a route requires. */
export default function ForbiddenPage() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const roleLabel = user ? t(ROLE_LABEL_KEYS[user.role] ?? 'roleNamePatient') : '';

  return (
    <ErrorPageLayout
      status={403}
      icon={ShieldAlert}
      label={t('err403Label')}
      title={t('err403Title')}
      text={t('err403Text')}
      note={user ? t('err403RoleNote').replace('{role}', roleLabel) : undefined}
      actions={
        <>
          <Link to="/" className="btn-primary">
            {t('backHome')}
          </Link>
          <button type="button" className="btn-secondary" onClick={() => logout('/login')}>
            {t('err403SwitchAccount')}
          </button>
        </>
      }
    />
  );
}
