import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Clock,
  Coins,
  ExternalLink,
  Factory,
  Info,
  Landmark,
  Leaf,
  Loader2,
  Recycle,
  ShieldAlert,
  Sprout,
  TrendingDown,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { postLossOptimization } from '../services/cropsenseApi';
import type { RecoveryCategory, RecoveryMethod } from '../types/cropsense';
import {
  computeLocalRevenueGap,
  normalizeFarmSizeForBackend,
  toSafeHttpUrl,
} from '../utils/backendContract';
import { formatIndianCurrency } from '../utils/farmValidation';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface LossOptimisationDashboardProps {
  onNavigateToSchemes: () => void;
}

function parseNonNegativeNumber(raw: string): number {
  const cleaned = raw.replace(/[^\d.]/g, '');
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

const CATEGORY_META: Record<
  RecoveryCategory,
  { label: string; badge: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  financial_assistance: {
    label: 'Financial Assistance',
    badge: 'bg-amber-50 text-amber-900 border-amber-200',
    Icon: Landmark,
  },
  biomass: {
    label: 'Biomass Recovery',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    Icon: Factory,
  },
  land_reuse: {
    label: 'Land Reuse',
    badge: 'bg-[#E7EBDD] text-brand-dark border-[#C6D4B5]',
    Icon: Sprout,
  },
  market_salvage: {
    label: 'Market Salvage',
    badge: 'bg-sky-50 text-sky-900 border-sky-200',
    Icon: Recycle,
  },
  carbon_credit: {
    label: 'Carbon Credit',
    badge: 'bg-teal-50 text-teal-900 border-teal-200',
    Icon: Leaf,
  },
};

export const LossOptimisationDashboard: React.FC<LossOptimisationDashboardProps> = ({
  onNavigateToSchemes,
}) => {
  const { farmDetails } = useFarmDetails();
  const { language, dt } = useLanguage();

  const normalizedFarm = useMemo(
    () => normalizeFarmSizeForBackend(farmDetails.farmSize, farmDetails.farmSizeUnit),
    [farmDetails.farmSize, farmDetails.farmSizeUnit]
  );

  const initialLastYear = parseNonNegativeNumber(farmDetails.lastYearYield);
  const initialThisYear = initialLastYear > 0 ? Math.round(initialLastYear * 0.45) : 0;
  const initialAffected = Number(Math.max(0.5, normalizedFarm.farm_size * 0.6).toFixed(2));

  const [lastYearInput, setLastYearInput] = useState<string>(
    initialLastYear > 0 ? String(initialLastYear) : ''
  );
  const [thisYearInput, setThisYearInput] = useState<string>(
    initialThisYear > 0 ? String(initialThisYear) : ''
  );
  const [affectedAreaInput, setAffectedAreaInput] = useState<string>(
    String(Math.min(normalizedFarm.farm_size, initialAffected))
  );
  const [recoveryBudgetInput, setRecoveryBudgetInput] = useState<string>('');
  const [damageReasonInput, setDamageReasonInput] = useState<string>('');

  const [methods, setMethods] = useState<RecoveryMethod[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync Last Year Harvest Value (INR) when farmer updates Farm Details
  useEffect(() => {
    const updatedLast = parseNonNegativeNumber(farmDetails.lastYearYield);
    if (updatedLast > 0) {
      setLastYearInput(String(updatedLast));
    }
  }, [farmDetails.lastYearYield]);

  // Clamp affected area if farm size drops below current affected area
  useEffect(() => {
    const currentAffected = parseNonNegativeNumber(affectedAreaInput);
    if (currentAffected > normalizedFarm.farm_size) {
      setAffectedAreaInput(String(normalizedFarm.farm_size));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedFarm.farm_size]);

  const localGap = useMemo(
    () =>
      computeLocalRevenueGap({
        lastYearValueInr: parseNonNegativeNumber(lastYearInput),
        thisYearValueInr: parseNonNegativeNumber(thisYearInput),
        affectedArea: parseNonNegativeNumber(affectedAreaInput),
        farmSize: normalizedFarm.farm_size,
        farmSizeUnit: normalizedFarm.farm_size_unit,
      }),
    [lastYearInput, thisYearInput, affectedAreaInput, normalizedFarm]
  );

  const affectedExceedsFarm = localGap.affectedArea > normalizedFarm.farm_size;

  const yoyChartData = useMemo(
    () => [
      {
        label: 'Last Year Value (₹)',
        shortLabel: 'Last Year',
        value: localGap.lastYearValueInr,
        fill: '#2D3A2E',
      },
      {
        label: 'This Year Value (₹)',
        shortLabel: 'This Year',
        value: localGap.thisYearValueInr,
        fill: '#5D7A5E',
      },
      {
        label: 'Revenue Gap (₹)',
        shortLabel: 'Gap',
        value: localGap.revenueGapInr,
        fill: '#C85A32',
      },
    ],
    [localGap]
  );

  const formatRupees = (val: number) => `₹${formatIndianCurrency(String(Math.round(val)))}`;

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  const handleAnalyzeLoss = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    const lastVal = parseNonNegativeNumber(lastYearInput);
    const thisVal = parseNonNegativeNumber(thisYearInput);
    const affectedVal = parseNonNegativeNumber(affectedAreaInput);
    const budgetVal =
      recoveryBudgetInput.trim() === '' ? null : parseNonNegativeNumber(recoveryBudgetInput);

    if (affectedVal > normalizedFarm.farm_size) {
      setErrorMessage(
        `Affected area (${affectedVal} ${normalizedFarm.farm_size_unit}) cannot exceed total farm size (${normalizedFarm.farm_size} ${normalizedFarm.farm_size_unit}).`
      );
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const rankedMethods = await postLossOptimization({
        farmDetails,
        lastYearValueInr: lastVal,
        thisYearValueInr: thisVal,
        affectedArea: affectedVal,
        recoveryBudgetInr: budgetVal,
        damageReason: damageReasonInput.trim() || undefined,
        language,
        signal: controller.signal,
      });
      setMethods(rankedMethods);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setErrorMessage('Analysis cancelled. Your form inputs have been preserved.');
      } else {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Unable to fetch recovery recommendations right now. Please try again.'
        );
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5" data-testid="loss-optimisation-dashboard">
      {/* Header */}
      <div>
        <h2 className="font-manrope text-xl sm:text-2xl font-bold text-brand-dark tracking-tight">
          {dt.lossOptimisation.title}
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Compare monetary harvest value and get ranked alternative recovery methods tailored to your crop, damage, and region.
        </p>
      </div>

      {/* Backend Schema Inputs Card */}
      <form
        onSubmit={handleAnalyzeLoss}
        className="rounded-[12px] border border-brand-border bg-white/92 p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 shadow-[0_2px_12px_rgba(45,58,46,0.04)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-manrope text-base font-bold text-brand-dark flex items-center gap-2">
            <Coins className="w-4.5 h-4.5 text-brand-green" aria-hidden="true" />
            <span>{dt.lossOptimisation.inputsTitle}</span>
          </h3>
          <span className="text-xs text-brand-muted">
            {normalizedFarm.farm_size} {normalizedFarm.farm_size_unit} · {farmDetails.crop} ·{' '}
            {farmDetails.city || farmDetails.state}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div>
            <label
              htmlFor="loss-last-year-yield"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              Last Year&apos;s Harvest Value (₹) <span className="text-brand-danger">*</span>
            </label>
            <input
              id="loss-last-year-yield"
              type="text"
              inputMode="numeric"
              value={lastYearInput ? formatIndianCurrency(lastYearInput) : ''}
              onChange={(e) => setLastYearInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="1,25,000"
              className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 px-3 py-2 text-sm text-brand-dark tabular-nums focus:border-brand-green focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="loss-current-year-yield"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              This Year&apos;s Harvest Value (₹) <span className="text-brand-danger">*</span>
            </label>
            <input
              id="loss-current-year-yield"
              type="text"
              inputMode="numeric"
              value={thisYearInput ? formatIndianCurrency(thisYearInput) : ''}
              onChange={(e) => setThisYearInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="35,000"
              className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 px-3 py-2 text-sm text-brand-dark tabular-nums focus:border-brand-green focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="loss-affected-area"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              Affected Area ({normalizedFarm.farm_size_unit}) <span className="text-brand-danger">*</span>
            </label>
            <input
              id="loss-affected-area"
              type="number"
              min="0"
              max={normalizedFarm.farm_size}
              step="any"
              value={affectedAreaInput}
              onChange={(e) => setAffectedAreaInput(e.target.value)}
              placeholder={`0 – ${normalizedFarm.farm_size}`}
              className={`w-full rounded-[8px] border px-3 py-2 text-sm text-brand-dark tabular-nums focus:bg-white ${
                affectedExceedsFarm
                  ? 'border-brand-danger bg-rose-50/40'
                  : 'border-brand-border bg-brand-cream/80 focus:border-brand-green'
              }`}
            />
            <p className="mt-0.5 text-[11px] text-brand-muted">
              Max: {normalizedFarm.farm_size} {normalizedFarm.farm_size_unit}
            </p>
          </div>

          <div>
            <label
              htmlFor="loss-recovery-budget"
              className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
            >
              <span>Recovery Budget (₹)</span>
              <span className="text-[10px] font-normal text-brand-muted">Optional</span>
            </label>
            <input
              id="loss-recovery-budget"
              type="text"
              inputMode="numeric"
              value={recoveryBudgetInput ? formatIndianCurrency(recoveryBudgetInput) : ''}
              onChange={(e) => setRecoveryBudgetInput(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="e.g. 10,000"
              className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 px-3 py-2 text-sm text-brand-dark tabular-nums focus:border-brand-green focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="loss-damage-reason"
            className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
          >
            <span>Damage Reason (Optional)</span>
            <span className="text-[10px] font-normal text-brand-muted tabular-nums">
              {damageReasonInput.length}/400
            </span>
          </label>
          <input
            id="loss-damage-reason"
            type="text"
            maxLength={400}
            value={damageReasonInput}
            onChange={(e) => setDamageReasonInput(e.target.value)}
            placeholder="e.g. Severe fungal disease or excess rainfall damaged standing crop"
            className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 px-3 py-2 text-sm text-brand-dark placeholder:text-brand-muted/70 focus:border-brand-green focus:bg-white"
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-[8px] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-xs text-brand-danger whitespace-pre-line"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
          {isLoading && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-[9px] border border-brand-border bg-white text-xs font-semibold text-brand-muted hover:text-brand-danger cursor-pointer"
            >
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            data-testid="loss-calculate-button"
            disabled={isLoading || affectedExceedsFarm}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[9px] bg-brand-dark text-white text-sm font-semibold hover:bg-brand-green disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Calculator className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {isLoading ? 'Finding Recovery Methods...' : dt.lossOptimisation.calculateButton}
            </span>
          </motion.button>
        </div>
      </form>

      {/* Local Input-Derived Revenue-Gap Cards + YoY Chart (per Section 4 guidance) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3 content-start">
          <div className="rounded-[12px] border border-rose-200 bg-rose-50/55 p-3 sm:p-4 col-span-2">
            <p className="text-[11px] sm:text-xs font-medium text-rose-900/80">
              Estimated Harvest Revenue Gap
            </p>
            <p
              data-testid="loss-kpi-estimated-loss"
              className="mt-1 font-manrope text-xl sm:text-2xl font-bold text-rose-900 tabular-nums"
            >
              {formatRupees(localGap.revenueGapInr)}
            </p>
            <p className="mt-1 text-[11px] text-rose-800/85">
              Input-derived harvest value difference (not net profit).
            </p>
          </div>

          <div className="rounded-[12px] border border-brand-border bg-white/92 p-3 sm:p-4">
            <p className="text-[11px] sm:text-xs font-medium text-brand-muted">Value Reduction</p>
            <p className="mt-1 font-manrope text-lg sm:text-xl font-bold text-brand-dark tabular-nums inline-flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-rose-700" aria-hidden="true" />
              <span>{localGap.reductionPct !== null ? `${localGap.reductionPct}%` : '—'}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-brand-muted tabular-nums">
              vs {formatRupees(localGap.lastYearValueInr)}
            </p>
          </div>

          <div className="rounded-[12px] border border-brand-border bg-white/92 p-3 sm:p-4">
            <p className="text-[11px] sm:text-xs font-medium text-brand-muted">Affected Share</p>
            <p className="mt-1 font-manrope text-lg sm:text-xl font-bold text-brand-dark tabular-nums">
              {localGap.affectedPct !== null ? `${localGap.affectedPct}%` : '—'}
            </p>
            <p className="mt-0.5 text-[11px] text-brand-muted tabular-nums">
              {localGap.affectedArea} / {localGap.farmSize} {localGap.farmSizeUnit}
            </p>
          </div>
        </div>

        <div className="xl:col-span-7 rounded-[12px] border border-brand-border bg-white/92 p-3.5 sm:p-4 space-y-2">
          <h3 className="font-manrope text-sm font-bold text-brand-dark">
            {dt.lossOptimisation.yoyChartTitle}
          </h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yoyChartData} margin={{ top: 10, right: 8, left: -8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D8" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  interval={0}
                  tick={{ fontSize: 11, fill: '#5B6257' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#5B6257' }}
                  tickFormatter={(v) => `₹${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { label?: string } | undefined)?.label ?? ''
                  }
                  formatter={(val: unknown) => [formatRupees(Number(val ?? 0)), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid #DAD5CB',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={44}>
                  {yoyChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ranked Recovery Methods from POST /loss/optimization */}
      <div className="space-y-3">
        <div>
          <h3 className="font-manrope text-lg font-bold text-brand-dark">
            Ranked Alternative Recovery Methods
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted">
            Ordered best-first by crop, damage, region, budget, and safety. Sources are research leads — verify local eligibility and buyer acceptance before acting.
          </p>
        </div>

        {methods === null ? (
          <div className="rounded-[12px] border border-brand-border bg-white/90 p-6 text-center space-y-1.5">
            <Calculator className="w-6 h-6 text-brand-green mx-auto" aria-hidden="true" />
            <p className="font-manrope text-sm font-bold text-brand-dark">
              Ready to rank recovery options
            </p>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Enter your harvest values, affected area, and optional damage details above, then
              click <strong>{dt.lossOptimisation.calculateButton}</strong> to fetch live ranked
              recovery paths.
            </p>
          </div>
        ) : methods.length === 0 ? (
          <div className="rounded-[12px] border border-[#C6D4B5] bg-[#EEF3E6]/75 p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="font-manrope text-sm font-bold text-brand-dark">
                No specific recovery methods returned
              </h4>
              <p className="text-xs text-brand-dark/80 mt-0.5">
                No safe, relevant recovery paths could be generated for the current inputs. Try
                adding more detail in Damage Reason or check Information &amp; Financial Assistance
                schemes directly.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" data-testid="loss-recovery-methods">
            {methods.map((item, idx) => {
              const meta = CATEGORY_META[item.category] ?? CATEGORY_META.financial_assistance;
              const Icon = meta.Icon;
              const safeSources = (item.sources ?? [])
                .map((src) => ({ title: src.title || src.url, url: toSafeHttpUrl(src.url) }))
                .filter((src): src is { title: string; url: string } => Boolean(src.url));

              return (
                <motion.article
                  key={`${item.method}-${idx}`}
                  data-testid={`recovery-method-card-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: idx * 0.04, ease: EASE_EDITORIAL }}
                  className="rounded-[12px] border border-brand-border bg-white/95 p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-[0_2px_12px_rgba(45,58,46,0.04)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-[10px] bg-[#E7EBDD] border border-[#C6D4B5] flex items-center justify-center text-brand-dark shrink-0">
                          <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-bold text-brand-green tabular-nums">
                              #{idx + 1}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badge}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <h4 className="font-manrope text-[15px] sm:text-base font-bold text-brand-dark leading-snug">
                            {item.method}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <p className="font-semibold text-brand-dark mb-0.5">How to Implement</p>
                        <p className="text-brand-dark/85 leading-relaxed">
                          {item.how_to_implement}
                        </p>
                      </div>

                      <div className="rounded-[9px] bg-brand-light/70 border border-brand-border/75 p-3">
                        <p className="font-semibold text-brand-dark mb-0.5 flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                          <span>Requirements &amp; Conditions</span>
                        </p>
                        <p className="text-brand-dark/85 leading-relaxed">
                          {item.requirements_and_conditions}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-brand-dark">
                        <Clock className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
                        <span>
                          <strong>Recommended Timing:</strong> {item.recommended_timing}
                        </span>
                      </div>

                      {item.category === 'carbon_credit' && (
                        <p className="text-[11px] text-brand-muted italic">
                          Carbon credits are conditional, longer-term opportunities and do not provide guaranteed immediate income.
                        </p>
                      )}

                      {safeSources.length > 0 ? (
                        <div className="pt-1 space-y-1">
                          <p className="text-[11px] font-semibold text-brand-muted">
                            Research Leads (verify locally):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {safeSources.map((src, si) => (
                              <a
                                key={si}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border border-brand-border bg-brand-cream text-[11px] font-medium text-brand-dark hover:border-brand-green hover:text-brand-green transition-colors"
                              >
                                <span className="truncate max-w-[200px]">{src.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-800 bg-amber-50/75 border border-amber-200 rounded-[6px] px-2.5 py-1.5">
                          Requires local confirmation — no external verification source was returned.
                        </p>
                      )}
                    </div>
                  </div>

                  {item.category === 'financial_assistance' && (
                    <button
                      type="button"
                      onClick={onNavigateToSchemes}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-[8px] bg-brand-dark text-white text-xs font-semibold hover:bg-brand-green transition-colors cursor-pointer"
                    >
                      <span>{dt.lossOptimisation.askSchemesCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
