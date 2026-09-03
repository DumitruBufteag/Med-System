import { useId, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  /** Adds the show/hide toggle and starts masked. */
  isPassword?: boolean;
}

export default function FormField({
  label,
  error,
  isPassword = false,
  className,
  ...inputProps
}: FormFieldProps) {
  const { t } = useLanguage();
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>

      <div className="relative">
        <input
          {...inputProps}
          id={id}
          type={isPassword ? (isVisible ? 'text' : 'password') : inputProps.type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'input',
            isPassword && 'pr-11',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? t('hidePassword') : t('showPassword')}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-surface-400 transition-colors hover:text-surface-700 dark:hover:text-surface-200"
          >
            {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger-600">
          {error}
        </p>
      )}
    </div>
  );
}
