import React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert } from 'lucide-react';
import type { DiseaseSeverity } from '../types/cropsense';
import { useLanguage } from '../hooks/useLanguage';

interface RiskIndicatorProps {
  severity: DiseaseSeverity;
  className?: string;
}

const SEVERITY_STYLES: Record<
  DiseaseSeverity,
  { text: string; bg: string; border: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  Healthy: {
    text: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    Icon: CheckCircle2,
  },
  Low: {
    text: 'text-brand-success',
    bg: 'bg-brand-success/10',
    border: 'border-brand-success/30',
    Icon: CheckCircle2,
  },
  Moderate: {
    text: 'text-brand-warning',
    bg: 'bg-brand-warning/10',
    border: 'border-brand-warning/35',
    Icon: AlertTriangle,
  },
  High: {
    text: 'text-brand-danger',
    bg: 'bg-brand-danger/10',
    border: 'border-brand-danger/30',
    Icon: ShieldAlert,
  },
  Critical: {
    text: 'text-brand-danger',
    bg: 'bg-brand-danger/15',
    border: 'border-brand-danger/45',
    Icon: ShieldAlert,
  },
  Unknown: {
    text: 'text-brand-muted',
    bg: 'bg-brand-light',
    border: 'border-brand-border',
    Icon: HelpCircle,
  },
};

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ severity, className = '' }) => {
  const { t } = useLanguage();
  const config = SEVERITY_STYLES[severity] ?? SEVERITY_STYLES.Unknown;
  const { Icon } = config;
  const label =
    (t.options.severities as Record<string, string>)[severity] ?? severity;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-[4px] border ${config.bg} ${config.border} ${config.text} whitespace-nowrap ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
