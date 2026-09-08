import { useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FormField from '../components/ui/FormField';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const { t } = useLanguage();

  const contactDetails = [
    { icon: Phone, label: t('phone'), value: '+373 22 000 000', href: 'tel:+37322000000' },
    { icon: Mail, label: t('email'), value: 'contact@medgid.md', href: 'mailto:contact@medgid.md' },
    { icon: MapPin, label: t('address'), value: 'Ginta Latină 12/11, Chișinău' },
    { icon: Clock, label: t('contactSupportHoursLabel'), value: t('contactSupportHoursValue') },
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = t('errNameRequired');
    if (!email.trim()) errors.email = t('errEmailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = t('errEmailInvalid');
    if (!message.trim()) errors.message = t('errMessageRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Nu există încă un endpoint dedicat de contact — simulăm trimiterea
    // local, ca formularul să rămână funcțional în interfață.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-eyebrow">{t('contact')}</span>
          <h1 className="section-title mt-3">{t('contactHeading')}</h1>
          <p className="section-subtitle mt-3">{t('contactSubtitle')}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ─── Contact details ────────────────────────────── */}
          <ul className="space-y-4">
            {contactDetails.map((item) => (
              <li key={item.label} className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  <item.icon size={20} />
                </span>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-semibold text-surface-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-surface-900 dark:text-white">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* ─── Contact form ────────────────────────────────── */}
          <div className="card p-6 sm:p-8">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400">
                  <CheckCircle2 size={28} />
                </span>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white">
                  {t('messageSentTitle')}
                </h2>
                <p className="mt-1.5 max-w-sm text-sm text-surface-500 dark:text-surface-400">
                  {t('messageSentText')}
                </p>
                <button
                  type="button"
                  className="btn-secondary mt-6"
                  onClick={() => setIsSubmitted(false)}
                >
                  {t('sendAnotherMessage')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label={t('contactNameLabel')}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={fieldErrors.name}
                    placeholder={t('contactNamePlaceholder')}
                    autoComplete="name"
                  />
                  <FormField
                    label={t('email')}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={fieldErrors.email}
                    placeholder={t('emailPlaceholderExample')}
                    autoComplete="email"
                  />
                </div>

                <FormField
                  label={t('contactSubjectLabel')}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={t('contactSubjectPlaceholder')}
                />

                <div>
                  <label htmlFor="contact-message" className="label">
                    {t('contactMessageLabel')}
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    placeholder={t('contactMessagePlaceholder')}
                    aria-invalid={fieldErrors.message ? true : undefined}
                    className="input resize-none"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 text-xs font-medium text-danger-600">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      {t('sendMessage')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
