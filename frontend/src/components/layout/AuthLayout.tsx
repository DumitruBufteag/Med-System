import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, CalendarCheck, Plus, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from '../ui/ThemeToggle';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Rendered under the form, e.g. the link to the other auth page. */
  footer: ReactNode;
}

/** Split screen shared by the login and register pages. */
export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const { t } = useLanguage();

  const highlights = [
    { icon: CalendarCheck, text: t('authHighlight1') },
    { icon: BadgeCheck, text: t('authHighlight2') },
    { icon: ShieldCheck, text: t('authHighlight3') },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-primary-950 via-primary-700 to-success-600 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Plus size={18} strokeWidth={3} />
          </span>
          <span className="text-lg font-semibold">
            Med<span className="font-extrabold">Gid</span>
          </span>
        </Link>

        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">{t('authBrandHeading')}</h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-white/85">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon size={18} />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} {t('projectFooterNote')}
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col bg-white dark:bg-surface-950">
        <header className="flex items-center justify-between p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface-500 transition-colors hover:text-primary-600 dark:text-surface-400"
          >
            <ArrowLeft size={16} />
            {t('backHome')}
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-white">
                <Plus size={18} strokeWidth={3} />
              </span>
              <span className="text-lg font-semibold text-surface-900 dark:text-white">
                Med<span className="font-extrabold text-primary-600">Gid</span>
              </span>
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
              {footer}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
