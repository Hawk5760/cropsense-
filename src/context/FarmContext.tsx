import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ChatAssistantMode,
  ChatMessageItem,
  CropReport,
  FarmDetails,
  MonitoringHistoryEntry,
  MonitoringPhotoItem,
  WeatherMonitorData,
  WeeklyCropHealthEntry,
} from '../types/cropsense';
import { DEFAULT_FARM_DETAILS } from '../data/cropData';
import { ILLUSTRATIVE_WEEKLY_HEALTH_ENTRIES } from '../data/schemesData';
import { fetchFarmWeatherMonitor } from '../services/weatherService';

const FARM_STORAGE_KEY = 'cropsense_farm_details';
const REPORTS_STORAGE_KEY = 'cropsense_reports';
const CHAT_STORAGE_KEY = 'cropsense_chat_session';
const CHAT_SESSION_ID_KEY = 'cropsense_chat_session_id';
const WEEKLY_HEALTH_STORAGE_KEY = 'cropsense_weekly_health';
const MONITORING_HISTORY_STORAGE_KEY = 'cropsense_monitoring_history';

interface FarmContextValue {
  farmDetails: FarmDetails;
  hasSavedFarm: boolean;
  saveFarmDetails: (details: FarmDetails) => void;
  weatherData: WeatherMonitorData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  refreshWeather: (overrideDetails?: FarmDetails) => Promise<void>;
  weeklyHealthEntries: WeeklyCropHealthEntry[];
  addWeeklyHealthEntry: (entry: WeeklyCropHealthEntry) => void;
  deleteWeeklyHealthEntry: (entryId: string) => void;
  clearIllustrativeHealthEntries: () => void;
  monitoringPhotos: MonitoringPhotoItem[];
  addMonitoringPhoto: (photo: MonitoringPhotoItem) => void;
  updateMonitoringPhotoDate: (photoId: string, date: string) => void;
  removeMonitoringPhoto: (photoId: string) => void;
  monitoringHistory: MonitoringHistoryEntry[];
  addMonitoringHistoryEntry: (entry: MonitoringHistoryEntry) => void;
  deleteMonitoringHistoryEntry: (entryId: string) => void;
  assistantMode: ChatAssistantMode;
  setAssistantMode: (mode: ChatAssistantMode) => void;
  pendingChatPrompt: string | null;
  setPendingChatPrompt: (prompt: string | null) => void;
  reports: CropReport[];
  addReport: (report: CropReport) => void;
  deleteReport: (reportId: string) => void;
  chatSessionId: string | null;
  setChatSessionId: (sessionId: string | null) => void;
  chatMessages: ChatMessageItem[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageItem[]>>;
  clearChatMessages: () => void;
}

export const FarmContext = createContext<FarmContextValue | undefined>(undefined);

function loadStoredFarm(): { details: FarmDetails; saved: boolean } {
  try {
    const raw = localStorage.getItem(FARM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FarmDetails>;
      const merged: FarmDetails = {
        ...DEFAULT_FARM_DETAILS,
        ...parsed,
        district: parsed.district?.trim() || parsed.city?.trim() || DEFAULT_FARM_DETAILS.district,
        lastYearProduction:
          parsed.lastYearProduction !== undefined && parsed.lastYearProduction !== ''
            ? String(parsed.lastYearProduction)
            : DEFAULT_FARM_DETAILS.lastYearProduction,
        yieldUnit: parsed.yieldUnit || DEFAULT_FARM_DETAILS.yieldUnit,
      };
      return {
        details: merged,
        saved: true,
      };
    }
  } catch {
    // Fallback to default
  }
  return { details: DEFAULT_FARM_DETAILS, saved: false };
}

function loadStoredReports(): CropReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as CropReport[];
    }
  } catch {
    // Fallback to empty list
  }
  return [];
}

function loadStoredChat(): ChatMessageItem[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ChatMessageItem[];
    }
  } catch {
    // Fallback to empty chat
  }
  return [];
}

function loadStoredChatSessionId(): string | null {
  try {
    const raw = localStorage.getItem(CHAT_SESSION_ID_KEY);
    if (raw && raw.trim()) return raw.trim();
  } catch {
    // Ignore storage errors
  }
  return null;
}

