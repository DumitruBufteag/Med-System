import { useMemo, useState, type FormEvent } from 'react';
import { MapPin, Search } from 'lucide-react';
import type { City } from '../../types';
import { CITIES } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import Dropdown from './Dropdown';

interface SearchBarProps {
  initialQuery?: string;
  initialCity?: City | 'all';
  onSearch: (query: string, city: City | 'all') => void;
}

export default function SearchBar({
  initialQuery = '',
  initialCity = 'all',
  onSearch,
}: SearchBarProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState<City | 'all'>(initialCity);

  const cityOptions = useMemo(
    () => [
      { value: 'all', label: t('allCities') },
      ...CITIES.map((option) => ({ value: option, label: option })),
    ],
    [t],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch(query.trim(), city);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col gap-1 rounded-2xl border border-surface-200 bg-white p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
        <Search size={19} className="shrink-0 text-surface-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="w-full min-w-0 border-none bg-transparent py-3 text-sm text-surface-900 placeholder-surface-400 outline-none dark:text-white"
        />
      </div>

      <div className="mx-3 h-px bg-surface-200 sm:mx-0 sm:h-8 sm:w-px dark:bg-surface-800" />

      <Dropdown
        bare
        className="sm:w-52"
        label={t('searchCity')}
        icon={<MapPin size={19} />}
        value={city}
        options={cityOptions}
        onChange={(next) => setCity(next as City | 'all')}
      />

      <button type="submit" className="btn-primary shrink-0 px-7 py-3">
        {t('searchButton')}
      </button>
    </form>
  );
}
