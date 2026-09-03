import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/ui/FormField';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register, isAuthenticated, isSubmitting, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function updateField(key: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!form.name.trim()) errors.name = t('errNameRequired');

    if (!form.email.trim()) errors.email = t('errEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = t('errEmailInvalid');
    }

    if (!form.password) errors.password = t('errPasswordRequired');
    else if (form.password.length < MIN_PASSWORD_LENGTH) errors.password = t('errPasswordShort');

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = t('errPasswordMismatch');
    }

    if (!acceptsTerms) errors.terms = t('errTermsRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearError();
    if (!validate()) return;

    const succeeded = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
    });

    if (succeeded) navigate(from, { replace: true });
  }

  return (
    <AuthLayout
      title={t('registerTitle')}
      subtitle={t('registerSubtitle')}
      footer={
        <>
          {t('haveAccount')}{' '}
          <Link
            to="/login"
            state={{ from }}
            className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
          >
            {t('signInInstead')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          label={t('fullName')}
          value={form.name}
          autoComplete="name"
          placeholder="Ana Popescu"
          error={fieldErrors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <FormField
          label={t('email')}
          type="email"
          value={form.email}
          autoComplete="email"
          placeholder="nume@exemplu.md"
          error={fieldErrors.email}
          onChange={(event) => updateField('email', event.target.value)}
        />

        <FormField
          label={t('phoneOptional')}
          type="tel"
          value={form.phone}
          autoComplete="tel"
          placeholder="+373 69 123 456"
          onChange={(event) => updateField('phone', event.target.value)}
        />

        <FormField
          label={t('password')}
          isPassword
          value={form.password}
          autoComplete="new-password"
          placeholder="Cel puțin 8 caractere"
          error={fieldErrors.password}
          onChange={(event) => updateField('password', event.target.value)}
        />

        <FormField
          label={t('confirmPassword')}
          isPassword
          value={form.confirmPassword}
          autoComplete="new-password"
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-surface-600 dark:text-surface-300">
            <input
              type="checkbox"
              checked={acceptsTerms}
              onChange={(event) => setAcceptsTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-surface-300 accent-primary-600 dark:border-surface-600"
            />
            {t('acceptTerms')}
          </label>
          {fieldErrors.terms && (
            <p className="mt-1.5 text-xs font-medium text-danger-600">{fieldErrors.terms}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {t('signUp')}
        </button>
      </form>
    </AuthLayout>
  );
}
