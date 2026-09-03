import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export default function Spinner({ size = 24, className, label }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-surface-400', className)}>
      <Loader2 size={size} className="animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
