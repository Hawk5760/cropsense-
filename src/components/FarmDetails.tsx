import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleStop,
  Coins,
  Leaf,
  Loader2,
  LocateFixed,
  MapPin,
  Mic,
  Save,
  Scale,
  Sparkles,
  Trees,
} from 'lucide-react';
import { FarmDetailsLogo } from './SectionLogos';
import {
  AREA_UNITS,
  CROP_OPTIONS,
  INDIAN_STATES,
  INDIAN_STATES_CITIES,
  SEASON_OPTIONS,
  YIELD_UNITS,
} from '../data/cropData';
import type {
  AreaUnit,
  CropType,
  FarmDetails as FarmDetailsModel,
  SeasonType,
  YieldUnit,
} from '../types/cropsense';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { extractFarmDetailsFromVoice } from '../services/aiService';
import {
  formatIndianCurrency,
  validateFarmDetails,
  type FarmValidationErrors,
} from '../utils/farmValidation';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export const FarmDetails: React.FC = () => {
  const { farmDetails, saveFarmDetails } = useFarmDetails();
  const { language, speechLocale, t, dt } = useLanguage();

  const [formState, setFormState] = useState<FarmDetailsModel>(farmDetails);
  const [errors, setErrors] = useState<FarmValidationErrors>({});
  const [savedBanner, setSavedBanner] = useState(false);

  // Voice auto-fill state
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    key: 'reviewBanner' | 'failedError' | 'unsupportedError';
  } | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setFormState(farmDetails);
  }, [farmDetails]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const suggestedCities = useMemo(() => {
    return INDIAN_STATES_CITIES[formState.state] ?? [];
  }, [formState.state]);

  const handleFieldChange = <K extends keyof FarmDetailsModel>(
    field: K,
    value: FarmDetailsModel[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setSavedBanner(false);
    setErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      const next = { ...prev };
      if (field === 'state' || field === 'city' || field === 'district') delete next.location;
      if (field === 'latitude') {
        delete next.latitude;
        delete next.location;
      }
      if (field === 'longitude') {
        delete next.longitude;
        delete next.location;
      }
      if (field === 'farmSize') delete next.farmSize;
      if (field === 'crop') delete next.crop;
      if (field === 'season') delete next.season;
      if (field === 'lastYearYield') delete next.lastYearYield;
      if (field === 'lastYearProduction') delete next.lastYearProduction;
      return next;
    });
  };

  const applyExtractedTranscript = async (rawTranscript: string) => {
    const trimmed = rawTranscript.trim();
    if (!trimmed) return;
    setIsExtracting(true);
    setVoiceFeedback(null);
    setSavedBanner(false);

    try {
      const extracted = await extractFarmDetailsFromVoice(trimmed, language);
      const matchedKeys = Object.keys(extracted).filter((k) => {
        const val = (extracted as Record<string, unknown>)[k];
        return typeof val === 'string' && val.trim().length > 0;
      });

      if (matchedKeys.length === 0) {
        setVoiceFeedback({ type: 'error', key: 'failedError' });
        return;
      }

      setFormState((prev) => {
        const next: FarmDetailsModel = { ...prev };
        if (extracted.state && INDIAN_STATES.includes(extracted.state)) {
          next.state = extracted.state;
        }
        if (extracted.city) {
          next.city = extracted.city;
        }
        if (extracted.latitude && Number.isFinite(Number(extracted.latitude))) {
          next.latitude = extracted.latitude;
        }
        if (extracted.longitude && Number.isFinite(Number(extracted.longitude))) {
          next.longitude = extracted.longitude;
        }
        if (extracted.farmSize && Number(extracted.farmSize) > 0) {
          next.farmSize = extracted.farmSize;
        }
        if (extracted.farmSizeUnit && AREA_UNITS.includes(extracted.farmSizeUnit as AreaUnit)) {
          next.farmSizeUnit = extracted.farmSizeUnit as AreaUnit;
        }
        if (extracted.crop && CROP_OPTIONS.includes(extracted.crop as CropType)) {
          next.crop = extracted.crop as CropType;
        }
        if (extracted.season && SEASON_OPTIONS.includes(extracted.season as SeasonType)) {
          next.season = extracted.season as SeasonType;
        }
        if (extracted.lastYearYield) {
          const digits = extracted.lastYearYield.replace(/[^\d]/g, '');
          if (digits) next.lastYearYield = digits;
        }
        return next;
      });

      setErrors({});
      setSavedBanner(false);
      setVoiceFeedback({ type: 'success', key: 'reviewBanner' });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleToggleVoiceAutoFill = () => {
    setVoiceOpen(true);
    setVoiceFeedback(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setVoiceFeedback({ type: 'info', key: 'unsupportedError' });
      return;
    }

    try {
      const recognition = new Ctor();
      recognition.lang = speechLocale;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setVoiceTranscript(transcript);
          void applyExtractedTranscript(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceFeedback({ type: 'info', key: 'unsupportedError' });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceFeedback({ type: 'info', key: 'unsupportedError' });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedCity = formState.city.trim();
    const cleaned: FarmDetailsModel = {
      ...formState,
      state: formState.state.trim(),
      city: cleanedCity,
      district: formState.district.trim() || cleanedCity,
      latitude: formState.latitude.trim(),
      longitude: formState.longitude.trim(),
      farmSize: formState.farmSize.trim(),
      lastYearYield: formState.lastYearYield.replace(/,/g, '').trim(),
      lastYearProduction: formState.lastYearProduction.replace(/,/g, '').trim(),
    };

    const validation = validateFarmDetails(cleaned);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSavedBanner(false);
      return;
    }

    setErrors({});
    saveFarmDetails(cleaned);
    setSavedBanner(true);
    setVoiceFeedback(null);
  };

  const inputBaseClass =
    'w-full rounded-[8px] border border-brand-border bg-brand-cream/85 text-sm text-brand-dark placeholder:text-brand-muted/75 focus:border-brand-green focus:bg-white transition-all duration-200';

  const selectBaseClass = `${inputBaseClass} appearance-none pl-9 pr-8 py-2 cursor-pointer`;

  return (
    <motion.section
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
      aria-labelledby="farm-details-heading"
      data-testid="farm-details-panel"
      className="flex flex-col bg-brand-cream/95 border border-brand-border rounded-[14px] p-4 shadow-[0_4px_20px_rgba(45,58,46,0.05)]"
    >
      {/* Header with custom Farm Details logo */}
      <div className="flex items-start gap-2.5 mb-3">
        <FarmDetailsLogo className="w-10 h-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <h2
            id="farm-details-heading"
            className="font-manrope text-[19px] font-bold text-brand-dark tracking-tight leading-tight"
          >
            {t.dashboard.farmDetailsTitle}
          </h2>
          <p className="mt-0.5 text-xs text-brand-muted leading-snug">
            {t.dashboard.farmDetailsSubtitle}
          </p>
        </div>
      </div>

      {/* Multilingual Voice-Based Auto-Fill Bar */}
      <div
        data-testid="voice-autofill-bar"
        className="mb-3 rounded-[10px] border border-[#C6D4B5] bg-[#E7EBDD]/65 p-2.5 space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-green shrink-0" aria-hidden="true" />
              <span>{dt.voiceAutoFill.title}</span>
            </p>
            <p className="text-[11px] text-brand-dark/75 leading-snug mt-0.5">
              {dt.voiceAutoFill.subtitle}
            </p>
          </div>
          <button
            type="button"
            data-testid="voice-autofill-trigger"
            onClick={handleToggleVoiceAutoFill}
            disabled={isExtracting}
            aria-label={isListening ? dt.voiceAutoFill.stopButton : dt.voiceAutoFill.startButton}
            className={`w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              isListening
                ? 'bg-brand-danger text-white animate-pulse'
                : 'bg-brand-dark text-white hover:bg-brand-green'
            }`}
          >
            {isExtracting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : isListening ? (
              <CircleStop className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Mic className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {isExtracting
                ? dt.voiceAutoFill.extractingStatus
                : isListening
                  ? dt.voiceAutoFill.stopButton
                  : dt.voiceAutoFill.startButton}
            </span>
          </button>
        </div>

        {/* Expandable transcript / fallback manual spoken-phrase input */}
        <AnimatePresence initial={false}>
          {(voiceOpen || voiceTranscript || voiceFeedback) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-1.5 pt-1"
            >
              <div className="flex gap-1.5">
                <input
                  type="text"
                  data-testid="voice-autofill-input"
                  aria-label={dt.voiceAutoFill.transcriptLabel}
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void applyExtractedTranscript(voiceTranscript);
                    }
                  }}
                  placeholder={dt.voiceAutoFill.examplePrompt}
                  className="flex-1 min-w-0 rounded-[7px] border border-brand-border bg-white/95 px-2.5 py-1.5 text-xs text-brand-dark placeholder:text-brand-muted/75 focus:border-brand-green"
                />
                <button
                  type="button"
                  data-testid="voice-autofill-apply"
                  disabled={isExtracting || !voiceTranscript.trim()}
                  onClick={() => void applyExtractedTranscript(voiceTranscript)}
                  className="px-2.5 py-1.5 rounded-[7px] bg-brand-green text-white text-xs font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                  {dt.voiceAutoFill.title}
                </button>
              </div>
              <p className="text-[11px] text-brand-dark/70 leading-snug">
                {isListening ? dt.voiceAutoFill.listeningStatus : dt.voiceAutoFill.examplePrompt}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {voiceFeedback && (
          <div
            role={voiceFeedback.type === 'error' ? 'alert' : 'status'}
            data-testid="voice-autofill-feedback"
            className={`flex items-start gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11px] leading-snug ${
              voiceFeedback.type === 'success'
                ? 'bg-white/90 text-brand-dark border border-brand-green/35'
                : voiceFeedback.type === 'error'
                  ? 'bg-brand-danger/10 text-brand-danger border border-brand-danger/25'
                  : 'bg-white/80 text-brand-muted border border-brand-border/70'
            }`}
          >
            {voiceFeedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span>{dt.voiceAutoFill[voiceFeedback.key]}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2.5">
        {/* State */}
        <div>
          <label
            htmlFor="farm-state"
            className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
          >
            <span>
              {t.dashboard.stateLabel} <span className="text-brand-danger">*</span>
            </span>
          </label>
          <div className="relative">
            <MapPin
              className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <select
              id="farm-state"
              value={formState.state}
              onChange={(e) => {
                const nextState = e.target.value;
                const nextCities = INDIAN_STATES_CITIES[nextState] ?? [];
                handleFieldChange('state', nextState);
                if (nextCities.length > 0 && !nextCities.includes(formState.city)) {
                  handleFieldChange('city', nextCities[0]);
                  handleFieldChange('district', nextCities[0]);
                }
              }}
              className={selectBaseClass}
            >
              <option value="">—</option>
              {INDIAN_STATES.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-4 h-4 text-brand-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* City & District side-by-side */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="farm-city"
              className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
            >
              <span>
                {t.dashboard.cityLabel} <span className="text-brand-danger">*</span>
              </span>
            </label>
            <div className="relative">
              <Building2
                className="w-3.5 h-3.5 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-city"
                type="text"
                list="indian-city-suggestions"
                value={formState.city}
                onChange={(e) => {
                  const val = e.target.value;
                  const syncDistrict = !formState.district || formState.district === formState.city;
                  handleFieldChange('city', val);
                  if (syncDistrict) handleFieldChange('district', val);
                }}
                placeholder={t.dashboard.cityPlaceholder}
                className={`${inputBaseClass} pl-8 pr-2.5 py-2 text-xs sm:text-sm`}
              />
            </div>
            <datalist id="indian-city-suggestions">
              {suggestedCities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="farm-district"
              className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
            >
              <span>
                District <span className="text-brand-danger">*</span>
              </span>
            </label>
            <div className="relative">
              <MapPin
                className="w-3.5 h-3.5 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-district"
                type="text"
                value={formState.district}
                onChange={(e) => handleFieldChange('district', e.target.value)}
                placeholder="e.g. Belagavi"
                className={`${inputBaseClass} pl-8 pr-2.5 py-2 text-xs sm:text-sm`}
              />
            </div>
          </div>
        </div>
        {errors.location && (
          <p role="alert" className="-mt-1 text-xs text-brand-danger flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{t.dashboard.validation.locationOrCoordsRequired}</span>
          </p>
        )}

        {/* Optional Latitude & Longitude */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="farm-latitude"
              className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
            >
              <span>{t.dashboard.latitudeLabel}</span>
              <span className="text-[10px] font-normal text-brand-muted">
                {t.dashboard.optionalTag}
              </span>
            </label>
            <div className="relative">
              <LocateFixed
                className="w-3.5 h-3.5 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-latitude"
                type="number"
                step="any"
                value={formState.latitude}
                onChange={(e) => handleFieldChange('latitude', e.target.value)}
                placeholder={t.dashboard.latitudePlaceholder}
                className={`${inputBaseClass} pl-8 pr-2 py-2 tabular-nums text-xs`}
              />
            </div>
            {errors.latitude && (
              <p role="alert" className="mt-1 text-xs text-brand-danger">
                {t.dashboard.validation.invalidLatitude}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="farm-longitude"
              className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
            >
              <span>{t.dashboard.longitudeLabel}</span>
              <span className="text-[10px] font-normal text-brand-muted">
                {t.dashboard.optionalTag}
              </span>
            </label>
            <div className="relative">
              <LocateFixed
                className="w-3.5 h-3.5 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-longitude"
                type="number"
                step="any"
                value={formState.longitude}
                onChange={(e) => handleFieldChange('longitude', e.target.value)}
                placeholder={t.dashboard.longitudePlaceholder}
                className={`${inputBaseClass} pl-8 pr-2 py-2 tabular-nums text-xs`}
              />
            </div>
            {errors.longitude && (
              <p role="alert" className="mt-1 text-xs text-brand-danger">
                {t.dashboard.validation.invalidLongitude}
              </p>
            )}
          </div>
        </div>

        {/* Farm Size + Unit */}
        <div>
          <label
            htmlFor="farm-size"
            className="block text-xs font-semibold text-brand-dark mb-1"
          >
            {t.dashboard.farmSizeLabel} <span className="text-brand-danger">*</span>
          </label>
          <div className="grid grid-cols-[1fr_120px] gap-2">
            <div className="relative">
              <Trees
                className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-size"
                type="number"
                min="0.01"
                step="any"
                value={formState.farmSize}
                onChange={(e) => handleFieldChange('farmSize', e.target.value)}
                placeholder={t.dashboard.farmSizePlaceholder}
                className={`${inputBaseClass} pl-9 pr-3 py-2.5 tabular-nums`}
              />
            </div>
            <div className="relative">
              <select
                id="farm-size-unit"
                aria-label={`${t.dashboard.farmSizeLabel} unit`}
                value={formState.farmSizeUnit}
                onChange={(e) => handleFieldChange('farmSizeUnit', e.target.value as AreaUnit)}
                className={`${inputBaseClass} appearance-none pl-3 pr-7 py-2.5 cursor-pointer`}
              >
                {AREA_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {t.options.units[unit] ?? unit}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4 text-brand-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
          {errors.farmSize && (
            <p role="alert" className="mt-1 text-xs text-brand-danger">
              {t.dashboard.validation.invalidFarmSize}
            </p>
          )}
        </div>

        {/* Crop & Season side-by-side for compact left panel balance */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label
              htmlFor="farm-crop"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              {t.dashboard.cropLabel} <span className="text-brand-danger">*</span>
            </label>
            <div className="relative">
              <Leaf
                className="w-4 h-4 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="farm-crop"
                value={formState.crop}
                onChange={(e) => handleFieldChange('crop', e.target.value as CropType)}
                className={`${inputBaseClass} appearance-none pl-8 pr-7 py-2.5 cursor-pointer`}
              >
                {CROP_OPTIONS.map((crop) => (
                  <option key={crop} value={crop}>
                    {t.options.crops[crop] ?? crop}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.crop && (
              <p role="alert" className="mt-1 text-xs text-brand-danger">
                {t.dashboard.validation.cropRequired}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="farm-season"
              className="block text-xs font-semibold text-brand-dark mb-1"
            >
              {t.dashboard.seasonLabel} <span className="text-brand-danger">*</span>
            </label>
            <div className="relative">
              <Calendar
                className="w-4 h-4 text-brand-dark/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="farm-season"
                value={formState.season}
                onChange={(e) => handleFieldChange('season', e.target.value as SeasonType)}
                className={`${inputBaseClass} appearance-none pl-8 pr-7 py-2.5 cursor-pointer`}
              >
                {SEASON_OPTIONS.map((season) => (
                  <option key={season} value={season}>
                    {t.options.seasons[season] ?? season}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.season && (
              <p role="alert" className="mt-1 text-xs text-brand-danger">
                {t.dashboard.validation.seasonRequired}
              </p>
            )}
          </div>
        </div>

        {/* Last Year's Physical Production + Unit (used by AI Chatbot) */}
        <div>
          <label
            htmlFor="farm-production"
            className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
          >
            <span>
              Last Year&apos;s Production <span className="text-brand-danger">*</span>
            </span>
            <span className="text-[10px] font-normal text-brand-muted">Physical quantity</span>
          </label>
          <div className="grid grid-cols-[1fr_115px] gap-2">
            <div className="relative">
              <Scale
                className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="farm-production"
                type="number"
                min="0"
                step="any"
                value={formState.lastYearProduction}
                onChange={(e) => handleFieldChange('lastYearProduction', e.target.value)}
                placeholder="e.g. 40"
                className={`${inputBaseClass} pl-9 pr-3 py-2 tabular-nums`}
              />
            </div>
            <div className="relative">
              <select
                id="farm-yield-unit"
                aria-label="Production yield unit"
                value={formState.yieldUnit}
                onChange={(e) => handleFieldChange('yieldUnit', e.target.value as YieldUnit)}
                className={`${inputBaseClass} appearance-none pl-3 pr-7 py-2 cursor-pointer`}
              >
                {YIELD_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="w-4 h-4 text-brand-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
          {errors.lastYearProduction && (
            <p role="alert" className="mt-1 text-xs text-brand-danger">
              Enter a valid non-negative production quantity.
            </p>
          )}
        </div>

        {/* Last Year's Yield Value in INR (used by Loss Optimisation & Monitoring) */}
        <div>
          <label
            htmlFor="farm-yield"
            className="flex items-center justify-between text-xs font-semibold text-brand-dark mb-1"
          >
            <span>{t.dashboard.yieldLabel}</span>
            {formState.lastYearYield && !errors.lastYearYield && (
              <span className="text-[11px] font-normal text-brand-muted tabular-nums">
                ₹ {formatIndianCurrency(formState.lastYearYield)}
              </span>
            )}
          </label>
          <div className="relative">
            <Coins
              className="w-4 h-4 text-brand-dark/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="farm-yield"
              type="text"
              inputMode="numeric"
              value={
                formState.lastYearYield && /^\d+$/.test(formState.lastYearYield)
                  ? formatIndianCurrency(formState.lastYearYield)
                  : formState.lastYearYield
              }
              onChange={(e) =>
                handleFieldChange('lastYearYield', e.target.value.replace(/,/g, ''))
              }
              placeholder={t.dashboard.yieldPlaceholder}
              className={`${inputBaseClass} pl-9 pr-3 py-2 tabular-nums`}
            />
          </div>
          {errors.lastYearYield && (
            <p role="alert" className="mt-1 text-xs text-brand-danger">
              {t.dashboard.validation.invalidYield}
            </p>
          )}
        </div>

        <div className="pt-1 space-y-2">
          <AnimatePresence>
            {savedBanner && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
                className="flex items-start gap-2 rounded-[8px] border border-brand-success/35 bg-[#E7EBDD]/85 px-3 py-2 text-xs text-brand-dark"
              >
                <CheckCircle2
                  className="w-4 h-4 text-brand-success shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{t.dashboard.savedSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.16 }}
            className="w-full py-2.5 px-4 bg-brand-dark text-white text-xs sm:text-sm font-medium tracking-wider uppercase rounded-[8px] hover:bg-brand-green transition-colors inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>{t.dashboard.saveButton}</span>
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
};
