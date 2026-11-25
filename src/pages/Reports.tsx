import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Download, FileText, Search, X } from 'lucide-react';
import { EASE_EDITORIAL } from '../components/MotionPrimitives';
import { ReportCard } from '../components/ReportCard';
import { RiskIndicator } from '../components/RiskIndicator';
import { DASHBOARD_BG_IMAGE } from '../data/cropData';
import type { CropReport, ReportType } from '../types/cropsense';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { exportReportToPdf } from '../utils/pdfExport';
import { filterReports } from '../utils/reportUtils';

type ModalMode = 'full' | 'recommendations';

export const Reports: React.FC = () => {
  const { reports, deleteReport } = useFarmDetails();
  const { t } = useLanguage();

  const [typeFilter, setTypeFilter] = useState<'all' | ReportType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState<CropReport | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('full');
  const [pdfToast, setPdfToast] = useState(false);

  const filteredReports = useMemo(
    () => filterReports(reports, typeFilter, searchQuery),
    [reports, typeFilter, searchQuery]
  );

  const handleDownloadPdf = (report: CropReport) => {
    exportReportToPdf(report);
    setPdfToast(true);
    window.setTimeout(() => setPdfToast(false), 3000);
  };

  return (
    <main className="relative min-h-screen bg-brand-cream pt-[74px] md:pt-24 pb-24 lg:pb-16">
      <div className="fixed inset-0 z-0 pointer-events-none bg-brand-cream" aria-hidden="true">
        <img
          src={DASHBOARD_BG_IMAGE}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom opacity-35"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2 space-y-5 sm:space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE_EDITORIAL }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-brand-dark tracking-tight">
              {t.reports.title}
            </h1>
            <p className="mt-1 text-base text-brand-muted">{t.reports.subtitle}</p>
          </div>

          <AnimatePresence>
            {pdfToast && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2 rounded-[8px] border border-brand-success/35 bg-brand-light-green/90 px-3.5 py-2 text-xs text-brand-dark"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" aria-hidden="true" />
                <span>{t.reports.pdfSuccessToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: EASE_EDITORIAL }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[12px] border border-brand-border bg-brand-cream/95 p-3.5 shadow-[0_2px_12px_rgba(45,58,46,0.04)]"
        >
          <div
            className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 no-scrollbar"
            role="group"
            aria-label="Filter reports"
          >
            {(
              [
                { value: 'all', label: t.reports.filterAll },
                { value: 'disease_analysis', label: t.reports.filterDisease },
                { value: 'historical_analysis', label: t.reports.filterHistorical },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setTypeFilter(tab.value)}
                aria-pressed={typeFilter === tab.value}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-[6px] transition-colors cursor-pointer ${
                  typeFilter === tab.value
                    ? 'bg-brand-dark text-white'
                    : 'bg-brand-light text-brand-dark hover:bg-brand-light-green/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.reports.searchPlaceholder}
              aria-label={t.reports.searchPlaceholder}
              className="w-full rounded-[8px] border border-brand-border bg-brand-light/70 pl-9 pr-3 py-1.5 text-sm text-brand-dark placeholder:text-brand-muted/75 focus:border-brand-green focus:bg-white transition-colors"
            />
          </div>
        </motion.div>

        {/* Reports List or Empty State */}
        {filteredReports.length === 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: EASE_EDITORIAL }}
            className="rounded-[14px] border border-brand-border bg-brand-cream/95 px-6 py-16 text-center space-y-4 shadow-[0_4px_20px_rgba(45,58,46,0.04)]"
          >
            <div className="w-12 h-12 mx-auto rounded-[10px] border border-brand-border bg-brand-light flex items-center justify-center text-brand-green">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-playfair text-2xl font-semibold text-brand-dark">
              {t.reports.emptyTitle}
            </h2>
            <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              {t.reports.emptyDescription}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/chatbot"
                className="px-5 py-2.5 bg-brand-dark text-white text-sm rounded-[8px] hover:bg-brand-green transition-colors"
              >
                {t.reports.startAnalysisCta}
              </Link>
              <Link
                to="/historical-analysis"
                className="px-5 py-2.5 border border-brand-border bg-brand-light text-brand-dark text-sm rounded-[8px] hover:bg-brand-light-green/70 transition-colors"
              >
                {t.reports.goToHistoricalCta}
              </Link>
            </div>
          </motion.section>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.2), ease: EASE_EDITORIAL }}
                >
                  <ReportCard
                    report={report}
                    onViewReport={(item) => {
                      setModalMode('full');
                      setActiveReport(item);
                    }}
                    onViewRecommendations={(item) => {
                      setModalMode('recommendations');
                      setActiveReport(item);
                    }}
                    onDownloadPdf={handleDownloadPdf}
                    onDelete={deleteReport}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Animated Report Detail / Recommendations Modal */}
      <AnimatePresence>
        {activeReport && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.26, ease: EASE_EDITORIAL }}
              className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-[14px] border border-brand-border bg-brand-cream p-6 space-y-5 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-brand-border">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-brand-muted">
                    {activeReport.type === 'disease_analysis'
                      ? t.reports.typeDisease
                      : t.reports.typeHistorical}
                  </p>
                  <h2
                    id="report-modal-title"
                    className="mt-1 font-playfair text-2xl font-semibold text-brand-dark"
                  >
                    {activeReport.diseaseDetected}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  aria-label={t.reports.modalClose}
                  className="w-8 h-8 rounded-[6px] border border-brand-border bg-brand-light flex items-center justify-center text-brand-dark hover:bg-brand-light-green cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-dark/85">
                <span>
                  <strong className="text-brand-muted font-normal">{t.reports.cropLabel}: </strong>
                  {t.options.crops[activeReport.crop] ?? activeReport.crop}
                </span>
                <span>·</span>
                <span>
                  <strong className="text-brand-muted font-normal">{t.reports.locationLabel}: </strong>
                  {activeReport.location}
                </span>
                <span>·</span>
                <span className="tabular-nums">{activeReport.farmSizeLabel}</span>
                {activeReport.severity && (
                  <>
                    <span>·</span>
                    <RiskIndicator severity={activeReport.severity} />
                  </>
                )}
              </div>

              {modalMode === 'full' && activeReport.summary && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green mb-1.5">
                    {t.reports.modalSummaryTitle}
                  </h3>
                  <p className="text-sm text-brand-dark leading-relaxed">{activeReport.summary}</p>
                </div>
              )}

              {activeReport.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green mb-1.5">
                    {t.reports.modalRecommendationsTitle}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-brand-dark list-disc pl-5">
                    {activeReport.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {modalMode === 'full' && activeReport.symptoms && activeReport.symptoms.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green mb-1.5">
                    {t.reports.modalSymptomsTitle}
                  </h3>
                  <ul className="space-y-1 text-sm text-brand-dark list-disc pl-5">
                    {activeReport.symptoms.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {modalMode === 'full' &&
                activeReport.preventiveMeasures &&
                activeReport.preventiveMeasures.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green mb-1.5">
                      {t.reports.modalPreventiveTitle}
                    </h3>
                    <ul className="space-y-1 text-sm text-brand-dark list-disc pl-5">
                      {activeReport.preventiveMeasures.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {activeReport.whenToSeekExpert && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-brand-green mb-1">
                    {t.reports.modalExpertTitle}
                  </h3>
                  <p className="text-sm text-brand-dark leading-relaxed">
                    {activeReport.whenToSeekExpert}
                  </p>
                </div>
              )}

              {activeReport.disclaimer && (
                <p className="rounded-[8px] bg-brand-light px-3.5 py-2.5 text-xs text-brand-muted leading-relaxed">
                  {activeReport.disclaimer}
                </p>
              )}

              <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(activeReport)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-dark text-white text-xs font-medium rounded-[7px] hover:bg-brand-green transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.reports.downloadPdf}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-2 border border-brand-border bg-brand-light text-brand-dark text-xs font-medium rounded-[7px] hover:bg-brand-light-green/70 transition-colors cursor-pointer"
                >
                  {t.reports.modalClose}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
