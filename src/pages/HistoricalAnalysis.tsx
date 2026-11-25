import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Info,
  Layers,
  Leaf,
  MapPin,
  Sprout,
  Thermometer,
  Trees,
  TrendingUp,
} from 'lucide-react';
import { HistoricalCharts } from '../components/HistoricalCharts';
import { EASE_EDITORIAL } from '../components/MotionPrimitives';
import { SatelliteViewer } from '../components/SatelliteViewer';
import { AnalysisConfigLogo, HistoricalAnalysisLogo } from '../components/SectionLogos';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import {
  DASHBOARD_BG_IMAGE,
  HISTORICAL_PARAMETERS,
  SEASON_OPTIONS,
  TERRACED_FIELD_IMAGE,
  type HistoricalParameterKey,
} from '../data/cropData';
import type { SeasonType } from '../types/cropsense';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { getFarmLocationLabel } from '../utils/farmValidation';
import { createHistoricalReport } from '../utils/reportUtils';

const PARAMETER_ICONS: Record<
  HistoricalParameterKey,
  React.ComponentType<{ className?: string }>
> = {
  vegetationHealth: Leaf,
  vegetationIndex: TrendingUp,
  cropCoverage: Layers,
  waterAvailability: Droplets,
  soilCondition: Sprout,
  environmentalTrends: Thermometer,
};

