import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Phone,
  Search,
  Star,
  Wallet,
} from 'lucide-react';
import type { City, ClinicType } from '../types';
import { mockReviews, mockStats } from '../data/mockData';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import { containerVariants, itemVariants } from '../lib/animations';
import { cn, getClinicTypeLabel } from '../lib/utils';
import SearchBar from '../components/ui/SearchBar';
import GradientText from '../components/ui/GradientText';
import CountUp from '../components/ui/CountUp';
import ClinicCard from '../components/ui/ClinicCard';
import SpecialtyCard from '../components/ui/SpecialtyCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import heroImage from '../assets/hero/clinic-doctor.jpg';

const quickTags = ['Cardiologie', 'Stomatologie', 'Analize', 'Pediatrie', 'RMN'];

const typeFilters: (ClinicType | 'all')[] = [
  'all',
  'hospital',
  'medical_center',
  'specialized_clinic',
];

export default function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { clinics, specialties, specialtyNames, isLoading, error, refresh } = useClinics();
  const [activeType, setActiveType] = useState<ClinicType | 'all'>('all');

  const visibleClinics = useMemo(
    () =>
      activeType === 'all' ? clinics : clinics.filter((clinic) => clinic.type === activeType),
    [clinics, activeType],
  );

  function handleSearch(query: string, city: City | 'all') {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city !== 'all') params.set('oras', city);
    navigate(`/clinici?${params.toString()}`);
  }

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white py-16 sm:py-20 dark:from-primary-950/40 dark:via-surface-950 dark:to-surface-950">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.85fr] lg:px-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-surface-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-primary-700 shadow-sm dark:border-surface-800 dark:bg-surface-900 dark:text-primary-300"
            >
              <BadgeCheck size={15} />
              {t('heroBadge')}
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              <GradientText
                className="gradient-text-heading"
                colors={['#0e86ad', '#10b981', '#7bcae0', '#0e86ad']}
                animationSpeed={6}
              >
                {t('heroTitle')} {t('heroTitleAccent')}
              </GradientText>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-lg text-surface-500 dark:text-surface-400"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
              <SearchBar onSearch={handleSearch} />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-5 flex flex-wrap items-center gap-2 text-sm text-surface-500 dark:text-surface-400"
            >
              <span>{t('popularSearches')}</span>
              {quickTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/clinici?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-surface-200 bg-white px-3 py-1 text-[13px] text-surface-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-surface-200 pt-8 dark:border-surface-800"
            >
              {[
                { to: mockStats.clinicsCount, suffix: '+', label: t('statClinics') },
                { to: mockStats.doctorsCount, suffix: '+', label: t('statDoctors') },
                { to: mockStats.specialtiesCount, suffix: '', label: t('statSpecialties') },
              ].map((stat, index) => (
                <li key={stat.label}>
                  <strong className="flex items-baseline text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl dark:text-white">
                    <CountUp
                      to={stat.to}
                      duration={1.5}
                      delay={0.1 * index}
                      separator=","
                    />
                    {stat.suffix}
                  </strong>
                  <span className="mt-1 block text-sm text-surface-500 dark:text-surface-400">
                    {stat.label}
                  </span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Hero image */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-md"
            aria-hidden="true"
          >
            <img
              src={heroImage}
              alt=""
              width={900}
              height={1125}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            />
          </motion.aside>
        </div>
      </section>

      {/* ─── Specialties ───────────────────────────────────── */}
      <section id="specialitati" className="bg-surface-50 py-20 dark:bg-surface-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="section-eyebrow">{t('specialties')}</span>
            <h2 className="section-title mt-3">{t('specialtiesTitle')}</h2>
            <p className="section-subtitle mt-3">{t('specialtiesSubtitle')}</p>
          </div>

          {isLoading && specialties.length === 0 ? (
            <Spinner className="py-16" label={t('loading')} />
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {specialties.map((specialty) => (
                <li key={specialty.id}>
                  <SpecialtyCard specialty={specialty} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-9 flex justify-center">
            <Link to="/specialitati" className="btn-secondary">
              {t('viewAllSpecialties')}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured clinics ──────────────────────────────── */}
      <section id="clinici" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="section-eyebrow">{t('clinics')}</span>
              <h2 className="section-title mt-3">{t('featuredTitle')}</h2>
              <p className="section-subtitle mt-3">{t('featuredSubtitle')}</p>
            </div>
            <Link to="/clinici" className="btn-secondary shrink-0 self-start sm:self-auto">
              {t('viewAllClinics')}
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t('clinicType')}>
            {typeFilters.map((type) => (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={activeType === type}
                onClick={() => setActiveType(type)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  activeType === type
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-surface-200 bg-white text-surface-500 hover:border-primary-300 hover:text-primary-700 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-400',
                )}
              >
                {type === 'all' ? t('allTypes') : getClinicTypeLabel(type, t)}
              </button>
            ))}
          </div>

          <div className="mt-7">
            {error ? (
              <ErrorState
                title={t('errorTitle')}
                message={error}
                onRetry={() => void refresh()}
                retryLabel={t('retry')}
              />
            ) : isLoading ? (
              <Spinner className="py-20" label={t('loading')} />
            ) : visibleClinics.length === 0 ? (
              <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleClinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    specialtyNames={specialtyNames}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────── */}
      <section
        id="cum-functioneaza"
        className="bg-surface-50 py-20 dark:bg-surface-900/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="section-eyebrow">{t('howItWorks')}</span>
            <h2 className="section-title mt-3">{t('howItWorksHeading')}</h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: t('stepSearchTitle'), text: t('stepSearchText') },
              { icon: Star, title: t('stepCompareTitle'), text: t('stepCompareText') },
              { icon: CalendarCheck, title: t('stepBookTitle'), text: t('stepBookText') },
            ].map((step, index) => (
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

          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { icon: BadgeCheck, title: t('homeBenefit1Title'), text: t('homeBenefit1Text') },
              { icon: Clock, title: t('homeBenefit2Title'), text: t('homeBenefit2Text') },
              { icon: Wallet, title: t('homeBenefit3Title'), text: t('homeBenefit3Text') },
            ].map((benefit) => (
              <li key={benefit.title} className="card flex gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400">
                  <benefit.icon size={20} />
                </span>
                <div>
                  <h4 className="mb-1 text-base font-semibold text-surface-900 dark:text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{benefit.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Reviews ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="section-eyebrow">{t('reviewsEyebrow')}</span>
            <h2 className="section-title mt-3">{t('reviewsTitle')}</h2>
          </div>

          <ul className="grid gap-6 md:grid-cols-3">
            {mockReviews.map((review) => (
              <li key={review.id} className="card p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={cn(
                        index < review.rating
                          ? 'fill-warning-500 text-warning-500'
                          : 'text-surface-300 dark:text-surface-700',
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300">
                  „{review.comment}"
                </p>
                <footer className="mt-4 text-sm font-semibold text-surface-900 dark:text-white">
                  {review.authorName}
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-gradient-to-br from-primary-950 via-primary-700 to-success-600 px-8 py-12 shadow-xl sm:px-12 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white">{t('ctaHeading')}</h2>
              <p className="mt-3 text-white/80">{t('ctaText')}</p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/inregistrare-clinica"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-transform hover:-translate-y-0.5"
              >
                {t('ctaRegisterClinic')}
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone size={17} />
                {t('ctaTalkToUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
