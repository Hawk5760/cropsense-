import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Sprout, Trees } from 'lucide-react';
import { ChatInterface } from '../components/ChatInterface';
import { EASE_EDITORIAL } from '../components/MotionPrimitives';
import { AiChatbotLogo } from '../components/SectionLogos';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { getFarmLocationLabel } from '../utils/farmValidation';

export const AIChatbot: React.FC = () => {
  const { farmDetails } = useFarmDetails();
  const { t } = useLanguage();

  const locationLabel = getFarmLocationLabel(farmDetails);
  const translatedCrop = t.options.crops[farmDetails.crop] ?? farmDetails.crop;
  const translatedUnit = t.options.units[farmDetails.farmSizeUnit] ?? farmDetails.farmSizeUnit;

  return (
    <WorkspaceLayout equalHeight backdropOpacityClass="opacity-40">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06, ease: EASE_EDITORIAL }}
        aria-labelledby="chatbot-heading"
        data-testid="chatbot-workspace-panel"
        className="h-full flex flex-col gap-4"
      >
        {/* Desktop Editorial Header + Matching Icon Context Bar */}
        <header className="hidden lg:flex flex-col xl:flex-row xl:items-end xl:justify-between gap-3 rounded-[14px] border border-brand-border bg-brand-cream/95 px-6 py-4 shadow-[0_4px_20px_rgba(45,58,46,0.05)]">
          <div className="flex items-center gap-3.5">
            <AiChatbotLogo className="w-12 h-12 sm:w-13 sm:h-13 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-muted">
                {t.dashboard.intelligenceKicker}
              </p>
              <h1
                id="chatbot-heading"
                className="mt-0.5 font-playfair text-2xl md:text-3xl font-semibold text-brand-dark tracking-tight"
              >
                {t.chatbot.title}
              </h1>
              <p className="mt-0.5 text-sm text-brand-muted">{t.chatbot.subtitle}</p>
            </div>
          </div>

          <div
            aria-label="Saved farm context"
            className="inline-flex flex-wrap items-center rounded-[10px] border border-brand-border bg-brand-light/70 divide-x divide-brand-border/80 self-start xl:self-end"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark">
              <MapPin className="w-3.5 h-3.5 text-brand-dark/75 shrink-0" aria-hidden="true" />
              <span>{locationLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark">
              <Sprout className="w-3.5 h-3.5 text-brand-dark/75 shrink-0" aria-hidden="true" />
              <span>{translatedCrop}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-dark tabular-nums">
              <Trees className="w-3.5 h-3.5 text-brand-dark/75 shrink-0" aria-hidden="true" />
              <span>
                {farmDetails.farmSize} {translatedUnit}
              </span>
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <ChatInterface />
        </div>
      </motion.section>
    </WorkspaceLayout>
  );
};
