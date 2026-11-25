import React from 'react';
import {
  AlertCircle,
  BookmarkCheck,
  BookmarkPlus,
  CheckCircle2,
  ExternalLink,
  HeartPulse,
  Info,
  Landmark,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type { DiseaseAnalysisResult } from '../types/cropsense';
import { RiskIndicator } from './RiskIndicator';
import { useLanguage } from '../hooks/useLanguage';
import { toSafeHttpUrl } from '../utils/backendContract';

interface DiseaseResultProps {
  result: DiseaseAnalysisResult;
  isSaved: boolean;
  onSaveReport: () => void;
}

const RECOVERY_LABELS: Record<string, string> = {
  likely: 'Likely to recover',
  conditional: 'Conditional recovery',
  unlikely: 'Unlikely to recover',
  unknown: 'Recovery uncertain',
};

const ELIGIBILITY_BADGES: Record<string, { label: string; style: string }> = {
  potentially_eligible: {
    label: 'Potentially Eligible',
    style: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  },
  not_eligible: {
    label: 'Not Eligible',
    style: 'bg-rose-50 text-rose-900 border-rose-200',
  },
  insufficient_information: {
    label: 'Needs Verification',
    style: 'bg-amber-50 text-amber-900 border-amber-200',
  },
};

const CATEGORY_BADGES: Record<string, string> = {
  cultural: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  biological: 'bg-teal-50 text-teal-900 border-teal-200',
  chemical: 'bg-amber-50 text-amber-900 border-amber-200',
  other: 'bg-brand-light text-brand-dark border-brand-border',
};

export const DiseaseResult: React.FC<DiseaseResultProps> = ({
  result,
  isSaved,
  onSaveReport,
}) => {
  const { t } = useLanguage();
  const dc = t.chatbot.diseaseCard;

  const guidanceUrl = toSafeHttpUrl(result.financialAssistanceGuidance?.official_reference);

  return (
    <div
      data-testid="diagnosis-result-card"
      className="mt-3 rounded-[10px] border border-brand-border bg-brand-cream p-4 sm:p-5 space-y-4"
    >
      {result.status === 'partial' && (
        <div
          role="note"
          className="flex items-start gap-2 rounded-[6px] border border-amber-300/80 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-950"
        >
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Partial diagnosis returned — some supporting details or scheme checks were unavailable.
            Please confirm locally with an agronomist.
          </span>
        </div>
      )}

      {result.isDemo && (
        <div
          role="note"
          className="flex items-start gap-2 rounded-[5px] border border-brand-warning/40 bg-brand-warning/10 px-3.5 py-2.5 text-xs text-brand-dark"
        >
          <AlertCircle className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" aria-hidden="true" />
          <span>{dc.demoNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-brand-border/80">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-brand-muted">
            {dc.diseaseIdentified}
          </p>
          <h3 className="mt-1 font-playfair text-lg sm:text-xl font-semibold text-brand-dark">
            {result.diseaseName}
          </h3>
          {result.severityExplanation && (
            <p className="mt-1 text-xs text-brand-dark/80 leading-relaxed">
              {result.severityExplanation}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onSaveReport}
          disabled={isSaved}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-[5px] border transition-colors whitespace-nowrap cursor-pointer ${
            isSaved
              ? 'border-brand-success/35 bg-brand-light-green/70 text-brand-dark cursor-default'
              : 'border-brand-dark bg-brand-dark text-white hover:bg-brand-green'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-brand-success" aria-hidden="true" />
              <span>{dc.reportSavedButton}</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{dc.saveReportButton}</span>
            </>
          )}
        </button>
      </div>

      {/* Key metrics row (exact Diagnosis fields — no invented confidence) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-sm">
        <div className="rounded-[7px] bg-brand-light/80 border border-brand-border/70 px-3.5 py-2.5">
          <div className="text-xs text-brand-muted">{dc.severity}</div>
          <div className="mt-1">
            <RiskIndicator severity={result.severity} />
          </div>
        </div>

        <div className="rounded-[7px] bg-brand-light/80 border border-brand-border/70 px-3.5 py-2.5">
          <div className="text-xs text-brand-muted flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-muted" aria-hidden="true" />
            <span>Crop Loss Risk</span>
          </div>
          <div className="mt-1 text-sm font-semibold text-brand-dark capitalize">
            {result.riskLevel || 'Unknown'}
          </div>
        </div>

        <div className="rounded-[7px] bg-brand-light/80 border border-brand-border/70 px-3.5 py-2.5">
          <div className="text-xs text-brand-muted flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
            <span>Recovery Outlook</span>
          </div>
          <div className="mt-1 text-sm font-semibold text-brand-dark">
            {result.canRecover
              ? RECOVERY_LABELS[result.canRecover] ?? result.canRecover
              : 'Not confirmed'}
          </div>
          {result.recoveryPeriod && (
            <div className="mt-0.5 text-[11px] text-brand-muted">
              Period: {result.recoveryPeriod}
            </div>
          )}
        </div>
      </div>

      {/* Symptoms, Treatment, Precautions, Recovery Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {result.symptoms.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-1.5">
              {dc.visibleSymptoms}
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-brand-dark/90 list-disc pl-4">
              {result.symptoms.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {result.suggestedTreatment.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-1.5">
              {dc.suggestedTreatment}
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-brand-dark/90 list-disc pl-4">
              {result.suggestedTreatment.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {result.preventiveMeasures.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-1.5">
              {dc.preventiveMeasures}
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-brand-dark/90 list-disc pl-4">
              {result.preventiveMeasures.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {result.recoveryConditions && result.recoveryConditions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green mb-1.5">
              Recovery Conditions
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-brand-dark/90 list-disc pl-4">
              {result.recoveryConditions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Categorized Treatment Options */}
      {result.treatmentOptions && result.treatmentOptions.length > 0 && (
        <div className="pt-2 border-t border-brand-border/70 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Treatment Options</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.treatmentOptions.map((opt, idx) => (
              <div
                key={idx}
                className="rounded-[8px] border border-brand-border/80 bg-white/90 p-3 space-y-1"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-brand-dark">{opt.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                      CATEGORY_BADGES[opt.category] ?? CATEGORY_BADGES.other
                    }`}
                  >
                    {opt.category}
                  </span>
                </div>
                <p className="text-xs text-brand-dark/80 leading-relaxed">{opt.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Government Schemes returned by Diagnosis */}
      {result.governmentSchemes && result.governmentSchemes.length > 0 && (
        <div className="pt-2 border-t border-brand-border/70 space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Potential Government Schemes</span>
          </h4>
          <div className="space-y-2.5">
            {result.governmentSchemes.map((scheme, idx) => {
              const badge =
                ELIGIBILITY_BADGES[scheme.eligibility?.status] ??
                ELIGIBILITY_BADGES.insufficient_information;
              const safeAppUrl = toSafeHttpUrl(scheme.application_link);
              const safeRefUrl = toSafeHttpUrl(scheme.official_reference);

              return (
                <div
                  key={idx}
                  className="rounded-[8px] border border-brand-border bg-white/95 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h5 className="font-manrope text-sm font-bold text-brand-dark">
                      {scheme.scheme_name}
                    </h5>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {scheme.description && (
                    <p className="text-brand-dark/85 leading-relaxed">{scheme.description}</p>
                  )}

                  {scheme.benefits && (
                    <p className="text-brand-dark/90">
                      <strong className="text-brand-dark">Benefits:</strong> {scheme.benefits}
                    </p>
                  )}

                  {scheme.eligibility?.conditions?.length > 0 && (
                    <div>
                      <p className="font-semibold text-brand-dark mb-0.5">Eligibility Conditions:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-brand-muted">
                        {scheme.eligibility.conditions.map((c, ci) => (
                          <li key={ci}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scheme.documents_required?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {scheme.documents_required.map((doc, di) => (
                        <span
                          key={di}
                          className="rounded bg-brand-light border border-brand-border/80 px-2 py-0.5 text-[11px] text-brand-dark"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}

                  {scheme.application_process?.length > 0 && (
                    <div>
                      <p className="font-semibold text-brand-dark mb-0.5">Application Steps:</p>
                      <ol className="list-decimal pl-4 space-y-0.5 text-brand-dark/85">
                        {scheme.application_process.map((step, si) => (
                          <li key={si}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {(safeAppUrl || safeRefUrl) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {safeAppUrl && (
                        <a
                          href={safeAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-brand-dark text-white text-[11px] font-semibold hover:bg-brand-green transition-colors"
                        >
                          <span>Apply Link</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                      {safeRefUrl && (
                        <a
                          href={safeRefUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border border-brand-border bg-brand-light text-brand-dark text-[11px] font-semibold hover:bg-[#E7EBDD] transition-colors"
                        >
                          <span>Official Reference</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Financial Assistance Guidance fallback (non-null when scheme_status === 'not_verified') */}
      {result.financialAssistanceGuidance && (
        <div className="rounded-[8px] border border-[#C6D4B5] bg-[#EEF3E6]/75 p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-brand-dark">
            <Landmark className="w-4 h-4 text-brand-green shrink-0" aria-hidden="true" />
            <span>Financial Assistance Guidance</span>
          </div>
          <p className="text-brand-dark/90 leading-relaxed">
            {result.financialAssistanceGuidance.message}
          </p>
          {result.financialAssistanceGuidance.next_steps?.length > 0 && (
            <ul className="space-y-1 text-brand-dark/85">
              {result.financialAssistanceGuidance.next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          )}
          {guidanceUrl && (
            <a
              href={guidanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-green font-semibold hover:underline pt-0.5"
            >
              <span>Official Reference Portal</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-[6px] bg-brand-light px-3.5 py-2.5 text-xs text-brand-muted leading-relaxed">
        <Info className="w-3.5 h-3.5 text-brand-muted shrink-0 mt-0.5" aria-hidden="true" />
        <span>{result.disclaimer || dc.defaultDisclaimer}</span>
      </div>
    </div>
  );
};
