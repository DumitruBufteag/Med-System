import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { icon: Sparkles, title: t('aboutValue1Title'), text: t('aboutValue1Text') },
    { icon: HeartHandshake, title: t('aboutValue2Title'), text: t('aboutValue2Text') },
    { icon: ShieldCheck, title: t('aboutValue3Title'), text: t('aboutValue3Text') },
  ];

  return (
    <>
      <section className="border-b border-surface-200 bg-surface-50 py-16 dark:border-surface-800 dark:bg-surface-900/30">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <span className="section-eyebrow">{t('about')}</span>
          <h1 className="section-title mt-3">{t('aboutHeading')}</h1>
          <p className="section-subtitle mt-3">{t('aboutSubtitle')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="card p-7">
            <h2 className="mb-2 text-lg font-bold text-surface-900 dark:text-white">
              {t('aboutMissionTitle')}
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{t('aboutMissionText')}</p>
          </div>
          <div className="card p-7">
            <h2 className="mb-2 text-lg font-bold text-surface-900 dark:text-white">
              {t('aboutStoryTitle')}
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{t('aboutStoryText')}</p>
          </div>
        </div>
      </section>

      <section className="bg-surface-50 py-16 dark:bg-surface-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="section-title">{t('aboutValuesTitle')}</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-3">
            {values.map((item) => (
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

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            {t('aboutTeamTitle')}
          </h2>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{t('aboutTeamText')}</p>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-200 p-8 dark:border-surface-800">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">
              {t('aboutContactTitle')}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">{t('aboutContactText')}</p>
            <Link to="/contact" className="btn-secondary mt-2">
              {t('contactUsCta')}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
