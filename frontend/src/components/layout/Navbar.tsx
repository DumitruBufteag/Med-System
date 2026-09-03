import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CalendarCheck, CalendarClock, LogOut, Menu, Plus, UserRound, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/clinici', label: t('clinics') },
    { to: '/specialitati', label: t('specialties') },
    { to: '/cum-functioneaza', label: t('howItWorks') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200/70 bg-white/85 backdrop-blur-lg dark:border-surface-800 dark:bg-surface-950/85">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-white">
            <Plus size={18} strokeWidth={3} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-surface-900 dark:text-white">
              Med
              <span className="font-extrabold text-primary-600 dark:text-primary-400">Gid</span>
            </span>
            <small className="text-[10px] font-semibold uppercase tracking-[0.16em] text-surface-400">
              Moldova
            </small>
          </span>
        </Link>

        <div className="hidden flex-1 items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
            className="rounded-full px-2.5 py-2 text-xs font-bold uppercase text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
          >
            {language}
          </button>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/programare" className="btn-primary">
                <CalendarCheck size={17} />
                {t('bookAppointment')}
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                {t('login')}
              </Link>
              <Link to="/register" className="btn-primary">
                {t('register')}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Meniu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="ml-auto rounded-lg p-2 text-surface-700 md:hidden dark:text-surface-300"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-surface-200 bg-white px-4 pb-5 pt-3 md:hidden dark:border-surface-800 dark:bg-surface-950">
          <div className="flex flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="border-b border-surface-100 py-3 text-sm font-medium text-surface-700 dark:border-surface-800 dark:text-surface-300"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/programare" className="btn-primary" onClick={() => setIsOpen(false)}>
                  <CalendarCheck size={17} />
                  {t('bookAppointment')}
                </Link>
                <Link
                  to="/programarile-mele"
                  className="btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <CalendarClock size={17} />
                  {t('myAppointmentsTitle')}
                </Link>
                <Link to="/profil" className="btn-secondary" onClick={() => setIsOpen(false)}>
                  <UserRound size={17} />
                  {t('profileTitle')}
                </Link>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={17} />
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" onClick={() => setIsOpen(false)}>
                  {t('login')}
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setIsOpen(false)}>
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
