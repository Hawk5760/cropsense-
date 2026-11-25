import React, { useEffect, useState } from 'react';
import { ChevronRight, MapPin, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FarmDetails } from './FarmDetails';
import { WeatherMonitor } from './WeatherMonitor';
import { DASHBOARD_BG_IMAGE } from '../data/cropData';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { getFarmLocationLabel } from '../utils/farmValidation';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  equalHeight?: boolean;
  alwaysShowLeftOnMobile?: boolean;
  hideMobileContextBar?: boolean;
  backdropOpacityClass?: string;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  children,
  hideMobileContextBar = false,
  backdropOpacityClass = 'opacity-80',
}) => {
  const { farmDetails, weatherData } = useFarmDetails();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const locationLabel = getFarmLocationLabel(farmDetails);
  const translatedCrop = t.options.crops[farmDetails.crop] ?? farmDetails.crop;
  const translatedUnit = t.options.units[farmDetails.farmSizeUnit] ?? farmDetails.farmSizeUnit;
  const tempValue =
    weatherData?.current?.temperatureC !== undefined
      ? `${Math.round(weatherData.current.temperatureC)}°C`
      : null;

  return (
    <main className="relative min-h-screen bg-brand-cream pt-[68px] lg:pt-24 pb-[84px] lg:pb-16">
      {/* Full-width natural editorial landscape backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-brand-cream" aria-hidden="true">
        <img
          src={DASHBOARD_BG_IMAGE}
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-bottom ${backdropOpacityClass}`}
        />
      </div>

      {/* Dedicated Mobile Layout (< lg) vs Dedicated Laptop 2-Column Layout (>= lg) */}
      <div className="relative z-10 w-full px-2.5 sm:px-4 lg:px-5 pt-1.5 lg:pt-2">
        {isDesktop ? (
          /* LAPTOP / DESKTOP WORKSPACE: Persistent Left Farm+Weather Sidebar + Full-Width Right Workspace */
          <div className="grid grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)] gap-5 items-start">
            <aside aria-label={t.dashboard.farmDetailsTitle} className="space-y-4">
              <FarmDetails />
              <WeatherMonitor />
            </aside>
            <div className="min-w-0 flex flex-col">{children}</div>
          </div>
        ) : (
          /* MOBILE WORKSPACE: Slim 1-Row Farm & Weather Pill Bar + Clean Full-Width Screen */
          <div className="max-w-2xl mx-auto space-y-2.5">
            {!hideMobileContextBar && (
              <button
                type="button"
                onClick={() => navigate('/dashboard?tab=farm')}
                data-testid="mobile-farm-context-strip"
                className="w-full flex items-center justify-between gap-2 rounded-[11px] border border-brand-border/90 bg-brand-cream/96 px-3 py-2 text-left shadow-[0_2px_8px_rgba(45,58,46,0.04)] active:scale-[0.995] transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-brand-dark truncate">
                    {locationLabel}
                  </span>
                  <span className="text-[11px] text-brand-muted shrink-0">·</span>
                  <span className="text-xs text-brand-dark/85 truncate">
                    {translatedCrop} ({farmDetails.farmSize} {translatedUnit})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {tempValue && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#E7EBDD] text-[11px] font-semibold text-brand-dark tabular-nums">
                      <Thermometer className="w-3 h-3 text-brand-green" aria-hidden="true" />
                      {tempValue}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-brand-muted" aria-hidden="true" />
                </div>
              </button>
            )}
            <div className="min-w-0 flex flex-col">{children}</div>
          </div>
        )}
      </div>
    </main>
  );
};