function loadStoredWeeklyHealth(): WeeklyCropHealthEntry[] {
  try {
    const raw = localStorage.getItem(WEEKLY_HEALTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as WeeklyCropHealthEntry[];
    }
  } catch {
    // Fallback to illustrative seed timeline
  }
  return ILLUSTRATIVE_WEEKLY_HEALTH_ENTRIES;
}

function loadStoredMonitoringHistory(): MonitoringHistoryEntry[] {
  try {
    const raw = localStorage.getItem(MONITORING_HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MonitoringHistoryEntry[];
    }
  } catch {
    // Fallback to empty history
  }
  return [];
}

function persistWeeklyHealth(entries: WeeklyCropHealthEntry[]) {
  try {
    const compact = entries.slice(-24).map((item) => ({
      ...item,
      imageUrl:
        item.imageUrl && item.imageUrl.length > 220_000 ? undefined : item.imageUrl,
    }));
    localStorage.setItem(WEEKLY_HEALTH_STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // Ignore storage quota errors
  }
}

function persistMonitoringHistory(entries: MonitoringHistoryEntry[]) {
  try {
    const compact = entries.slice(0, 15).map((item) => ({
      ...item,
      photoThumbnails: item.photoThumbnails.map((thumb) => ({
        date: thumb.date,
        fileName: thumb.fileName,
        dataUrl: thumb.dataUrl && thumb.dataUrl.length <= 120_000 ? thumb.dataUrl : undefined,
      })),
    }));
    localStorage.setItem(MONITORING_HISTORY_STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // Ignore storage quota errors
  }
}

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialFarm = useMemo(() => loadStoredFarm(), []);
  const [farmDetails, setFarmDetails] = useState<FarmDetails>(initialFarm.details);
  const [hasSavedFarm, setHasSavedFarm] = useState<boolean>(initialFarm.saved);
  const [weatherData, setWeatherData] = useState<WeatherMonitorData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [weeklyHealthEntries, setWeeklyHealthEntries] = useState<WeeklyCropHealthEntry[]>(
    loadStoredWeeklyHealth
  );
  const [monitoringPhotos, setMonitoringPhotos] = useState<MonitoringPhotoItem[]>([]);
  const [monitoringHistory, setMonitoringHistory] = useState<MonitoringHistoryEntry[]>(
    loadStoredMonitoringHistory
  );

  const [assistantMode, setAssistantMode] = useState<ChatAssistantMode>('general');
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);

  const [reports, setReports] = useState<CropReport[]>(loadStoredReports);
  const [chatSessionId, setChatSessionIdState] = useState<string | null>(loadStoredChatSessionId);
  const [chatMessages, setChatMessagesState] = useState<ChatMessageItem[]>(loadStoredChat);

  const weatherRequestIdRef = useRef(0);

  const refreshWeather = useCallback(
    async (overrideDetails?: FarmDetails) => {
      const target = overrideDetails ?? farmDetails;
      if (!target.city && !target.state && (!target.latitude || !target.longitude)) {
        return;
      }

      const requestId = ++weatherRequestIdRef.current;
      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const result = await fetchFarmWeatherMonitor(target);
        if (requestId === weatherRequestIdRef.current) {
          setWeatherData(result);
        }
      } catch (err) {
        if (requestId === weatherRequestIdRef.current) {
          setWeatherError(
            err instanceof Error ? err.message : 'Unable to fetch weather data right now.'
          );
        }
      } finally {
        if (requestId === weatherRequestIdRef.current) {
          setWeatherLoading(false);
        }
      }
    },
    [farmDetails]
  );

  useEffect(() => {
    if (
      initialFarm.saved ||
      initialFarm.details.city ||
      initialFarm.details.state ||
      (initialFarm.details.latitude && initialFarm.details.longitude)
    ) {
      void refreshWeather(initialFarm.details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFarmDetails = useCallback(
    (details: FarmDetails) => {
      const stamped: FarmDetails = {
        ...details,
        district: details.district.trim() || details.city.trim(),
        updatedAt: new Date().toISOString(),
      };
      setFarmDetails(stamped);
      setHasSavedFarm(true);
      try {
        localStorage.setItem(FARM_STORAGE_KEY, JSON.stringify(stamped));
      } catch {
        // Ignore storage quota errors
      }
      void refreshWeather(stamped);
    },
    [refreshWeather]
  );

  const addWeeklyHealthEntry = useCallback((entry: WeeklyCropHealthEntry) => {
    setWeeklyHealthEntries((prev) => {
      const next = [...prev, entry].sort((a, b) => a.date.localeCompare(b.date));
      persistWeeklyHealth(next);
      return next;
    });
  }, []);

  const deleteWeeklyHealthEntry = useCallback((entryId: string) => {
    setWeeklyHealthEntries((prev) => {
      const next = prev.filter((item) => item.id !== entryId);
      persistWeeklyHealth(next);
      return next;
    });
  }, []);

  const clearIllustrativeHealthEntries = useCallback(() => {
    setWeeklyHealthEntries((prev) => {
      const next = prev.filter((item) => !item.isIllustrative);
      persistWeeklyHealth(next);
      return next;
    });
  }, []);

  const addMonitoringPhoto = useCallback((photo: MonitoringPhotoItem) => {
    setMonitoringPhotos((prev) =>
      [...prev, photo].sort((a, b) => a.date.localeCompare(b.date))
    );
  }, []);

  const updateMonitoringPhotoDate = useCallback((photoId: string, date: string) => {
    setMonitoringPhotos((prev) =>
      prev
        .map((p) => (p.id === photoId ? { ...p, date } : p))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
  }, []);

  const removeMonitoringPhoto = useCallback((photoId: string) => {
    setMonitoringPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }, []);

  const addMonitoringHistoryEntry = useCallback((entry: MonitoringHistoryEntry) => {
    setMonitoringHistory((prev) => {
      const next = [entry, ...prev];
      persistMonitoringHistory(next);
      return next;
    });
  }, []);

  const deleteMonitoringHistoryEntry = useCallback((entryId: string) => {
    setMonitoringHistory((prev) => {
      const next = prev.filter((item) => item.id !== entryId);
      persistMonitoringHistory(next);
      return next;
    });
  }, []);

  const addReport = useCallback((report: CropReport) => {
    setReports((prev) => {
      const next = [report, ...prev];
      try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    setReports((prev) => {
      const next = prev.filter((item) => item.id !== reportId);
      try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const setChatSessionId = useCallback((sessionId: string | null) => {
    const cleaned = sessionId?.trim() || null;
    setChatSessionIdState(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(CHAT_SESSION_ID_KEY, cleaned);
      } else {
        localStorage.removeItem(CHAT_SESSION_ID_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageItem[]>> = useCallback(
    (updater) => {
      setChatMessagesState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        try {
          const compact = next.slice(-30).map((msg) => ({
            ...msg,
            imagePreview:
              msg.imagePreview && msg.imagePreview.length > 200_000
                ? undefined
                : msg.imagePreview,
            imagePreviews: undefined,
          }));
          localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(compact));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });
    },
    []
  );

  const clearChatMessages = useCallback(() => {
    setChatMessagesState([]);
    setChatSessionId(null);
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, [setChatSessionId]);

  const value = useMemo<FarmContextValue>(
    () => ({
      farmDetails,
      hasSavedFarm,
      saveFarmDetails,
      weatherData,
      weatherLoading,
      weatherError,
      refreshWeather,
      weeklyHealthEntries,
      addWeeklyHealthEntry,
      deleteWeeklyHealthEntry,
      clearIllustrativeHealthEntries,
      monitoringPhotos,
      addMonitoringPhoto,
      updateMonitoringPhotoDate,
      removeMonitoringPhoto,
      monitoringHistory,
      addMonitoringHistoryEntry,
      deleteMonitoringHistoryEntry,
      assistantMode,
      setAssistantMode,
      pendingChatPrompt,
      setPendingChatPrompt,
      reports,
      addReport,
      deleteReport,
      chatSessionId,
      setChatSessionId,
      chatMessages,
      setChatMessages,
      clearChatMessages,
    }),
    [
      farmDetails,
      hasSavedFarm,
      saveFarmDetails,
      weatherData,
      weatherLoading,
      weatherError,
      refreshWeather,
      weeklyHealthEntries,
      addWeeklyHealthEntry,
      deleteWeeklyHealthEntry,
      clearIllustrativeHealthEntries,
      monitoringPhotos,
      addMonitoringPhoto,
      updateMonitoringPhotoDate,
      removeMonitoringPhoto,
      monitoringHistory,
      addMonitoringHistoryEntry,
      deleteMonitoringHistoryEntry,
      assistantMode,
      pendingChatPrompt,
      reports,
      addReport,
      deleteReport,
      chatSessionId,
      setChatSessionId,
      chatMessages,
      setChatMessages,
      clearChatMessages,
    ]
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};
