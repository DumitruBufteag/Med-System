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
import { CLINIC_TYPE_LABELS } from '../types';
import { mockReviews, mockStats } from '../data/mockData';
import { useClinics } from '../contexts/ClinicContext';
import { useLanguage } from '../contexts/LanguageContext';
import { containerVariants, itemVariants } from '../lib/animations';
import { cn } from '../lib/utils';
import SearchBar from '../components/ui/SearchBar';
import ClinicCard from '../components/ui/ClinicCard';
import SpecialtyCard from '../components/ui/SpecialtyCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

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
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-surface-900 sm:text-5xl lg:text-[3.4rem] dark:text-white"
            >
              {t('heroTitle')}{' '}
              <span className="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
                {t('heroTitleAccent')}
              </span>
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
              className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-surface-200 pt-7 dark:border-surface-800"
            >
              {[
                { value: `${mockStats.clinicsCount}+`, label: 'clinici private' },
                { value: `${mockStats.doctorsCount}+`, label: 'medici verificați' },
                { value: `${mockStats.specialtiesCount}`, label: 'specialități' },
              ].map((stat) => (
                <li key={stat.label}>
                  <strong className="block text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
                    {stat.value}
                  </strong>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    {stat.label}
                  </span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Illustrative booking card */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-md"
            aria-label="Exemplu de programare"
          >
            <div className="card p-6 shadow-xl">
              <header className="flex items-center gap-3.5 border-b border-surface-200 pb-5 dark:border-surface-800">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  DM
                </span>
                <div>
                  <strong className="block text-base text-surface-900 dark:text-white">
                    Dr. Daniela Moraru
                  </strong>
                  <small className="text-surface-500 dark:text-surface-400">
                    Cardiolog · Medpark
                  </small>
                </div>
              </header>

              <ul className="my-5 grid grid-cols-3 gap-2.5">
                {[
                  { time: '09:00', state: 'taken' },
                  { time: '10:30', state: 'free' },
                  { time: '11:15', state: 'active' },
                  { time: '13:00', state: 'free' },
                  { time: '15:45', state: 'taken' },
                  { time: '16:30', state: 'free' },
                ].map((slot) => (
                  <li
                    key={slot.time}
                    className={cn(
                      'rounded-lg border py-2.5 text-center text-sm font-semibold',
                      slot.state === 'active' &&
                        'border-primary-600 bg-primary-600 text-white',
                      slot.state === 'free' &&
                        'border-surface-200 text-surface-700 dark:border-surface-700 dark:text-surface-300',
                      slot.state === 'taken' &&
                        'border-surface-200 bg-surface-50 text-surface-300 line-through dark:border-surface-800 dark:bg-surface-800/50 dark:text-surface-600',
                    )}
                  >
                    {slot.time}
                  </li>
                ))}
              </ul>

              <Link to="/programare" className="btn-primary w-full">
                Confirmă programarea
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="card absolute -left-4 -top-5 flex items-center gap-2.5 px-4 py-3 shadow-lg sm:-left-8">
              <Star size={16} className="fill-warning-500 text-warning-500" />
              <div>
                <strong className="block text-sm text-surface-900 dark:text-white">4.8 / 5</strong>
                <small className="text-xs text-surface-500">peste 9 000 de recenzii</small>
              </div>
            </div>

            <div className="card absolute -bottom-5 -right-3 flex items-center gap-2.5 px-4 py-3 shadow-lg sm:-right-6">
              <Clock size={16} className="text-success-500" />
              <div>
                <strong className="block text-sm text-surface-900 dark:text-white">
                  Urgențe 24/7
                </strong>
                <small className="text-xs text-surface-500">14 clinici deschise acum</small>
              </div>
            </div>
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

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Tip clinică">
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
                {type === 'all' ? 'Toate' : CLINIC_TYPE_LABELS[type]}
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
            <h2 className="section-title mt-3">Trei pași până la consultație</h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: 'Caută',
                text: 'Filtrează clinicile după oraș, specialitate, preț sau program de lucru.',
              },
              {
                icon: Star,
                title: 'Compară',
                text: 'Vezi recenziile pacienților, serviciile oferite și tarifele orientative.',
              },
              {
                icon: CalendarCheck,
                title: 'Programează-te',
                text: 'Alege ora liberă și primești confirmarea pe e-mail sau SMS.',
              },
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
              {
                icon: BadgeCheck,
                title: 'Informații verificate',
                text: 'Fiecare clinică este validată înainte de publicare, iar datele sunt actualizate periodic.',
              },
              {
                icon: Clock,
                title: 'Economisești timp',
                text: 'Fără apeluri telefonice repetate — vezi într-un singur loc unde există locuri libere.',
              },
              {
                icon: Wallet,
                title: 'Prețuri transparente',
                text: 'Tarife orientative pentru consultații și investigații, afișate înainte de programare.',
              },
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
            <span className="section-eyebrow">Recenzii</span>
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
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ești o clinică privată din Moldova?
              </h2>
              <p className="mt-3 text-white/80">
                Adaugă-ți instituția în catalog, gestionează programările online și ajungi la
                pacienți din toată țara.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/inregistrare-clinica"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-transform hover:-translate-y-0.5"
              >
                Înregistrează clinica
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone size={17} />
                Vorbește cu noi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
