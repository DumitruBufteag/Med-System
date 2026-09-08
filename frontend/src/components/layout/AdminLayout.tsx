import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  LayoutDashboard,
  Plus,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import ThemeToggle from '../ui/ThemeToggle';
import UserMenu from './UserMenu';

/** Chrome shared by every admin page: a side nav plus a slim top bar. */
export default function AdminLayout() {
  const { t } = useLanguage();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: t('adminNavDashboard'), end: true },
    { to: '/admin/clinici', icon: Building2, label: t('clinics'), end: false },
    { to: '/admin/medici', icon: Stethoscope, label: t('adminNavDoctors'), end: false },
    { to: '/admin/pacienti', icon: Users, label: t('adminNavPatients'), end: false },
    { to: '/admin/programari', icon: CalendarClock, label: t('adminNavAppointments'), end: false },
  ];

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-surface-200 bg-white px-4 py-6 dark:border-surface-800 dark:bg-surface-900 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-white">
            <Plus size={18} strokeWidth={3} />
          </span>
          <span className="text-lg font-semibold text-surface-900 dark:text-white">
            Med<span className="font-extrabold text-primary-600 dark:text-primary-400">Gid</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                    : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
                )
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          {t('adminBackToSite')}
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-surface-200 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900 sm:px-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 text-white">
              <Plus size={16} strokeWidth={3} />
            </span>
            <span className="text-base font-semibold text-surface-900 dark:text-white">
              Med<span className="font-extrabold text-primary-600 dark:text-primary-400">Gid</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-surface-200 bg-white px-4 py-2 dark:border-surface-800 dark:bg-surface-900 lg:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                    : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
                )
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
