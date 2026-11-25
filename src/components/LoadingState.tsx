import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ label }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2.5 text-sm text-brand-muted py-2"
    >
      <Loader2 className="w-4 h-4 text-brand-green animate-spin shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};
