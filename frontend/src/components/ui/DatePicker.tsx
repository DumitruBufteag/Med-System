import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn, dateLocale, parseISODate, toISODate, todayISO } from '../../lib/utils';

interface DatePickerProps {
  /** Selected day as "YYYY-MM-DD", or an empty string when nothing is picked. */
  value: string;
  onChange: (value: string) => void;
  /** Accessible name, since the trigger shows only the formatted date. */
  label: string;
  /** Earliest selectable day, inclusive. */
  min?: string;
  /** Latest selectable day, inclusive. */
  max?: string;
  id?: string;
  hasError?: boolean;
  className?: string;
}

/** Monday-first, the way a calendar is read in Romania. */
const WEEK_STARTS_ON_MONDAY_OFFSET = 6;

/** Uppercases the first letter, which `Intl` leaves lowercase in Romanian. */
function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/**
 * `new Date(y, m + 1, 1)` rolls over into the next year on its own, so month
 * arithmetic never has to special-case December.
 */
function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

/**
 * A calendar built from regular elements instead of `<input type="date">`.
 *
 * The native picker paints its panel with the operating system's own colours and
 * ignores the app theme — and on Firefox and Safari it barely exists. This one
 * uses the same tokens as `Dropdown`, so the booking form reads as one piece in
 * both light and dark mode, and it speaks whichever language the interface is in:
 * month and weekday names come from `Intl`, not from a hardcoded list.
 */
