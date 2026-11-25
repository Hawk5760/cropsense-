import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ImagePlus,
  Info,
  Loader2,
  Minus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { postHealthMonitoring } from '../services/cropsenseApi';
import {
  dataUrlToFile,
  preparePlantImageFile,
  validatePlantImageFile,
} from '../services/diseaseService';
import type {
  BackendRisk,
  HealthTrend,
  MonitoringHistoryEntry,
  MonitoringPhotoItem,
  MonitoringReport,
} from '../types/cropsense';
import { isValidIsoCalendarDate } from '../utils/backendContract';
import { getFarmLocationLabel } from '../utils/farmValidation';
import { EASE_EDITORIAL } from './MotionPrimitives';

const TREND_STYLES: Record<
  HealthTrend,
  { label: string; badge: string; border: string; bgSoft: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  improving: {
    label: 'Improving',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    border: 'border-emerald-300/90',
    bgSoft: 'bg-emerald-50/75',
    Icon: TrendingUp,
  },
  stable: {
    label: 'Stable',
    badge: 'bg-[#E7EBDD] text-brand-dark border-[#C6D4B5]',
    border: 'border-[#C6D4B5]',
    bgSoft: 'bg-[#EEF3E6]/65',
    Icon: Minus,
  },
  deteriorating: {
    label: 'Deteriorating',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
    border: 'border-rose-300/90',
    bgSoft: 'bg-rose-50/75',
    Icon: TrendingDown,
  },
  uncertain: {
    label: 'Uncertain',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    border: 'border-amber-300/90',
    bgSoft: 'bg-amber-50/75',
    Icon: AlertTriangle,
  },
};

const RISK_STYLES: Record<
  BackendRisk,
  { label: string; badge: string; dot: string }
> = {
  low: {
    label: 'Low Disease Risk',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    dot: 'bg-emerald-600',
  },
  moderate: {
    label: 'Moderate Disease Risk',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    dot: 'bg-amber-500',
  },
  high: {
    label: 'High Disease Risk',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
    dot: 'bg-rose-600',
  },
  unknown: {
    label: 'Risk Unknown',
    badge: 'bg-brand-light text-brand-dark border-brand-border',
    dot: 'bg-brand-muted',
  },
};

