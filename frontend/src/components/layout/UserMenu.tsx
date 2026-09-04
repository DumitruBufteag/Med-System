import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getInitials } from '../../lib/utils';

/** Avatar with the signed-in user's details and the sign-out action. */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('myAccount')}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full border border-surface-200 py-1 pl-1 pr-2.5 transition-colors hover:border-primary-300 dark:border-surface-700 dark:hover:border-primary-500/40"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
          {getInitials(user.name)}
        </span>
        <ChevronDown size={15} className="text-surface-400" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-xl border border-surface-200 bg-white p-1.5 shadow-lg dark:border-surface-700 dark:bg-surface-900"
        >
          <div className="border-b border-surface-200 px-3 py-2.5 dark:border-surface-800">
            <strong className="block truncate text-sm text-surface-900 dark:text-white">
              {user.name}
            </strong>
            <small className="block truncate text-xs text-surface-500">{user.email}</small>
            <span className="badge-primary mt-1.5">{user.role}</span>
          </div>

          <Link
            to="/profil"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            <UserRound size={16} />
            {t('profileTitle')}
          </Link>

          {user.role === 'admin' ? (
            <Link
              to="/admin"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              <LayoutDashboard size={16} />
              {t('footerAdminPanel')}
            </Link>
          ) : (
            <Link
              to="/programarile-mele"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              <CalendarClock size={16} />
              {t('myAppointmentsTitle')}
            </Link>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            <LogOut size={16} />
            {t('signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
