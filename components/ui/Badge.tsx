import { cn, STATUS_CONFIG } from '@/lib/utils';
import { BookingStatus } from '@/types';

interface BadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', className)}
      style={{ color: config.color, background: config.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

interface SimpleBadgeProps {
  children: React.ReactNode;
  color?: 'gold' | 'green' | 'red' | 'blue' | 'gray' | 'purple';
  className?: string;
}

const colorMap = {
  gold: { text: '#C9A84C', bg: 'rgba(201,168,76,0.12)' },
  green: { text: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  red: { text: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  blue: { text: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
  gray: { text: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
  purple: { text: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
};

export function Badge({ children, color = 'gold', className }: SimpleBadgeProps) {
  const c = colorMap[color];
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ color: c.text, background: c.bg }}
    >
      {children}
    </span>
  );
}