export const CropHealthDashboard: React.FC = () => {
  const {
    farmDetails,
    monitoringPhotos,
    addMonitoringPhoto,
    updateMonitoringPhotoDate,
    removeMonitoringPhoto,
    monitoringHistory,
    addMonitoringHistoryEntry,
    deleteMonitoringHistoryEntry,
  } = useFarmDetails();
  const { language, dt, t } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [photoDate, setPhotoDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [comparisonMessage, setComparisonMessage] = useState(
    'Compare the visible changes in crop health.'
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<MonitoringReport | null>(
    () => monitoringHistory[0]?.report ?? null
  );

  // Keep selectedIds synced with available photos (auto-select up to 4 most recent photos)
  const effectiveSelectedIds = useMemo(() => {
    const validIds = selectedIds.filter((id) => monitoringPhotos.some((p) => p.id === id));
    if (validIds.length > 0) return validIds.slice(0, 4);
    return monitoringPhotos.slice(-4).map((p) => p.id);
  }, [selectedIds, monitoringPhotos]);

  const selectedPhotos = useMemo(
    () =>
      monitoringPhotos
        .filter((p) => effectiveSelectedIds.includes(p.id))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [monitoringPhotos, effectiveSelectedIds]
  );

  const distinctSelectedDates = useMemo(
    () => new Set(selectedPhotos.map((p) => p.date.trim()).filter(isValidIsoCalendarDate)).size,
    [selectedPhotos]
  );

  const canCompare =
    selectedPhotos.length >= 2 &&
    selectedPhotos.length <= 4 &&
    distinctSelectedDates >= 2 &&
    selectedPhotos.every((p) => isValidIsoCalendarDate(p.date));

  const toggleSelectPhoto = (id: string) => {
    setFormError(null);
    setSelectedIds((prev) => {
      const base =
        prev.length > 0
          ? prev.filter((item) => monitoringPhotos.some((p) => p.id === item))
          : effectiveSelectedIds;
      if (base.includes(id)) {
        return base.filter((item) => item !== id);
      }
      if (base.length >= 4) {
        setFormError('You can compare at most 4 dated photos at a time.');
        return base;
      }
      return [...base, id];
    });
  };

  const handleAddPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    if (!isValidIsoCalendarDate(photoDate)) {
      setFormError('Choose a complete valid calendar date (YYYY-MM-DD) before adding photos.');
      return;
    }

    const baseDate = new Date(`${photoDate}T00:00:00Z`);
    const addedIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validatePlantImageFile(file);
      if (validationError) {
        setFormError(t.chatbot.errors[validationError]);
        continue;
      }
      try {
        const prepared = await preparePlantImageFile(file);
        // When user adds multiple photos in one picker action, keep first on chosen date
        // and space additional dates back by 7 days as an easy editable starting point.
        const itemDate = new Date(baseDate);
        if (i > 0) {
          itemDate.setUTCDate(baseDate.getUTCDate() - i * 7);
        }
        const iso = itemDate.toISOString().slice(0, 10);
        const newPhoto: MonitoringPhotoItem = {
          id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          date: iso,
          fileName: prepared.fileName,
          mimeType: prepared.mimeType,
          dataUrl: prepared.dataUrl,
          file: prepared.file,
        };
        addMonitoringPhoto(newPhoto);
        addedIds.push(newPhoto.id);
      } catch {
        setFormError(t.chatbot.errors.invalidImageType);
      }
    }

    if (addedIds.length > 0) {
      setSelectedIds((prev) => {
        const merged = [...prev.filter((id) => monitoringPhotos.some((p) => p.id === id)), ...addedIds];
        return merged.slice(-4);
      });
    }
  };

  const handleCancelCompare = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsComparing(false);
  };

  const handleComparePhotos = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (selectedPhotos.length < 2 || selectedPhotos.length > 4) {
      setFormError('Select between 2 and 4 dated photos of the same crop area to compare.');
      return;
    }

    if (distinctSelectedDates < 2) {
      setFormError('Selected photos must include at least 2 different calendar dates.');
      return;
    }

    setIsComparing(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const payloadPhotos = selectedPhotos.map((p) => ({
        file: p.file ?? dataUrlToFile(p.dataUrl, p.fileName, p.mimeType),
        date: p.date.trim(),
      }));

      const report = await postHealthMonitoring({
        photos: payloadPhotos,
        farmDetails,
        message: comparisonMessage.trim() || undefined,
        language,
        signal: controller.signal,
      });

      setActiveReport(report);

      const historyEntry: MonitoringHistoryEntry = {
        id: `mon_${Date.now()}`,
        createdAt: new Date().toISOString(),
        crop: farmDetails.crop,
        locationLabel: getFarmLocationLabel(farmDetails),
        photoDates: selectedPhotos.map((p) => p.date),
        photoThumbnails: selectedPhotos.map((p) => ({
          date: p.date,
          dataUrl: p.dataUrl,
          fileName: p.fileName,
        })),
        message: comparisonMessage.trim() || undefined,
        report,
      };
      addMonitoringHistoryEntry(historyEntry);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setFormError('Comparison cancelled. Your dated photos remain selected.');
      } else {
        setFormError(
          err instanceof Error
            ? err.message
            : 'Unable to compare crop health photos right now. Please try again.'
        );
      }
    } finally {
      abortControllerRef.current = null;
      setIsComparing(false);
    }
  };

  const trendStyle = activeReport ? TREND_STYLES[activeReport.health_trend] ?? TREND_STYLES.uncertain : null;
  const riskStyle = activeReport ? RISK_STYLES[activeReport.disease_risk] ?? RISK_STYLES.unknown : null;
  const TrendIcon = trendStyle?.Icon ?? Activity;

  return (
    <div className="space-y-4 sm:space-y-5" data-testid="crop-health-dashboard">
      {/* Header + Latest Qualitative Trend Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
        <div>
          <h2 className="font-manrope text-xl sm:text-2xl font-bold text-brand-dark tracking-tight">
            {dt.cropHealth.title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Compare 2 to 4 dated photos of the same crop area from at least two different dates.
          </p>
        </div>

        {activeReport && trendStyle && riskStyle && (
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span
              data-testid="crop-health-overall-risk"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${trendStyle.badge}`}
            >
              <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Trend: {trendStyle.label}</span>
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${riskStyle.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${riskStyle.dot}`} aria-hidden="true" />
              <span>{riskStyle.label}</span>
            </span>
          </div>
        )}
      </div>

      {/* Dated Photo Upload & Timeline Builder */}
      <form
        onSubmit={handleComparePhotos}
        className="rounded-[12px] border border-brand-border bg-white/92 p-3.5 sm:p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-manrope text-base font-bold text-brand-dark flex items-center gap-2">
              <ImagePlus className="w-4.5 h-4.5 text-brand-green" aria-hidden="true" />
              <span>Dated Crop Photo Timeline</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Add 2–4 photos (JPEG, PNG, or WebP, max 8 MB each) from the same field angle on different dates.
            </p>
          </div>
          <span className="text-xs font-medium text-brand-green bg-[#E7EBDD]/85 border border-[#C6D4B5] rounded-full px-3 py-1">
            {t.options.crops[farmDetails.crop] ?? farmDetails.crop} ·{' '}
            {farmDetails.city || farmDetails.state}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleAddPhotos}
          className="hidden"
          aria-label="Add dated crop photos"
        />

        {/* Add photo controls */}
        <div className="grid grid-cols-1 md:grid-cols-[185px_1fr_auto] gap-3 items-end">
          <div>
            <label
              htmlFor="monitoring-photo-date"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              Photo Date (YYYY-MM-DD)
            </label>
            <div className="relative">
              <Calendar
                className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="monitoring-photo-date"
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 pl-9 pr-3 py-2 text-sm text-brand-dark focus:border-brand-green focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="monitoring-comparison-note"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              Comparison Question / Field Note (Optional)
            </label>
            <input
              id="monitoring-comparison-note"
              type="text"
              maxLength={2000}
              value={comparisonMessage}
              onChange={(e) => setComparisonMessage(e.target.value)}
              placeholder="e.g. Compare leaf spotting and new foliage growth since last week"
              className="w-full rounded-[8px] border border-brand-border bg-brand-cream/80 px-3 py-2 text-sm text-brand-dark placeholder:text-brand-muted/70 focus:border-brand-green focus:bg-white"
            />
          </div>

          <button
            type="button"
            data-testid="monitoring-add-photo-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isComparing}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-[8px] border border-brand-border bg-brand-light text-xs sm:text-sm font-medium text-brand-dark hover:bg-[#E7EBDD] transition-colors cursor-pointer disabled:opacity-50"
          >
            <ImagePlus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Add Photo(s)</span>
          </button>
        </div>

        {/* Uploaded Dated Photo Cards (selectable 2-4) */}
        {monitoringPhotos.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-brand-border bg-brand-light/45 p-5 text-center space-y-1.5">
            <p className="text-sm font-semibold text-brand-dark">No dated photos added yet</p>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Upload at least 2 photos taken on different dates (up to 4) to compare visible growth,
              disease progression, and treatment response.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-brand-muted">
              <span>
                Selected for comparison:{' '}
                <strong className="text-brand-dark tabular-nums">{selectedPhotos.length}/4</strong>{' '}
                photos ·{' '}
                <strong className="text-brand-dark tabular-nums">{distinctSelectedDates}</strong>{' '}
                distinct date{distinctSelectedDates === 1 ? '' : 's'}
              </span>
              {selectedPhotos.length >= 2 && distinctSelectedDates < 2 && (
                <span className="text-amber-800 font-medium">
                  Adjust dates so at least 2 photos have different dates
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {monitoringPhotos.map((photo) => {
                const isSelected = effectiveSelectedIds.includes(photo.id);
                return (
                  <div
                    key={photo.id}
                    data-testid={`monitoring-photo-card-${photo.id}`}
                    className={`rounded-[10px] border p-2.5 space-y-2 transition-colors ${
                      isSelected
                        ? 'border-brand-green bg-[#EEF3E6]/55'
                        : 'border-brand-border bg-brand-cream/70'
                    }`}
                  >
                    <div className="relative rounded-[7px] overflow-hidden border border-brand-border aspect-[4/3] bg-brand-light">
                      <img
                        src={photo.dataUrl}
                        alt={`${photo.fileName} on ${photo.date}`}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-white/95 border border-brand-border px-2 py-0.5 text-[11px] font-semibold text-brand-dark cursor-pointer shadow-xs">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPhoto(photo.id)}
                          className="accent-brand-green w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Compare</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          removeMonitoringPhoto(photo.id);
                          setSelectedIds((prev) => prev.filter((id) => id !== photo.id));
                        }}
                        aria-label={`Remove photo ${photo.fileName}`}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-white/90 text-brand-muted hover:text-brand-danger flex items-center justify-center shadow-xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-brand-dark truncate">
                        {photo.fileName}
                      </p>
                      <input
                        type="date"
                        aria-label={`Date for ${photo.fileName}`}
                        value={photo.date}
                        onChange={(e) => updateMonitoringPhotoDate(photo.id, e.target.value)}
                        className="w-full rounded-[6px] border border-brand-border bg-white px-2 py-1 text-xs text-brand-dark tabular-nums focus:border-brand-green"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit & Cancel row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-brand-muted">
            Backend sorts photos chronologically and computes exact elapsed days automatically.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isComparing && (
              <button
                type="button"
                onClick={handleCancelCompare}
                className="px-3.5 py-2 rounded-[8px] border border-brand-border bg-white text-xs font-semibold text-brand-muted hover:text-brand-danger cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              data-testid="monitoring-compare-button"
              disabled={isComparing || !canCompare}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-[8px] bg-brand-dark text-white text-xs sm:text-sm font-semibold hover:bg-brand-green disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isComparing ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>
                {isComparing
                  ? 'Comparing Photos...'
                  : `Compare Selected (${selectedPhotos.length})`}
              </span>
            </button>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-[8px] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-xs text-brand-danger whitespace-pre-line"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}
      </form>

      {/* Active Comparison Report (Exact MonitoringReport Schema) */}
      {activeReport && trendStyle && riskStyle && (
        <motion.section
          data-testid="monitoring-report-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
          className={`rounded-[12px] border bg-white/95 p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_rgba(45,58,46,0.05)] ${trendStyle.border}`}
        >
          {/* Top Qualitative Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`rounded-[10px] border p-3.5 ${trendStyle.bgSoft} ${trendStyle.border}`}>
              <div className="text-[11px] font-medium text-brand-muted">Qualitative Health Trend</div>
              <div className="mt-1.5 flex items-center gap-2 font-manrope text-lg font-bold text-brand-dark">
                <TrendIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{trendStyle.label}</span>
              </div>
            </div>

            <div className="rounded-[10px] border border-brand-border bg-brand-light/60 p-3.5">
              <div className="text-[11px] font-medium text-brand-muted flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Disease Risk</span>
              </div>
              <div className="mt-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${riskStyle.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${riskStyle.dot}`} aria-hidden="true" />
                  <span>{riskStyle.label}</span>
                </span>
              </div>
            </div>

            <div className="rounded-[10px] border border-brand-border bg-brand-light/60 p-3.5">
              <div className="text-[11px] font-medium text-brand-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Comparison Span</span>
              </div>
              <div className="mt-1 font-manrope text-sm font-bold text-brand-dark tabular-nums">
                {activeReport.first_date} → {activeReport.latest_date}
              </div>
              <div className="mt-0.5 text-[11px] text-brand-muted tabular-nums">
                {activeReport.elapsed_days} elapsed days · {activeReport.images_compared} photos compared
              </div>
            </div>
          </div>

          {/* Qualitative Visual Observations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="rounded-[10px] border border-brand-border/80 bg-brand-cream/70 p-3.5 space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                Growth Changes
              </h4>
              <p className="text-brand-dark/90 leading-relaxed">{activeReport.growth_changes}</p>
            </div>

            <div className="rounded-[10px] border border-brand-border/80 bg-brand-cream/70 p-3.5 space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                Disease Changes
              </h4>
              <p className="text-brand-dark/90 leading-relaxed">{activeReport.disease_changes}</p>
            </div>

            <div className="rounded-[10px] border border-brand-border/80 bg-brand-cream/70 p-3.5 space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                Treatment Progress
              </h4>
              <p className="text-brand-dark/90 leading-relaxed">{activeReport.treatment_progress}</p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          {activeReport.next_steps && activeReport.next_steps.length > 0 && (
            <div className="rounded-[10px] bg-[#EEF3E6]/75 border border-[#C6D4B5] p-3.5 space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-green flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Recommended Next Steps</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-brand-dark">
                {activeReport.next_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-4 h-4 text-brand-green shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Comparison Limitations & Field Confirmation Notice */}
          <div className="flex items-start gap-2 rounded-[9px] border border-amber-300/75 bg-amber-50/75 px-3.5 py-2.5 text-xs text-amber-950 leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="font-semibold">Comparison Limitations:</strong>{' '}
              {activeReport.comparison_limitations ||
                'Lighting, camera angle, and distance can affect visual comparisons. Confirm important findings directly in the field.'}
            </div>
          </div>
        </motion.section>
      )}

      {/* Frontend-Owned Comparison History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-manrope text-base font-bold text-brand-dark">
            Saved Comparison History
          </h3>
          <span className="text-xs text-brand-muted tabular-nums">
            {monitoringHistory.length} saved
          </span>
        </div>

        {monitoringHistory.length === 0 ? (
          <div className="rounded-[12px] border border-brand-border bg-white/85 p-6 text-center space-y-1">
            <p className="font-manrope text-sm font-bold text-brand-dark">
              No saved comparisons yet
            </p>
            <p className="text-xs text-brand-muted">
              Comparisons are stored in your browser so you can review crop progress across weeks.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {monitoringHistory.map((entry) => {
                const tStyle = TREND_STYLES[entry.report.health_trend] ?? TREND_STYLES.uncertain;
                const rStyle = RISK_STYLES[entry.report.disease_risk] ?? RISK_STYLES.unknown;
                return (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-[11px] border border-brand-border bg-white/95 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-manrope text-sm font-bold text-brand-dark tabular-nums">
                          {entry.report.first_date} → {entry.report.latest_date}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tStyle.badge}`}
                        >
                          {tStyle.label}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${rStyle.badge}`}
                        >
                          {rStyle.label}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted">
                        {entry.crop} · {entry.locationLabel} · {entry.report.elapsed_days} days ·{' '}
                        {entry.report.images_compared} photos
                      </p>
                      <p className="text-xs text-brand-dark/85 line-clamp-2">
                        {entry.report.growth_changes}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveReport(entry.report)}
                        className="px-3 py-1.5 rounded-[7px] border border-brand-border bg-brand-light text-xs font-semibold text-brand-dark hover:bg-[#E7EBDD] cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMonitoringHistoryEntry(entry.id)}
                        aria-label={`Delete comparison ${entry.report.first_date} to ${entry.report.latest_date}`}
                        className="p-1.5 rounded-full text-brand-muted hover:text-brand-danger hover:bg-brand-danger/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
