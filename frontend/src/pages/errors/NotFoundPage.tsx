import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-32 text-center">
      <Compass size={48} className="mb-5 text-primary-500" />
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Eroare 404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
        Pagina nu a fost găsită
      </h1>
      <p className="mt-3 text-sm text-surface-500 dark:text-surface-400">
        Adresa accesată nu există sau a fost mutată.
      </p>
      <Link to="/" className="btn-primary mt-7">
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
