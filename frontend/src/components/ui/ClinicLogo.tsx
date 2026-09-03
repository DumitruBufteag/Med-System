import { useState } from 'react';
import type { Clinic } from '../../types';
import { cn } from '../../lib/utils';

interface ClinicLogoProps {
  clinic: Pick<Clinic, 'name' | 'logo' | 'initials' | 'brandColor'>;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Shows the clinic's official logo on a white tile.
 *
 * The tile stays white in both themes on purpose: most of these logos are
 * dark artwork with no light variant, so recolouring the background would
 * make them unreadable. If the file fails to load, the initials take over.
 */
export default function ClinicLogo({ clinic, size = 'md', className }: ClinicLogoProps) {
  const [hasFailed, setHasFailed] = useState(false);
  const showLogo = Boolean(clinic.logo) && !hasFailed;

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5',
        size === 'md' ? 'h-14 w-14 p-1.5' : 'h-20 w-20 p-2.5',
        className,
      )}
      style={showLogo ? undefined : { backgroundColor: clinic.brandColor }}
    >
      {showLogo ? (
        <img
          src={clinic.logo}
          alt={`Logo ${clinic.name}`}
          loading="lazy"
          onError={() => setHasFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className={cn(
            'font-extrabold tracking-tight text-white',
            size === 'md' ? 'text-lg' : 'text-2xl',
          )}
        >
          {clinic.initials}
        </span>
      )}
    </span>
  );
}
