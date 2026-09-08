import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  const sections = [
    { title: t('privacyDataTitle'), text: t('privacyDataText') },
    { title: t('privacyUseTitle'), text: t('privacyUseText') },
    { title: t('privacySharingTitle'), text: t('privacySharingText') },
    { title: t('privacySecurityTitle'), text: t('privacySecurityText') },
    { title: t('privacyRightsTitle'), text: t('privacyRightsText') },
    { title: t('privacyCookiesTitle'), text: t('privacyCookiesText') },
    { title: t('privacyContactTitle'), text: t('privacyContactText') },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-eyebrow">{t('footerPrivacy')}</span>
          <h1 className="section-title mt-3">{t('privacyHeading')}</h1>
          <p className="section-subtitle mt-3">{t('privacySubtitle')}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-surface-400 dark:text-surface-500">
            {t('privacyLastUpdated')}
          </p>
        </div>

        <div className="card divide-y divide-surface-200 p-2 dark:divide-surface-800">
          {sections.map((section) => (
            <article key={section.title} className="p-6">
              <h2 className="mb-2 text-base font-bold text-surface-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                {section.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
