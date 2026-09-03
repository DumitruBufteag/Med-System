import {
  Baby,
  Bone,
  Brain,
  Eye,
  HeartPulse,
  Smile,
  Stethoscope,
  TestTube,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the icon name stored on a Specialty onto a lucide component, so the
 * backend can send a plain string instead of the UI hard-coding each case.
 */
const iconMap: Record<string, LucideIcon> = {
  HeartPulse,
  Smile,
  Brain,
  Eye,
  Baby,
  Bone,
  TestTube,
  Stethoscope,
};

interface SpecialtyIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function SpecialtyIcon({ name, size = 22, className }: SpecialtyIconProps) {
  const Component = iconMap[name] ?? Stethoscope;
  return <Component size={size} className={className} />;
}
