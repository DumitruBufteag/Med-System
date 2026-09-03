import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  /** Accessible name, since the trigger shows only the selected label. */
  label: string;
  icon?: ReactNode;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  /** Renders the trigger without a border, for use inside a bordered field. */
  bare?: boolean;
}

/**
 * A select built from regular elements instead of `<select>`.
 * A native dropdown paints its option list with the operating system's own
 * colours, which ignores the app theme — this one uses the same tokens as the
 * rest of the interface, in both light and dark mode.
 */
export default function Dropdown({
  value,
  options,
  onChange,
  label,
  icon,
  placeholder = 'Alege...',
  className,
  triggerClassName,
  bare = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
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

  function select(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={label}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          'flex w-full items-center gap-2.5 text-left text-sm text-surface-900 transition-colors dark:text-white',
          bare
            ? 'bg-transparent px-3 py-3'
            : 'rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 hover:border-surface-300 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-surface-600',
          triggerClassName,
        )}
      >
        {icon && <span className="shrink-0 text-surface-400">{icon}</span>}
        <span className={cn('flex-1 truncate', !selected && 'text-surface-400')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-surface-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-surface-200 bg-white p-1.5 shadow-lg dark:border-surface-700 dark:bg-surface-900"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300'
                      : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check size={15} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
