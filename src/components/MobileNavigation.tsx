import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calculator,
  FileText,
  Home as HomeIcon,
  Landmark,
  MessageCircle,
  Sprout,
  TrendingUp,
  X,
} from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';
import { BrandLogo } from './BrandLogo';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const { pathname, search } = useLocation();
  const { language, setLanguage, t, dt } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const activeTabParam = new URLSearchParams(search).get('tab');

  const navLinks = [
    { to: '/', label: t.nav.home, icon: HomeIcon, active: pathname === '/' },
    {
      to: '/dashboard?tab=chatbot',
      label: dt.tabs.chatbot,
      icon: MessageCircle,
      active:
        (pathname === '/dashboard' && (!activeTabParam || activeTabParam === 'chatbot')) ||
        pathname === '/chatbot',
    },
    {
      to: '/dashboard?tab=crop-health',
      label: dt.tabs.cropHealth,
      icon: TrendingUp,
      active: pathname === '/dashboard' && activeTabParam === 'crop-health',
    },
    {
      to: '/dashboard?tab=loss-optimisation',
      label: dt.tabs.lossOptimisation,
      icon: Calculator,
      active: pathname === '/dashboard' && activeTabParam === 'loss-optimisation',
    },
    {
      to: '/dashboard?tab=information',
      label: dt.tabs.informationShort,
      icon: Landmark,
      active: pathname === '/dashboard' && activeTabParam === 'information',
    },
    {
      to: '/dashboard?tab=farm',
      label: t.dashboard.farmDetailsTitle,
      icon: Sprout,
      active: pathname === '/dashboard' && activeTabParam === 'farm',
    },
    { to: '/reports', label: t.nav.reports, icon: FileText, active: pathname === '/reports' },
  ];

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
          className="md:hidden fixed inset-0 z-[100] w-screen h-[100dvh] bg-brand-cream flex flex-col overflow-y-auto"
        >
          {/* Dedicated Top Header inside Portal Drawer */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-brand-border/80 shrink-0 bg-brand-cream">
            <Link to="/" onClick={onClose} aria-label={t.brandName}>
              <BrandLogo />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="w-10 h-10 rounded-full border border-brand-border bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-light-green transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Centered Scroll-Safe Navigation Stack */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
            aria-label="Mobile navigation links"
            className="flex-1 flex flex-col justify-between px-6 py-7 gap-8"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = item.active;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[12px] font-manrope text-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#E7EBDD] text-brand-dark border border-[#C6D4B5]'
                        : 'text-brand-dark/85 hover:bg-brand-light'
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-brand-dark text-brand-cream'
                          : 'bg-brand-light text-brand-dark border border-brand-border/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="space-y-5 pt-4 border-t border-brand-border/75">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-brand-dark text-white text-base font-medium tracking-wide rounded-full hover:bg-brand-green transition-colors shadow-xs"
              >
                {t.nav.tryItFree}
              </Link>

              <div className="space-y-2">
                <p className="text-xs font-medium text-brand-muted text-center uppercase tracking-wider">
                  Language
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setLanguage(option.code)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-[10px] border transition-colors cursor-pointer ${
                        language === option.code
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-brand-light text-brand-dark border-brand-border hover:bg-brand-light-green/60'
                      }`}
                    >
                      {option.nativeName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-label={t.nav.toggleMenu}
        aria-expanded={isOpen}
        data-testid="mobile-menu-trigger"
        className="md:hidden relative z-50 w-10 h-10 rounded-full flex items-center justify-center text-brand-dark hover:bg-brand-light-green/60 transition-colors cursor-pointer"
      >
        <span className="relative w-6 h-5 block">
          <span
            className={`absolute left-0 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
              isOpen ? 'top-[9px] rotate-45' : 'top-[6px]'
            }`}
          />
          <span
            className={`absolute left-0 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
              isOpen ? 'top-[9px] -rotate-45' : 'top-[13px]'
            }`}
          />
        </span>
      </button>

      {typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </>
  );
};
