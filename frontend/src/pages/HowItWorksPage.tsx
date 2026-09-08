import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  MessageSquareText,
  ShieldCheck,
  Search,
  Star,
  Wallet,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowItWorksPage() {
  const { t } = useLanguage();

  const patientSteps = [
    { icon: Search, title: t('stepSearchTitle'), text: t('stepSearchText') },
    { icon: Star, title: t('stepCompareTitle'), text: t('stepCompareText') },
    { icon: CalendarCheck, title: t('stepBookTitle'), text: t('stepBookText') },
  ];

  const guarantees = [
    { icon: BadgeCheck, title: t('guarantee1Title'), text: t('guarantee1Text') },
    { icon: Wallet, title: t('guarantee2Title'), text: t('guarantee2Text') },
    { icon: ShieldCheck, title: t('guarantee3Title'), text: t('guarantee3Text') },
    { icon: MessageSquareText, title: t('guarantee4Title'), text: t('guarantee4Text') },
  ];

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
    { question: t('faq4Question'), answer: t('faq4Answer') },
  ];

  return (
    <>
      {/* ─── Header ────────────────────────────────────────── */}
      <section className="border-b border-surface-200 bg-surface-50 py-16 dark:border-surface-800 dark:bg-surface-900/30">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="section-eyebrow">{t('howItWorks')}</span>
          <h1 className="section-title mt-3">{t('howItWorksHeading')}</h1>
          <p className="section-subtitle mt-3">{t('howItWorksSubtitle')}</p>
        </div>
      </section>

      {/* ─── Steps ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="grid gap-6 md:grid-cols-3">
            {patientSteps.map((step, index) => (
              <li key={step.title} className="card relative p-7">
                <span className="absolute right-6 top-5 text-5xl font-extrabold leading-none tracking-tighter text-primary-100 dark:text-primary-500/15">
                  {index + 1}
                </span>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <step.icon size={22} />
                </span>
                <h3 className="mb-2 text-lg font-bold text-surface-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex justify-center">
            <Link to="/clinici" className="btn-primary">
              {t('searchClinicCta')}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Guarantees ────────────────────────────────────── */}
      <section className="bg-surface-50 py-16 dark:bg-surface-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="section-eyebrow">{t('whyMedGidEyebrow')}</span>
            <h2 className="section-title mt-3">{t('whatYouGetHeading')}</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((item) => (
              <li key={item.title} className="card p-6">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  <item.icon size={20} />
                </span>
                <h3 className="mb-1.5 text-base font-semibold text-surface-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="section-eyebrow">{t('faqEyebrow')}</span>
            <h2 className="section-title mt-3">{t('faqHeading')}</h2>
          </div>

          <ul className="space-y-4">
            {faqs.map((faq) => (
              <li key={faq.question} className="card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
                  {faq.answer}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-200 p-8 text-center dark:border-surface-800">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {t('faqNotFoundText')}
            </p>
            <Link to="/contact" className="btn-secondary">
              {t('contactUsCta')}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
