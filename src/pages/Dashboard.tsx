import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Calculator,
  Landmark,
  MapPin,
  MessageCircle,
  Sprout,
  Thermometer,
  Trees,
} from 'lucide-react';
import { ChatInterface } from '../components/ChatInterface';
import { CropHealthDashboard } from '../components/CropHealthDashboard';
import { FarmDetails } from '../components/FarmDetails';
import { InformationDashboard } from '../components/InformationDashboard';
import { LossOptimisationDashboard } from '../components/LossOptimisationDashboard';
import { EASE_EDITORIAL } from '../components/MotionPrimitives';
import { WeatherMonitor } from '../components/WeatherMonitor';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import type { DashboardTabId } from '../types/cropsense';
import { getFarmLocationLabel } from '../utils/farmValidation';

const VALID_DESKTOP_TABS: DashboardTabId[] = [
  'chatbot',
  'crop-health',
  'loss-optimisation',
  'information',
];

type MobileOrDesktopTabId = DashboardTabId | 'farm';

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { farmDetails, weatherData, setAssistantMode, setPendingChatPrompt } = useFarmDetails();
  const { t, dt } = useLanguage();

  const rawTab = searchParams.get('tab') as MobileOrDesktopTabId | null;
  const isMobileFarmTab = rawTab === 'farm';
  const activeTab: DashboardTabId =
    rawTab && VALID_DESKTOP_TABS.includes(rawTab as DashboardTabId)
      ? (rawTab as DashboardTabId)
      : 'chatbot';

  const setActiveTab = (tab: DashboardTabId) => {
    setSearchParams({ tab }, { replace: false });
  };

  const handleOpenFinancialChatbot = (initialPrompt?: string) => {
    setAssistantMode('financial_assistance');
    if (initialPrompt) {
      setPendingChatPrompt(initialPrompt);
    }
    setActiveTab('chatbot');
  };

  const tabs = useMemo(
    () => [
      {
        id: 'chatbot' as DashboardTabId,
        label: dt.tabs.chatbot,
        shortLabel: dt.tabs.chatbotShort,
        icon: MessageCircle,
      },
      {
        id: 'crop-health' as DashboardTabId,
        label: dt.tabs.cropHealth,
        shortLabel: dt.tabs.cropHealthShort,
        icon: Activity,
      },
      {
        id: 'loss-optimisation' as DashboardTabId,
        label: dt.tabs.lossOptimisation,
        shortLabel: dt.tabs.lossOptimisationShort,
        icon: Calculator,
      },
      {
        id: 'information' as DashboardTabId,
        label: dt.tabs.information,
        shortLabel: dt.tabs.informationShort,
        icon: Landmark,
      },
    ],
    [dt.tabs]
  );

  const locationLabel = getFarmLocationLabel(farmDetails);
  const translatedCrop = t.options.crops[farmDetails.crop] ?? farmDetails.crop;
  const translatedUnit = t.options.units[farmDetails.farmSizeUnit] ?? farmDetails.farmSizeUnit;

  return (
    <WorkspaceLayout
      hideMobileContextBar={isMobileFarmTab}
      backdropOpacityClass="opacity-65"
    >
      {/* MOBILE-ONLY DEDICATED FARM DETAILS & WEATHER VIEW (?tab=farm) */}
      {isMobileFarmTab && (
        <div className="lg:hidden space-y-3.5" data-testid="mobile-farm-weather-view">
          <FarmDetails />
          <WeatherMonitor />
        </div>
      )}

      {/* MAIN WORKSPACE PANEL:
          - On Laptop (>= lg): Always shown with full Farm Intelligence Header + 4 Horizontal Tabs
          - On Mobile (< lg): Shown for Chat / Crop Health / Loss / Schemes (hidden when ?tab=farm is active)
            and relies on the dedicated fixed MobileBottomNav instead of a bulky top 2x2 tab block */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: EASE_EDITORIAL }}
        aria-labelledby="farm-intelligence-heading"
        data-testid="farm-intelligence-panel"
        className={`${
          isMobileFarmTab ? 'hidden lg:flex' : 'flex'
        } flex-col bg-brand-cream/96 border border-brand-border rounded-[14px] p-3 sm:p-4 lg:p-6 shadow-[0_4px_20px_rgba(45,58,46,0.05)] space-y-3 lg:space-y-5`}
      >
        {/* LAPTOP / DESKTOP HEADER + SHARED FARM CONTEXT BAR */}
        <header className="hidden lg:flex flex-col xl:flex-row xl:items-end xl:justify-between gap-3 pb-4 border-b border-brand-border/75">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-muted">
              {t.dashboard.intelligenceKicker}
            </p>
            <h1
              id="farm-intelligence-heading"
              className="mt-1 font-manrope text-3xl font-bold text-brand-dark tracking-tight leading-tight"
            >
              {t.dashboard.intelligenceHeadline}
            </h1>
          </div>

          <div
            aria-label="Shared farm context"
            className="inline-flex flex-wrap items-center rounded-[10px] border border-brand-border bg-white/85 divide-x divide-brand-border/80 self-start xl:self-end"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark">
              <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
              <span>{locationLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark">
              <Sprout className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
              <span>{translatedCrop}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark tabular-nums">
              <Trees className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
              <span>
                {farmDetails.farmSize} {translatedUnit}
              </span>
            </span>
            {weatherData?.current?.temperatureC !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-dark tabular-nums">
                <Thermometer className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
                <span>{Math.round(weatherData.current.temperatureC)}°C</span>
              </span>
            )}
          </div>
        </header>

        {/* LAPTOP / DESKTOP 4-TAB BAR (Mobile uses the dedicated fixed MobileBottomNav) */}
        <div
          role="tablist"
          aria-label="Farm intelligence dashboards"
          className="hidden lg:flex items-center gap-1.5 rounded-[12px] bg-[#ECE9E1]/95 border border-brand-border/85 p-1.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`dashboard-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`dashboard-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-auto flex items-center justify-center gap-2 rounded-[9px] px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-dark text-white shadow-xs'
                    : 'text-brand-dark/80 hover:bg-white/75 hover:text-brand-dark'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dashboard Panel */}
        <div
          role="tabpanel"
          id={`dashboard-panel-${activeTab}`}
          aria-labelledby={`dashboard-tab-${activeTab}`}
          className="flex flex-col min-w-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === 'chatbot' && (
              <motion.div
                key="chatbot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
                className="flex flex-col min-w-0"
              >
                <ChatInterface />
              </motion.div>
            )}

            {activeTab === 'crop-health' && (
              <motion.div
                key="crop-health"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
              >
                <CropHealthDashboard />
              </motion.div>
            )}

            {activeTab === 'loss-optimisation' && (
              <motion.div
                key="loss-optimisation"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
              >
                <LossOptimisationDashboard
                  onNavigateToSchemes={() => setActiveTab('information')}
                />
              </motion.div>
            )}

            {activeTab === 'information' && (
              <motion.div
                key="information"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
                className="flex flex-col min-w-0"
              >
                <InformationDashboard
                  onOpenFinancialChatbot={handleOpenFinancialChatbot}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </WorkspaceLayout>
  );
};