export const HistoricalAnalysis: React.FC = () => {
  const { farmDetails, addReport } = useFarmDetails();
  const { t } = useLanguage();

  const [selectedSeason, setSelectedSeason] = useState<SeasonType>(farmDetails.season);
  const [selectedParams, setSelectedParams] = useState<HistoricalParameterKey[]>([
    ...HISTORICAL_PARAMETERS,
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotice, setGeneratedNotice] = useState(false);

  useEffect(() => {
    setSelectedSeason(farmDetails.season);
  }, [farmDetails.season]);

  const locationLabel = getFarmLocationLabel(farmDetails);
  const translatedCrop = t.options.crops[farmDetails.crop] ?? farmDetails.crop;
  const translatedUnit = t.options.units[farmDetails.farmSizeUnit] ?? farmDetails.farmSizeUnit;

  const toggleParameter = (param: HistoricalParameterKey) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((item) => item !== param) : [...prev, param]
    );
    setGeneratedNotice(false);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGeneratedNotice(false);
    window.setTimeout(() => {
      const paramLabels = selectedParams.map((key) => t.historical.parameters[key]);
      const report = createHistoricalReport(
        farmDetails,
        selectedSeason,
        '2022–2026',
        paramLabels
      );
      addReport(report);
      setIsGenerating(false);
      setGeneratedNotice(true);
    }, 450);
  };

  return (
    <WorkspaceLayout backdropOpacityClass="opacity-40">
      <div className="space-y-4" data-testid="historical-workspace-panel">
        {/* 1. Hero Banner Card matching attached reference */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
          className="relative rounded-[14px] border border-brand-border bg-brand-cream overflow-hidden px-6 lg:px-7 py-6 shadow-[0_4px_20px_rgba(45,58,46,0.05)]"
        >
          {/* Right-side terraced hills landscape fading smoothly into warm cream */}
          <img
            src={TERRACED_FIELD_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-90 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/95 to-[#FAF8F5]/15 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <HistoricalAnalysisLogo className="w-13 h-13 sm:w-14 sm:h-14 shrink-0 mt-0.5 drop-shadow-xs" />
              <div>
                <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-dark/75">
                  {t.dashboard.intelligenceKicker}
                </p>
                <h1 className="mt-1 font-playfair text-3xl sm:text-4xl lg:text-[42px] font-semibold text-brand-dark leading-[1.08] tracking-tight">
                  {t.historical.title}
                </h1>
                <p className="mt-2 text-sm sm:text-[15px] text-brand-dark/80">
                  {t.historical.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom-right frosted context bar with icon segments */}
            <div
              aria-label={t.historical.farmContextTitle}
              className="inline-flex flex-wrap items-center rounded-[10px] border border-brand-border bg-[#FAF8F5]/92 backdrop-blur-sm shadow-xs divide-x divide-brand-border/80 self-start xl:self-end"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-dark">
                <MapPin className="w-3.5 h-3.5 text-brand-dark/80 shrink-0" aria-hidden="true" />
                <span>{locationLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-dark">
                <Sprout className="w-3.5 h-3.5 text-brand-dark/80 shrink-0" aria-hidden="true" />
                <span>{translatedCrop}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-dark tabular-nums">
                <Trees className="w-3.5 h-3.5 text-brand-dark/80 shrink-0" aria-hidden="true" />
                <span>
                  {farmDetails.farmSize} {translatedUnit}
                </span>
              </span>
            </div>
          </div>
        </motion.header>

        {/* 2. Coming Soon Notice Banner matching attached reference */}
        <motion.div
          role="note"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: EASE_EDITORIAL }}
          className="relative rounded-[12px] border border-brand-border bg-[#F2F4EC] overflow-hidden px-5 py-4 shadow-[0_2px_12px_rgba(45,58,46,0.03)]"
        >
          <div
            className="hidden sm:block absolute right-0 top-0 bottom-0 w-72 pointer-events-none"
            aria-hidden="true"
          >
            <img
              src={DASHBOARD_BG_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-bottom opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2F4EC] via-[#F2F4EC]/75 to-transparent" />
          </div>

          <div className="relative z-10 flex items-start gap-3 max-w-3xl sm:pr-52">
            <Info className="w-5 h-5 text-[#2F6B36] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold text-brand-dark">
                {t.historical.comingSoonBannerTitle}
              </h2>
              <p className="text-xs text-brand-dark/80 leading-relaxed">
                {t.historical.comingSoonBannerBody}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3. Analysis Configuration Card matching attached reference */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.12, ease: EASE_EDITORIAL }}
          aria-labelledby="hist-config-heading"
          className="rounded-[14px] border border-brand-border bg-brand-cream/95 p-6 flex flex-col gap-5 shadow-[0_4px_20px_rgba(45,58,46,0.05)]"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-brand-border/75">
            <AnalysisConfigLogo className="w-11 h-11 shrink-0" />
            <h2
              id="hist-config-heading"
              className="font-playfair text-2xl font-semibold text-brand-dark leading-tight"
            >
              {t.historical.configTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year Range */}
            <div>
              <label
                htmlFor="hist-year-range"
                className="block text-xs font-semibold text-brand-dark mb-1.5"
              >
                {t.historical.yearRangeLabel}
              </label>
              <div className="relative">
                <Calendar
                  className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  id="hist-year-range"
                  defaultValue="5y"
                  className="w-full appearance-none rounded-[8px] border border-brand-border bg-brand-cream pl-9 pr-8 py-2.5 text-sm text-brand-dark cursor-pointer focus:border-brand-green"
                >
                  <option value="5y">{t.historical.lastFiveYears}</option>
                </select>
                <ChevronDown
                  className="w-4 h-4 text-brand-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Season */}
            <div>
              <label
                htmlFor="hist-season-select"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark mb-1.5"
              >
                <Sprout className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                <span>{t.historical.seasonLabel}</span>
              </label>
              <div className="relative">
                <Sprout
                  className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  id="hist-season-select"
                  value={selectedSeason}
                  onChange={(e) => {
                    setSelectedSeason(e.target.value as SeasonType);
                    setGeneratedNotice(false);
                  }}
                  className="w-full appearance-none rounded-[8px] border border-brand-border bg-brand-cream pl-9 pr-8 py-2.5 text-sm text-brand-dark cursor-pointer focus:border-brand-green"
                >
                  {SEASON_OPTIONS.map((season) => (
                    <option key={season} value={season}>
                      {t.options.seasons[season] ?? season}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-brand-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Analysis Parameters 3-col grid with per-parameter icons */}
          <div>
            <p className="text-xs font-semibold text-brand-dark mb-2.5">
              {t.historical.parametersLabel}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {HISTORICAL_PARAMETERS.map((param) => {
                const checked = selectedParams.includes(param);
                const ParamIcon = PARAMETER_ICONS[param];
                return (
                  <motion.label
                    key={param}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.14 }}
                    className={`flex items-center gap-2.5 rounded-[8px] border px-3.5 py-2.5 text-xs cursor-pointer transition-colors select-none ${
                      checked
                        ? 'border-[#C5D3B3] bg-[#EEF3E4] text-brand-dark font-medium'
                        : 'border-brand-border bg-brand-light/60 text-brand-muted hover:bg-brand-light'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleParameter(param)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors shrink-0 ${
                        checked
                          ? 'bg-brand-dark border-brand-dark text-white'
                          : 'bg-brand-cream border-brand-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.6]" />
                    </span>
                    <ParamIcon
                      className={`w-4 h-4 shrink-0 ${
                        checked ? 'text-brand-dark/80' : 'text-brand-muted'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{t.historical.parameters[param]}</span>
                  </motion.label>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="min-h-[32px] flex items-center">
              <AnimatePresence>
                {generatedNotice && (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
                    className="flex items-start gap-2 text-xs text-brand-dark bg-[#E7EBDD]/90 border border-brand-success/35 rounded-[8px] px-3.5 py-2"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-brand-success shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{t.historical.reportQueuedMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.985 }}
              disabled={isGenerating || selectedParams.length === 0}
              onClick={handleGenerateReport}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-brand-dark text-white text-sm font-medium tracking-wider uppercase rounded-[8px] hover:bg-brand-green transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span>
                {isGenerating ? t.historical.generatingButton : t.historical.generateButton}
              </span>
            </motion.button>
          </div>
        </motion.section>

        {/* 4. Satellite Imagery Viewer */}
        <SatelliteViewer />

        {/* 5. Recharts 5-Year Workspace */}
        <HistoricalCharts season={selectedSeason} />
      </div>
    </WorkspaceLayout>
  );
};
