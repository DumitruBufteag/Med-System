import { Link } from 'react-router-dom';
import { MapPin, Phone, Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const columns = [
    {
      title: t('forPatients'),
      links: [
        { label: t('clinics'), to: '/clinici' },
        { label: t('specialties'), to: '/specialitati' },
        { label: t('bookAppointment'), to: '/programare' },
        { label: t('myAppointmentsTitle'), to: '/programarile-mele' },
      ],
    },
    {
      title: t('forClinics'),
      links: [
        { label: 'Înregistrare clinică', to: '/inregistrare-clinica' },
        { label: 'Panou de administrare', to: '/admin' },
        { label: 'Tarife', to: '/tarife' },
        { label: 'Suport', to: '/suport' },
      ],
    },
    {
      title: t('about'),
      links: [
        { label: 'Despre proiect', to: '/despre' },
        { label: 'Termeni și condiții', to: '/termeni' },
        { label: 'Confidențialitate', to: '/confidentialitate' },
        { label: t('contact'), to: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-surface-950 pt-16 text-surface-400">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-10 sm:px-6 lg:grid-cols-[1.1fr_1.6fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-white">
              <Plus size={18} strokeWidth={3} />
            </span>
            <span className="text-lg font-semibold text-white">
              Med<span className="font-extrabold text-primary-400">Gid</span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm">{t('footerTagline')}</p>

          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-primary-400" />
              +373 22 000 000
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="text-primary-400" />
              Chișinău, Republica Moldova
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{column.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t border-white/10 px-4 py-6 text-xs text-surface-500 sm:px-6 lg:px-8">
        <small>© {new Date().getFullYear()} MedGid Moldova. Proiect de practică.</small>
        <small>{t('disclaimer')}</small>
      </div>
    </footer>
  );
}
