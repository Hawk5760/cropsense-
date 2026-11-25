import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FileText,
  Home as HomeIcon,
  LayoutDashboard,
  MessageCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { MobileNavigation } from './MobileNavigation';
import { useLanguage } from '../hooks/useLanguage';

export const Navbar: React.FC = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { t, dt } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, search]);

  const activeTabParam = new URLSearchParams(search).get('tab');

  const dockItems = [
    {
      to: '/',
      label: t.nav.home,
      icon: HomeIcon,
      active: pathname === '/',
    },
    {
      to: '/dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      active: pathname === '/dashboard' && (!activeTabParam || activeTabParam === 'chatbot'),
    },
    {
      to: '/dashboard?tab=crop-health',
      label: dt.tabs.cropHealthShort,
      icon: TrendingUp,
      active:
        (pathname === '/dashboard' && activeTabParam === 'crop-health') ||
        pathname === '/historical-analysis',
    },
    {
      to: '/dashboard?tab=information',
      label: dt.tabs.informationShort,
      icon: MessageCircle,
      active: pathname === '/dashboard' && activeTabParam === 'information',
    },
    {
      to: '/reports',
      label: t.nav.reports,
      icon: FileText,
      active: pathname === '/reports',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? scrolled
            ? 'bg-brand-cream/92 backdrop-blur-md shadow-sm border-b border-brand-border/65'
            : 'bg-transparent'
          : scrolled
            ? 'bg-brand-cream/94 backdrop-blur-md shadow-sm border-b border-brand-border/75'
            : 'bg-brand-cream/78 backdrop-blur-sm border-b border-brand-border/45'
      }`}
    >
      <div className="w-full px-3.5 sm:px-5 lg:px-6">
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 h-16 md:h-20">
          {/* Far Left: CropSense Green Fields Logo */}
          <Link
            to="/"
            aria-label={t.brandName}
            className="flex items-center shrink-0 animate-fade-down stagger-1"
          >
            <BrandLogo />
          </Link>

          {/* Center: Apple-Style Magnifying Dock Navigation (Desktop/Laptop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-40"
          >
            <Dock
              panelHeight={48}
              baseItemSize={36}
              magnification={54}
              distance={130}
              tooltipPlacement="bottom"
              ariaLabel="CropSense navigation dock"
              className={
                isHome && !scrolled
                  ? 'bg-brand-cream/85 border-brand-dark/15 shadow-[0_6px_24px_rgba(45,58,46,0.10)]'
                  : 'bg-brand-cream/95 border-brand-border/90 shadow-[0_6px_22px_rgba(45,58,46,0.07)]'
              }
            >
              {dockItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DockItem
                    key={item.to}
                    isActive={item.active}
                    ariaLabel={item.label}
                    ariaCurrent={item.active ? 'page' : undefined}
                    onClick={() => navigate(item.to)}
                  >
                    <DockLabel>{item.label}</DockLabel>
                    <DockIcon>
                      <Icon className="w-full h-full stroke-[1.9]" aria-hidden="true" />
                    </DockIcon>
                  </DockItem>
                );
              })}
            </Dock>
          </nav>

          {/* Far Right: Language Selector + Primary CTA */}
          <div className="hidden md:flex items-center gap-3 ml-auto shrink-0 animate-fade-down stagger-3">
            <LanguageSelector compact={isHome} />
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              {isHome ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-5 py-2.5 bg-brand-dark text-white text-sm font-medium tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  {t.nav.tryItFree}
                </Link>
              ) : (
                <Link
                  to="/dashboard?tab=chatbot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-sm font-medium tracking-wide rounded-full hover:bg-brand-green transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  <span>{t.nav.newAnalysis}</span>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Right Controls: Quick Language Switcher + Menu Trigger */}
          <div className="flex md:hidden items-center gap-1.5 ml-auto shrink-0">
            <LanguageSelector compact />
            <MobileNavigation
              isOpen={mobileOpen}
              onToggle={() => setMobileOpen((prev) => !prev)}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
