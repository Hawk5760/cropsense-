import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Landmark,
  MessageCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { FINANCIAL_SCHEMES } from '../data/schemesData';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import type { SchemeCategory } from '../types/cropsense';
import { filterFinancialSchemes, isSchemeTailoredToFarm } from '../utils/schemeFilters';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface InformationDashboardProps {
  onOpenFinancialChatbot: (initialPrompt?: string) => void;
}

const CATEGORY_ORDER: Array<'All' | SchemeCategory> = [
  'All',
  'Insurance',
  'Central & State Schemes',
  'Subsidies',
  'NGO Grants',
  'Compensation',
];

const CATEGORY_BADGE_COLORS: Record<SchemeCategory, string> = {
  Insurance: 'bg-sky-50 text-sky-900 border-sky-200',
  'Central & State Schemes': 'bg-[#E7EBDD] text-brand-dark border-[#C6D4B5]',
  Subsidies: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  'NGO Grants': 'bg-violet-50 text-violet-900 border-violet-200',
  Compensation: 'bg-amber-50 text-amber-900 border-amber-200',
};

export const InformationDashboard: React.FC<InformationDashboardProps> = ({
  onOpenFinancialChatbot,
}) => {
  const { farmDetails } = useFarmDetails();
  const { dt } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<'All' | SchemeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyRelevant, setOnlyRelevant] = useState(false);

  const visibleSchemes = useMemo(
    () =>
      filterFinancialSchemes(FINANCIAL_SCHEMES, {
        searchQuery,
        category: selectedCategory,
        onlyMatchingFarm: onlyRelevant,
        farmDetails,
      }),
    [selectedCategory, searchQuery, onlyRelevant, farmDetails]
  );

  return (
    <div
      className="flex flex-col h-[calc(100dvh-204px)] min-h-[440px] max-h-[760px] lg:h-[calc(100vh-295px)] lg:min-h-[540px] lg:max-h-[760px] gap-2.5 sm:gap-3.5 overflow-hidden"
      data-testid="information-dashboard"
    >
      {/* Header + Quick AI Scheme Matcher CTA (Pinned) */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-start md:justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h2 className="font-manrope text-lg sm:text-2xl font-bold text-brand-dark tracking-tight leading-snug">
            {dt.information.title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5 line-clamp-2 sm:line-clamp-none">
            {dt.information.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenFinancialChatbot()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 self-start px-3.5 sm:px-4 py-2 rounded-full bg-brand-dark text-white text-xs sm:text-sm font-medium hover:bg-brand-green transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{dt.information.askAiAboutScheme}</span>
        </button>
      </div>

      {/* Search + Category Filters + Farm Match Toggle (Pinned) */}
      <div
        data-testid="information-filters-bar"
        className="shrink-0 rounded-[12px] border border-brand-border bg-white/95 p-3 sm:p-4 space-y-2.5 sm:space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              data-testid="schemes-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dt.information.searchPlaceholder}
              aria-label={dt.information.searchPlaceholder}
              className="w-full rounded-[9px] border border-brand-border bg-brand-cream/85 pl-9 pr-3 py-2 text-sm text-brand-dark placeholder:text-brand-muted/75 focus:border-brand-green focus:bg-white"
            />
          </div>

          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[9px] border border-brand-border bg-brand-light/70 text-xs font-medium text-brand-dark cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              data-testid="schemes-match-farm-toggle"
              checked={onlyRelevant}
              onChange={(e) => setOnlyRelevant(e.target.checked)}
              className="rounded border-brand-border accent-brand-green w-4 h-4 cursor-pointer"
            />
            <Sparkles className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
            <span>
              {dt.information.onlyMyFarmToggle} ({farmDetails.state || 'India'})
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div
            className="flex flex-nowrap overflow-x-auto sm:flex-wrap gap-1.5 pb-0.5 no-scrollbar"
            role="group"
            aria-label="Scheme categories"
          >
            {CATEGORY_ORDER.map((cat) => {
              const active = selectedCategory === cat;
              const label =
                cat === 'All'
                  ? dt.information.allCategories
                  : dt.information.categories[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={active}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-brand-dark text-white'
                      : 'bg-brand-light text-brand-dark/80 border border-brand-border hover:bg-[#E7EBDD]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <span className="text-xs text-brand-muted tabular-nums self-end sm:self-auto shrink-0">
            {visibleSchemes.length} / {FINANCIAL_SCHEMES.length}
          </span>
        </div>
      </div>

      {/* Scrollable Scheme Cards Area */}
      <div
        data-testid="information-schemes-scroll"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-0.5 sm:pr-1.5 pb-14 lg:pb-2"
      >
        {visibleSchemes.length === 0 ? (
          <div className="rounded-[12px] border border-brand-border bg-white/90 p-8 sm:p-10 text-center space-y-2">
            <Landmark className="w-8 h-8 text-brand-muted mx-auto" aria-hidden="true" />
            <h3 className="font-manrope text-base font-bold text-brand-dark">
              {dt.information.emptyTitle}
            </h3>
            <p className="text-sm text-brand-muted">{dt.information.emptyBody}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4">
          {visibleSchemes.map((scheme, idx) => {
            const isRelevant = isSchemeTailoredToFarm(scheme, farmDetails);
            return (
              <motion.article
                key={scheme.id}
                data-testid={`scheme-card-${scheme.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: Math.min(idx * 0.03, 0.25),
                  ease: EASE_EDITORIAL,
                }}
                className="rounded-[12px] border border-brand-border bg-white/95 p-3.5 sm:p-5 flex flex-col justify-between gap-3.5 sm:gap-4 shadow-[0_2px_12px_rgba(45,58,46,0.04)] hover:border-brand-green/55 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        CATEGORY_BADGE_COLORS[scheme.category]
                      }`}
                    >
                      {dt.information.categories[scheme.category]}
                    </span>
                    {isRelevant && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E7EBDD] text-brand-dark border border-[#C6D4B5]">
                        <Sparkles className="w-3 h-3 text-brand-green" aria-hidden="true" />
                        {dt.information.matchedBadge}
                      </span>
                    )}
                    <span className="sm:ml-auto text-[11px] font-medium text-brand-muted bg-brand-light border border-brand-border/80 rounded-full px-2 py-0.5">
                      {scheme.states.includes('All India')
                        ? dt.information.allIndiaBadge
                        : scheme.states.slice(0, 2).join(', ')}
                    </span>
                  </div>

                  {/* Title & Authority */}
                  <div>
                    <h3 className="font-manrope text-base font-bold text-brand-dark leading-snug">
                      {scheme.name}
                    </h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">{scheme.authority}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-dark/85 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-brand-dark">
                      {dt.information.benefitsHeading}
                    </p>
                    <ul className="space-y-1 text-xs text-brand-dark/85">
                      {scheme.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-brand-dark">
                      {dt.information.eligibilityHeading}
                    </p>
                    <ul className="space-y-0.5 text-xs text-brand-muted list-disc pl-4">
                      {scheme.eligibility.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="rounded-[9px] bg-brand-light/70 border border-brand-border/75 p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                      <span>{dt.information.documentsHeading}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.requiredDocuments.map((doc, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-brand-dark bg-white border border-brand-border/80 rounded-md px-2 py-0.5"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Deadline & Actions */}
                <div className="pt-3 border-t border-brand-border/70 flex flex-col gap-2.5">
                  {scheme.deadline && (
                    <div className="flex items-start gap-1.5 text-[11px] text-brand-muted min-w-0">
                      <CalendarClock
                        className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="leading-snug">
                        <strong className="text-brand-dark">
                          {dt.information.deadlineHeading}:
                        </strong>{' '}
                        {scheme.deadline}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-brand-dark text-white text-xs font-semibold hover:bg-brand-green transition-colors"
                    >
                      <span>{dt.information.applyButton}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenFinancialChatbot(
                          `Am I eligible for ${scheme.name} based on my saved farm details, and what exact steps should I follow to apply?`
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] border border-brand-border bg-brand-light text-brand-dark text-xs font-semibold hover:bg-[#E7EBDD] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                      <span>{dt.information.askAiAboutScheme}</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
};
