import React from 'react';
import { motion } from 'motion/react';
import { Download, Eye, ListChecks, Trash2 } from 'lucide-react';
import type { CropReport } from '../types/cropsense';
import { RiskIndicator } from './RiskIndicator';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface ReportCardProps {
  report: CropReport;
  onViewReport: (report: CropReport) => void;
  onViewRecommendations: (report: CropReport) => void;
  onDownloadPdf: (report: CropReport) => void;
  onDelete: (reportId: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onViewReport,
  onViewRecommendations,
  onDownloadPdf,
  onDelete,
}) => {
  const { t } = useLanguage();
  const createdDate = new Date(report.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const typeLabel =
    report.type === 'disease_analysis' ? t.reports.typeDisease : t.reports.typeHistorical;
  const translatedCrop = t.options.crops[report.crop] ?? report.crop;
  const translatedStatus = t.options.statuses[report.status] ?? report.status;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
      className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-colors hover:border-brand-green/50 hover:shadow-[0_12px_28px_rgba(45,58,46,0.08)]"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
            <span className="font-medium text-brand-green">{typeLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {t.reports.createdOn}: {createdDate}
            </span>
            <span aria-hidden="true">·</span>
            <span>{translatedStatus}</span>
          </div>

          <h3 className="font-playfair text-xl font-semibold text-brand-dark">
            {report.diseaseDetected}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-dark/85">
            <span>
              <span className="text-brand-muted">{t.reports.cropLabel}: </span>
              {translatedCrop} ({t.options.seasons[report.season] ?? report.season})
            </span>
            <span aria-hidden="true" className="text-brand-border">
              |
            </span>
            <span>
              <span className="text-brand-muted">{t.reports.locationLabel}: </span>
              {report.location}
            </span>
            {report.severity && (
              <>
                <span aria-hidden="true" className="text-brand-border">
                  |
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-brand-muted">{t.reports.severityLabel}:</span>
                  <RiskIndicator severity={report.severity} />
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onViewReport(report)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[5px] border border-brand-border bg-brand-light text-brand-dark hover:bg-brand-light-green/70 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.reports.viewReport}</span>
          </button>

          <button
            type="button"
            onClick={() => onViewRecommendations(report)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[5px] border border-brand-border bg-brand-light text-brand-dark hover:bg-brand-light-green/70 transition-colors whitespace-nowrap cursor-pointer"
          >
            <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.reports.viewRecommendations}</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadPdf(report)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[5px] bg-brand-dark text-white hover:bg-brand-green transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.reports.downloadPdf}</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(report.id)}
            aria-label={`${t.reports.deleteReport} ${report.diseaseDetected}`}
            className="w-8 h-8 rounded-[5px] border border-brand-border bg-brand-cream flex items-center justify-center text-brand-muted hover:text-brand-danger hover:border-brand-danger/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
