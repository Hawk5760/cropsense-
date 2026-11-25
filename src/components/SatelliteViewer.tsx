import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Columns2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';
import { SatelliteViewerLogo } from './SectionLogos';

const AVAILABLE_YEARS = [2026, 2025, 2024, 2023, 2022];

export const SatelliteViewer: React.FC = () => {
  const { t } = useLanguage();
  const [primaryYear, setPrimaryYear] = useState<number>(2026);
  const [compareYear, setCompareYear] = useState<number>(2022);
  const [sideBySide, setSideBySide] = useState<boolean>(true);

  const displayedYears = sideBySide ? [primaryYear, compareYear] : [primaryYear];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.18, ease: EASE_EDITORIAL }}
      aria-labelledby="satellite-panel-heading"
      className="rounded-[14px] border border-brand-border bg-brand-cream/95 p-6 shadow-[0_4px_20px_rgba(45,58,46,0.05)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-border/75">
        <div className="flex items-center gap-3.5">
          <SatelliteViewerLogo className="w-12 h-12 shrink-0" />
          <div>
            <h2
              id="satellite-panel-heading"
              className="font-playfair text-2xl font-semibold text-brand-dark leading-tight"
            >
              {t.historical.satellitePanelTitle}
            </h2>
            <p className="text-xs text-brand-muted mt-1">{t.historical.satelliteProviderNote}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="sat-primary-year" className="text-xs font-medium text-brand-dark/80">
              {t.historical.primaryYearLabel}
            </label>
            <div className="relative">
              <select
                id="sat-primary-year"
                value={primaryYear}
                onChange={(e) => setPrimaryYear(Number(e.target.value))}
                className="appearance-none rounded-[7px] border border-brand-border bg-brand-cream pl-3 pr-7 py-1.5 text-xs font-medium text-brand-dark tabular-nums cursor-pointer focus:border-brand-green"
              >
                {AVAILABLE_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-3.5 h-3.5 text-brand-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {sideBySide && (
            <div className="flex items-center gap-2">
              <label htmlFor="sat-compare-year" className="text-xs font-medium text-brand-dark/80">
                {t.historical.compareYearLabel}
              </label>
              <div className="relative">
                <select
                  id="sat-compare-year"
                  value={compareYear}
                  onChange={(e) => setCompareYear(Number(e.target.value))}
                  className="appearance-none rounded-[7px] border border-brand-border bg-brand-cream pl-3 pr-7 py-1.5 text-xs font-medium text-brand-dark tabular-nums cursor-pointer focus:border-brand-green"
                >
                  {AVAILABLE_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-brand-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setSideBySide((prev) => !prev)}
            aria-pressed={sideBySide}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-[7px] border transition-colors cursor-pointer ${
              sideBySide
                ? 'bg-[#E5ECDA] border-[#C3D1B3] text-brand-dark font-medium'
                : 'bg-brand-light border-brand-border text-brand-muted hover:text-brand-dark'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.historical.satelliteCompareToggle}</span>
          </motion.button>
        </div>
      </div>

      {/* Honest placeholder panels matching attached reference */}
      <div
        className={`mt-5 grid gap-4 ${
          sideBySide ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {displayedYears.map((year, idx) => (
          <motion.div
            layout
            key={`${sideBySide ? 'dual' : 'single'}-${idx}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
            className="min-h-[195px] rounded-[12px] border border-dashed border-[#CFCAC0] bg-[#FAF8F5] p-6 flex flex-col items-center justify-center text-center"
          >
            <SatelliteViewerLogo className="w-14 h-14 mb-3 opacity-90" />
            <h3 className="text-sm font-semibold text-brand-dark tabular-nums">
              {t.historical.satelliteForYear} {year}
            </h3>
            <p className="mt-1 text-xs text-brand-muted">
              {t.historical.comingSoonShort}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