export default function DatePicker({
  value,
  onChange,
  label,
  min,
  max,
  id,
  hasError = false,
  className,
}: DatePickerProps) {
  const { t, language } = useLanguage();
  const locale = dateLocale(language);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  const selected = parseISODate(value);
  const minDate = min ? parseISODate(min) : null;
  const maxDate = max ? parseISODate(max) : null;

  /** The month on screen. Starts on the selected day, or on the first allowed one. */
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selected ?? minDate ?? new Date()),
  );

  /** The day the arrow keys move around, kept separate from the selection. */
  const [focusedDate, setFocusedDate] = useState(() => selected ?? minDate ?? new Date());

  /**
   * Opening resets the view to the selected day, so a panel reopened after the
   * value changed elsewhere does not show a stale month. This runs on the click
   * rather than in an effect watching `isOpen`: the state is settled before the
   * panel renders, instead of being corrected in a second pass.
   */
  function open() {
    const target = selected ?? minDate ?? new Date();

    setFocusedDate(target);
    setVisibleMonth(startOfMonth(target));
    setIsOpen(true);
  }

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

  // Roving focus: only the focused day is tabbable, and it takes the caret as it
  // moves, so the whole grid is reachable with the arrow keys alone.
  useEffect(() => {
    if (!isOpen) return;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus();
  }, [isOpen, focusedDate]);

  const weekdayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 1 Jan 2024 was a Monday, so seven days from there cover the week in order.
    return Array.from({ length: 7 }, (_, index) =>
      capitalise(formatter.format(new Date(2024, 0, 1 + index)).replace('.', '')),
    );
  }, [locale]);

  const monthLabel = useMemo(
    () =>
      capitalise(
        new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(visibleMonth),
      ),
    [locale, visibleMonth],
  );

  const triggerLabel = useMemo(() => {
    if (!selected) return t('selectDate');

    return capitalise(
      selected.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, [locale, selected, t]);

  function isDisabled(date: Date): boolean {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  /** The cells of the visible month, padded so the 1st lands under its weekday. */
  const days = useMemo(() => {
    const firstOfMonth = startOfMonth(visibleMonth);
    const leadingBlanks = (firstOfMonth.getDay() + WEEK_STARTS_ON_MONDAY_OFFSET) % 7;
    const daysInMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    ).getDate();

    return [
      ...Array.from({ length: leadingBlanks }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1),
      ),
    ];
  }, [visibleMonth]);

  function select(date: Date) {
    if (isDisabled(date)) return;

    onChange(toISODate(date));
    setIsOpen(false);
  }

  /**
   * Moves the caret, following it into the neighbouring month when it crosses
   * over.
   *
   * The target is clamped to the selectable range first: a disabled button
   * cannot take focus, so letting the caret land on an out-of-range day would
   * strand keyboard navigation with nothing focused.
   */
  function moveFocus(target: Date) {
    let next = target;
    if (minDate && next < minDate) next = minDate;
    if (maxDate && next > maxDate) next = maxDate;

    setFocusedDate(next);

    if (
      next.getMonth() !== visibleMonth.getMonth() ||
      next.getFullYear() !== visibleMonth.getFullYear()
    ) {
      setVisibleMonth(startOfMonth(next));
    }
  }

  function handleGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusedDate, -1),
      ArrowRight: () => addDays(focusedDate, 1),
      ArrowUp: () => addDays(focusedDate, -7),
      ArrowDown: () => addDays(focusedDate, 7),
      Home: () =>
        addDays(focusedDate, -((focusedDate.getDay() + WEEK_STARTS_ON_MONDAY_OFFSET) % 7)),
      End: () =>
        addDays(focusedDate, 6 - ((focusedDate.getDay() + WEEK_STARTS_ON_MONDAY_OFFSET) % 7)),
      PageUp: () => addMonths(focusedDate, -1),
      PageDown: () => addMonths(focusedDate, 1),
    };

    const move = moves[event.key];
    if (move) {
      // Otherwise the arrow keys scroll the page under the open calendar.
      event.preventDefault();
      moveFocus(move());
    }
  }

  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);

  // Disabled once every day in that direction is out of range, so the visitor
  // cannot page endlessly into months where nothing is selectable.
  const canGoBack = !minDate || new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0) >= minDate;
  const canGoForward = !maxDate || nextMonth <= maxDate;

  const today = todayISO();
  const canPickToday = !isDisabled(parseISODate(today) as Date);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        aria-label={label}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg border bg-white px-3.5 py-2.5 text-left text-sm text-surface-900 transition-all duration-200 dark:bg-surface-900 dark:text-white',
          hasError
            ? 'border-danger-500'
            : isOpen
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600',
        )}
      >
        <CalendarDays size={16} className="shrink-0 text-surface-400" />
        <span className={cn('flex-1 truncate', !selected && 'text-surface-400')}>
          {triggerLabel}
        </span>
      </button>

      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[19.5rem] rounded-xl border border-surface-200 bg-white p-3 shadow-lg dark:border-surface-700 dark:bg-surface-900"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setVisibleMonth(previousMonth)}
              disabled={!canGoBack}
              aria-label={t('previousMonth')}
              className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent dark:text-surface-400 dark:hover:bg-surface-800"
            >
              <ChevronLeft size={18} />
            </button>

            <p aria-live="polite" className="text-sm font-semibold text-surface-900 dark:text-white">
              {monthLabel}
            </p>

            <button
              type="button"
              onClick={() => setVisibleMonth(nextMonth)}
              disabled={!canGoForward}
              aria-label={t('nextMonth')}
              className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent dark:text-surface-400 dark:hover:bg-surface-800"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {weekdayNames.map((weekday) => (
              <abbr
                key={weekday}
                title={weekday}
                className="py-1 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-surface-400 no-underline"
              >
                {weekday}
              </abbr>
            ))}
          </div>

          <div
            ref={gridRef}
            role="grid"
            aria-label={label}
            onKeyDown={handleGridKeyDown}
            className="grid grid-cols-7 gap-1"
          >
            {days.map((day, index) => {
              if (!day) {
                return <span key={`blank-${index}`} aria-hidden="true" />;
              }

              const disabled = isDisabled(day);
              const isSelected = selected !== null && isSameDay(day, selected);
              const isToday = toISODate(day) === today;
              const isFocused = isSameDay(day, focusedDate);

              return (
                <button
                  key={toISODate(day)}
                  type="button"
                  role="gridcell"
                  data-focused={isFocused}
                  // Roving tabindex: one stop for the whole grid, the arrows do the rest.
                  tabIndex={isFocused ? 0 : -1}
                  disabled={disabled}
                  aria-selected={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => select(day)}
                  className={cn(
                    'relative flex aspect-square items-center justify-center rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
                    isSelected
                      ? 'bg-primary-600 font-semibold text-white'
                      : disabled
                        ? 'cursor-not-allowed text-surface-300 dark:text-surface-700'
                        : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
                    isToday && !isSelected && 'font-semibold text-primary-600 dark:text-primary-400',
                  )}
                >
                  {day.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary-500" />
                  )}
                </button>
              );
            })}
          </div>

          {canPickToday && (
            <button
              type="button"
              onClick={() => select(parseISODate(today) as Date)}
              className="mt-2 w-full rounded-lg py-2 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10"
            >
              {t('todayShortcut')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
