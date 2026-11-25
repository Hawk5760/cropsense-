import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.languageLabel}: ${currentOption.nativeName}`}
        className={`inline-flex items-center gap-2 border border-brand-border bg-brand-cream/90 text-brand-dark hover:bg-brand-light transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs rounded-full' : 'px-4 py-2 text-sm rounded-full'
        }`}
      >
        <Globe className="w-4 h-4 text-brand-dark/80 shrink-0" aria-hidden="true" />
        <span className="font-medium">{currentOption.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-brand-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={t.languageLabel}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
            className="absolute right-0 mt-2 w-40 rounded-[10px] border border-brand-border bg-brand-cream shadow-md py-1 z-50 overflow-hidden"
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const isSelected = option.code === language;
              return (
                <button
                  key={option.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLanguage(option.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-light-green/80 text-brand-dark font-medium'
                      : 'text-brand-dark hover:bg-brand-light'
                  }`}
                >
                  <span>{option.nativeName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
