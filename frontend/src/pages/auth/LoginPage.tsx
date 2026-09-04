import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Info, Loader2, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { demoAccounts } from '../../data/mockData';
import { USE_MOCK_DATA } from '../../services';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/ui/FormField';

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated, isSubmitting, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Someone already signed in has nothing to do here.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!email.trim()) errors.email = t('errEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = t('errEmailInvalid');

    if (!password) errors.password = t('errPasswordRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearError();
    if (!validate()) return;

    const signedInUser = await login(email, password);
    if (!signedInUser) return;

    const destination = signedInUser.role === 'admin' && from === '/' ? '/admin' : from;
    navigate(destination, { replace: true });
  }

  function fillDemoAccount(demoEmail: string, demoPassword: string) {
    clearError();
    setFieldErrors({});
    setEmail(demoEmail);
    setPassword(demoPassword);
  }

  return (
    <AuthLayout
      title={t('loginTitle')}
      subtitle={t('loginSubtitle')}
      footer={
        <>
          {t('noAccount')}{' '}
          <Link
            to="/register"
            state={{ from }}
            className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            {t('createOne')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {from.startsWith('/programare') && (
          <p className="flex items-start gap-2 rounded-lg bg-primary-50 px-3.5 py-2.5 text-sm font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <Info size={16} className="mt-0.5 shrink-0" />
            {t('bookingLoginRequired')}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm font-medium text-danger-600 dark:bg-danger-500/10 dark:text-danger-400"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <FormField
          label={t('email')}
          type="email"
          value={email}
          autoComplete="email"
          placeholder={t('emailPlaceholderExample')}
          error={fieldErrors.email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <FormField
          label={t('password')}
          isPassword
          value={password}
          autoComplete="current-password"
          placeholder="••••••••"
          error={fieldErrors.password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {t('signIn')}
        </button>
      </form>

      {USE_MOCK_DATA && (
        <section className="mt-8 rounded-xl border border-dashed border-surface-300 p-4 dark:border-surface-700">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
            {t('demoAccounts')}
          </h2>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
            {t('demoAccountsHint')}
          </p>

          <ul className="mt-3 space-y-2">
            {demoAccounts.map((account) => (
              <li key={account.email}>
                <button
                  type="button"
                  onClick={() => fillDemoAccount(account.email, account.password)}
                  className="flex w-full items-center gap-3 rounded-lg border border-surface-200 px-3 py-2 text-left transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-surface-800 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/5"
                >
                  <UserRound size={16} className="shrink-0 text-primary-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-surface-900 dark:text-white">
                      {account.email}
                    </span>
                    <span className="block truncate text-xs text-surface-500">
                      {account.password} · {account.role}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AuthLayout>
  );
}
