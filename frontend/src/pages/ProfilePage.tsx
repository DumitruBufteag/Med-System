import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, Loader2, UserRound } from 'lucide-react';
import { changePassword, updateProfile } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getInitials } from '../lib/utils';
import FormField from '../components/ui/FormField';

interface ProfileErrors {
  name?: string;
  email?: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const MIN_PASSWORD_LENGTH = 8;

/** Green success line shown under a form after it saves. */
function SuccessNote({ children }: { children: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-success-50 px-3.5 py-2.5 text-sm font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

/** Red error line shown under a form when saving fails. */
function ErrorNote({ children }: { children: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();

  // ─── Personal details ───────────────────────────────────────
  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // ─── Password ───────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!user) return null;

  async function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    setProfileError(null);
    setProfileSaved(false);

    const errors: ProfileErrors = {};
    if (!profile.name.trim()) errors.name = t('errNameRequired');
    if (!profile.email.trim()) errors.email = t('errEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      errors.email = t('errEmailInvalid');
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingProfile(true);
    const result = await updateProfile(user.id, {
      name: profile.name,
      email: profile.email,
      phone: profile.phone || undefined,
    });
    setIsSavingProfile(false);

    if (result.success && result.data) {
      setUser(result.data);
      setProfileSaved(true);
      return;
    }
    setProfileError(result.error ?? 'Nu am putut salva modificările.');
  }

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    setPasswordError(null);
    setPasswordChanged(false);

    const errors: PasswordErrors = {};
    if (!passwords.currentPassword) errors.currentPassword = t('errCurrentPasswordRequired');

    if (!passwords.newPassword) errors.newPassword = t('errPasswordRequired');
    else if (passwords.newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = t('errPasswordShort');
    } else if (passwords.newPassword === passwords.currentPassword) {
      errors.newPassword = t('errSamePassword');
    }

    if (passwords.confirmPassword !== passwords.newPassword) {
      errors.confirmPassword = t('errPasswordMismatch');
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSavingPassword(true);
    const result = await changePassword(user.id, {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setIsSavingPassword(false);

    if (result.success) {
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordChanged(true);
      return;
    }
    setPasswordError(result.error ?? 'Nu am putut schimba parola.');
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {t('profileTitle')}
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">{t('profileSubtitle')}</p>
      </header>

      {/* Account summary */}
      <div className="card mb-6 flex flex-wrap items-center gap-4 p-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
          {getInitials(user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <strong className="block truncate text-lg text-surface-900 dark:text-white">
            {user.name}
          </strong>
          <small className="block truncate text-sm text-surface-500">{user.email}</small>
        </div>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
              {t('accountRole')}
            </dt>
            <dd className="mt-1">
              <span className="badge-primary">{user.role}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-surface-400">
              {t('memberSince')}
            </dt>
            <dd className="mt-1 font-semibold text-surface-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString('ro-MD')}
            </dd>
          </div>
        </dl>
      </div>

      {/* Personal details */}
      <form onSubmit={handleProfileSubmit} noValidate className="card mb-6 space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-surface-900 dark:text-white">
          <UserRound size={19} className="text-primary-600" />
          {t('personalData')}
        </h2>

        {profileError && <ErrorNote>{profileError}</ErrorNote>}
        {profileSaved && <SuccessNote>{t('profileSaved')}</SuccessNote>}

        <FormField
          label={t('fullName')}
          value={profile.name}
          autoComplete="name"
          error={profileErrors.name}
          onChange={(event) => {
            setProfile((previous) => ({ ...previous, name: event.target.value }));
            setProfileSaved(false);
          }}
        />

        <FormField
          label={t('email')}
          type="email"
          value={profile.email}
          autoComplete="email"
          error={profileErrors.email}
          onChange={(event) => {
            setProfile((previous) => ({ ...previous, email: event.target.value }));
            setProfileSaved(false);
          }}
        />

        <FormField
          label={t('phoneOptional')}
          type="tel"
          value={profile.phone}
          autoComplete="tel"
          placeholder="+373 69 123 456"
          onChange={(event) => {
            setProfile((previous) => ({ ...previous, phone: event.target.value }));
            setProfileSaved(false);
          }}
        />

        <button type="submit" disabled={isSavingProfile} className="btn-primary">
          {isSavingProfile && <Loader2 size={17} className="animate-spin" />}
          {t('saveChanges')}
        </button>
      </form>

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} noValidate className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-surface-900 dark:text-white">
          <KeyRound size={19} className="text-primary-600" />
          {t('changePassword')}
        </h2>

        {passwordError && <ErrorNote>{passwordError}</ErrorNote>}
        {passwordChanged && <SuccessNote>{t('passwordChanged')}</SuccessNote>}

        <FormField
          label={t('currentPassword')}
          isPassword
          value={passwords.currentPassword}
          autoComplete="current-password"
          error={passwordErrors.currentPassword}
          onChange={(event) => {
            setPasswords((previous) => ({ ...previous, currentPassword: event.target.value }));
            setPasswordChanged(false);
          }}
        />

        <FormField
          label={t('newPassword')}
          isPassword
          value={passwords.newPassword}
          autoComplete="new-password"
          placeholder="Cel puțin 8 caractere"
          error={passwordErrors.newPassword}
          onChange={(event) => {
            setPasswords((previous) => ({ ...previous, newPassword: event.target.value }));
            setPasswordChanged(false);
          }}
        />

        <FormField
          label={t('confirmNewPassword')}
          isPassword
          value={passwords.confirmPassword}
          autoComplete="new-password"
          error={passwordErrors.confirmPassword}
          onChange={(event) => {
            setPasswords((previous) => ({ ...previous, confirmPassword: event.target.value }));
            setPasswordChanged(false);
          }}
        />

        <button type="submit" disabled={isSavingPassword} className="btn-primary">
          {isSavingPassword && <Loader2 size={17} className="animate-spin" />}
          {t('updatePassword')}
        </button>
      </form>
    </section>
  );
}
