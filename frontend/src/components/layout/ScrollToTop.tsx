import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets the scroll position on every navigation. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
