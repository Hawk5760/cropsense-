import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowUp,
  AudioLines,
  Camera,
  CheckCircle2,
  CircleStop,
  Globe,
  ImagePlus,
  Loader2,
  MessageCircle,
  Mic,
  Send,
  Settings,
  ShieldCheck,
  Sprout,
  Trash2,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { LANGUAGE_OPTIONS } from '../data/translations';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import {
  CropSenseApiError,
  postChatbotMain,
} from '../services/cropsenseApi';
import {
  dataUrlToFile,
  preparePlantImageFile,
  validatePlantImageFile,
  type PreparedPlantImage,
} from '../services/diseaseService';
import {
  isChatbotDiagnosisResponse,
  isChatbotTextResponse,
  mapDiagnosisResponseToUi,
} from '../utils/backendContract';
import type { ChatMessageItem, LanguageCode } from '../types/cropsense';
import { createDiseaseReport } from '../utils/reportUtils';
import { ChatMessage } from './ChatMessage';
import { ImageUploader } from './ImageUploader';
import { AiChatbotLogo } from './SectionLogos';

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

function Marker({ className, ...props }: ComponentProps<'div'>) {
  return <div className={className} {...props} />;
}

function MarkerContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={className} {...props} />;
}

const WAVE_BARS = [
  12, 8, 4, 20, 8, 20, 8, 8, 12, 8, 24, 8, 20, 28, 20, 32, 24, 8, 12, 8, 8, 20,
  8, 20, 8, 8, 12, 20, 12, 20, 28, 8, 28, 12, 20, 20, 12, 8, 4, 20, 8, 20, 8, 8,
  12, 12, 8, 4, 20, 8, 20, 8, 8, 12, 8, 24, 8, 28, 32, 24, 8, 12, 8, 8, 20, 8,
  20, 8, 12, 20, 12, 20, 28, 8, 28, 12, 20, 20, 12, 4, 20, 8, 20, 8, 8, 12,
];

const waveBarVariants = {
  recording: (index: number) => ({
    scaleY: [0.45, 1, 0.45],
    transition: {
      duration: 1.05,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: index * 0.015,
    },
  }),
  idle: {
    scaleY: 0.28,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

const TABS_CONFIG = [
  { value: 'chat', label: 'Chat', icon: MessageCircle },
  { value: 'voice', label: 'Voice', icon: AudioLines },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'settings', label: 'Settings', icon: Settings },
] as const;

type ChatTabValue = (typeof TABS_CONFIG)[number]['value'];

export const ChatInterface: React.FC = () => {
  const {
    farmDetails,
    assistantMode,
    setAssistantMode,
    pendingChatPrompt,
    setPendingChatPrompt,
    chatSessionId,
    setChatSessionId,
    chatMessages,
    setChatMessages,
    clearChatMessages,
    addReport,
  } = useFarmDetails();
  const { language, setLanguage, speechLocale, t, dt } = useLanguage();

  const [activeTab, setActiveTab] = useState<ChatTabValue>('chat');
  const [inputText, setInputText] = useState('');
  const [attachedImages, setAttachedImages] = useState<PreparedPlantImage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendingHasImages, setSendingHasImages] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Video / Leaf Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<PreparedPlantImage | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Settings toggles
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(false);
  const [includeFarmContext, setIncludeFarmContext] = useState(true);
  const [autoSaveDiseaseReports, setAutoSaveDiseaseReports] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isSending, activeTab]);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      recognitionRef.current?.stop();
      stopCamera();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopCamera]);

  useEffect(() => {
    if (activeTab !== 'video' && cameraActive) {
      stopCamera();
    }
  }, [activeTab, cameraActive, stopCamera]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, []);

  const speakText = useCallback(
    (text: string, messageId: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setStatusError(t.chatbot.voiceErrors.ttsUnsupported);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLocale;
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    },
    [speechLocale, t.chatbot.voiceErrors.ttsUnsupported]
  );

  const handleToggleVoice = () => {
    setStatusError(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setStatusError(t.chatbot.voiceErrors.unsupported);
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
          setVoiceTranscript((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setStatusError(t.chatbot.voiceErrors.permissionDenied);
        } else {
          setStatusError(t.chatbot.voiceErrors.generic);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setStatusError(t.chatbot.voiceErrors.generic);
    }
  };

  const handleToggleCamera = async () => {
    setCameraError(null);
    if (cameraActive) {
      stopCamera();
      return;
    }
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        'Live camera is unavailable in this browser. Upload a leaf photo below for instant disease diagnosis.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setCameraActive(true);
      window.requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setCameraError(
        'Camera permission was denied or no camera was found. You can still upload a leaf photo below.'
      );
    }
  };

  const handleCaptureCameraFrame = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const base64 = dataUrl.split(',')[1] ?? '';
    const fileName = `leaf-scan-${Date.now()}.jpg`;
    const file = dataUrlToFile(dataUrl, fileName, 'image/jpeg');
    const snapshot: PreparedPlantImage = {
      dataUrl,
      base64,
      mimeType: 'image/jpeg',
      fileName,
      file,
    };
    setCapturedSnapshot(snapshot);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusError(null);
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    if (activeTab === 'video') {
      const file = files[0];
      const validationError = validatePlantImageFile(file);
      if (validationError) {
        setStatusError(t.chatbot.errors[validationError]);
        return;
      }
      try {
        const prepared = await preparePlantImageFile(file);
        setCapturedSnapshot(prepared);
      } catch {
        setStatusError(t.chatbot.errors.invalidImageType);
      }
      return;
    }

    const remainingSlots = Math.max(0, 3 - attachedImages.length);
    if (remainingSlots === 0) {
      setStatusError('You can attach up to 3 photos per message.');
      return;
    }

    const selected = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setStatusError('Only up to 3 photos can be attached per message.');
    }

    const preparedBatch: PreparedPlantImage[] = [];
    for (const file of selected) {
      const validationError = validatePlantImageFile(file);
      if (validationError) {
        setStatusError(t.chatbot.errors[validationError]);
        continue;
      }
      try {
        preparedBatch.push(await preparePlantImageFile(file));
      } catch {
        setStatusError(t.chatbot.errors.invalidImageType);
      }
    }

    if (preparedBatch.length > 0) {
      setAttachedImages((prev) => [...prev, ...preparedBatch].slice(0, 3));
    }
  };

  const handleCancelRequest = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsSending(false);
    setSendingHasImages(false);
  };

  const handleSaveDiseaseReport = (message: ChatMessageItem) => {
    if (!message.diseaseAnalysis || message.savedReportId) return;
    const report = createDiseaseReport(message.diseaseAnalysis, farmDetails, message.content);
    addReport(report);
    setChatMessages((prev) =>
      prev.map((item) =>
        item.id === message.id ? { ...item, savedReportId: report.id } : item
      )
    );
  };

  const submitMessage = async (
    overridePrompt?: string,
    overrideImages?: PreparedPlantImage[]
  ) => {
    const textToSend = (overridePrompt ?? inputText).trim();
    const imagesToSend = overrideImages !== undefined ? overrideImages : attachedImages;

    if (!textToSend && imagesToSend.length === 0) return;
    if (isSending) return;

    setStatusError(null);
    stopSpeaking();
    setActiveTab('chat');

    const effectiveMessage =
      textToSend ||
      (imagesToSend.length > 0
        ? `Please diagnose these crop photos (${imagesToSend.map((img) => img.fileName).join(', ')}).`
        : '');

    const userMsg: ChatMessageItem = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: effectiveMessage,
      timestamp: new Date().toISOString(),
      imagePreview: imagesToSend[0]?.dataUrl,
      imagePreviews: imagesToSend.map((img) => img.dataUrl),
    };

    const prevInput = inputText;
    const prevImages = attachedImages;

    setChatMessages((prev) => [...prev, userMsg]);
    if (!overridePrompt) {
      setInputText('');
    }
    if (overrideImages === undefined) {
      setAttachedImages([]);
    }
    setIsSending(true);
    setSendingHasImages(imagesToSend.length > 0);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiResponse = await postChatbotMain({
        message: effectiveMessage,
        farmDetails,
        language,
        sessionId: chatSessionId,
        files: imagesToSend.map((img) => img.file),
        signal: controller.signal,
      });

      if (apiResponse.session_id) {
        setChatSessionId(apiResponse.session_id);
      }

      if (isChatbotTextResponse(apiResponse)) {
        const assistantMsg: ChatMessageItem = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: apiResponse.answer,
          status: apiResponse.status,
          timestamp: new Date().toISOString(),
          assistantMode,
        };
        setChatMessages((prev) => [...prev, assistantMsg]);

        if (autoSpeakReplies && apiResponse.answer) {
          speakText(apiResponse.answer, assistantMsg.id);
        }
      } else if (isChatbotDiagnosisResponse(apiResponse)) {
        const uiDiagnosis = mapDiagnosisResponseToUi(apiResponse);
        const summaryReply =
          apiResponse.summary ||
          `${uiDiagnosis.diseaseName} (${uiDiagnosis.severity} severity).`;

        let savedReportId: string | undefined;
        if (autoSaveDiseaseReports) {
          const autoReport = createDiseaseReport(uiDiagnosis, farmDetails, summaryReply);
          addReport(autoReport);
          savedReportId = autoReport.id;
        }

        const assistantMsg: ChatMessageItem = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: summaryReply,
          status: apiResponse.status,
          timestamp: new Date().toISOString(),
          diseaseAnalysis: uiDiagnosis,
          savedReportId,
          assistantMode,
        };
        setChatMessages((prev) => [...prev, assistantMsg]);

        if (autoSpeakReplies && summaryReply) {
          speakText(summaryReply, assistantMsg.id);
        }
      } else {
        throw new CropSenseApiError(502, 'Unexpected response structure from CropSense chatbot.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (!overridePrompt) setInputText(prevInput);
        if (overrideImages === undefined) setAttachedImages(prevImages);
        setStatusError('Request cancelled. Your message and photos were preserved.');
      } else {
        // Preserve composer inputs on validation/network failure per Section 7
        if (!overridePrompt && !inputText) setInputText(prevInput);
        if (overrideImages === undefined && prevImages.length > 0) setAttachedImages(prevImages);

        const errorMsg: ChatMessageItem = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content:
            err instanceof Error && err.message
              ? err.message
              : t.chatbot.errors.requestFailed,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      abortControllerRef.current = null;
      setIsSending(false);
      setSendingHasImages(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void submitMessage();
    }
  };

  useEffect(() => {
    if (pendingChatPrompt && !isSending) {
      const promptToRun = pendingChatPrompt;
      setPendingChatPrompt(null);
      void submitMessage(promptToRun);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingChatPrompt]);

  const quickActions =
    assistantMode === 'financial_assistance'
      ? [
          {
            key: 'eligibleSchemes',
            label: 'Eligible Schemes',
            prompt: dt.floatingChatbot.financialPrompts.eligibleSchemes,
          },
          {
            key: 'cropLossClaim',
            label: 'Crop Loss Claim',
            prompt: dt.floatingChatbot.financialPrompts.cropLossClaim,
          },
          {
            key: 'microIrrigationSubsidy',
            label: 'Irrigation Subsidy',
            prompt: dt.floatingChatbot.financialPrompts.microIrrigationSubsidy,
          },
          {
            key: 'documentsChecklist',
            label: 'Documents Checklist',
            prompt: dt.floatingChatbot.financialPrompts.documentsChecklist,
          },
        ]
      : [
          {
            key: 'detectDisease',
            label: t.chatbot.quickActions.detectDisease,
            prompt: t.chatbot.quickActionPrompts.detectDisease,
          },
          {
            key: 'checkRisk',
            label: t.chatbot.quickActions.checkRisk,
            prompt: t.chatbot.quickActionPrompts.checkRisk,
          },
          {
            key: 'preventiveMeasures',
            label: t.chatbot.quickActions.preventiveMeasures,
            prompt: t.chatbot.quickActionPrompts.preventiveMeasures,
          },
          {
            key: 'recommendTreatment',
            label: t.chatbot.quickActions.recommendTreatment,
            prompt: t.chatbot.quickActionPrompts.recommendTreatment,
          },
          {
            key: 'environmentalConditions',
            label: t.chatbot.quickActions.environmentalConditions,
            prompt: t.chatbot.quickActionPrompts.environmentalConditions,
          },
        ];

  const currentLangLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language)?.nativeName ?? 'English';

  return (
    <div
      data-testid="chat-interface-root"
      className="flex flex-col h-[calc(100dvh-204px)] min-h-[420px] max-h-[700px] lg:h-[calc(100vh-295px)] lg:min-h-[520px] lg:max-h-[720px] gap-2.5 sm:gap-3.5 overflow-hidden"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleImageSelect}
        className="hidden"
        aria-label={t.chatbot.uploadImageAria}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ChatTabValue)}
        className="flex flex-col flex-1 min-h-0 gap-2.5 sm:gap-3.5 overflow-hidden"
      >
        {/* Top Row: Animated Expanding Pill TabsList + Utility controls */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <TabsList className="w-full sm:w-auto h-auto gap-1 rounded-full border border-brand-border/85 bg-[#ECE9E1]/95 p-1 flex items-center justify-between sm:inline-flex shadow-[0_2px_10px_rgba(45,58,46,0.04)]">
            {TABS_CONFIG.map(({ value: itemValue, label, icon: Icon }) => {
              const isActive = activeTab === itemValue;
              return (
                <TabsTrigger
                  key={itemValue}
                  value={itemValue}
                  aria-label={label}
                  onClick={() => setActiveTab(itemValue)}
                  className={cn(
                    'rounded-full border-none py-2 text-xs sm:text-sm font-medium text-brand-muted data-[state=active]:bg-brand-cream data-[state=active]:text-brand-dark data-[state=active]:shadow-xs cursor-pointer transition-all duration-300 flex items-center justify-center',
                    isActive
                      ? 'flex-1 sm:flex-none px-3.5 sm:px-4'
                      : 'flex-none px-3 sm:px-3.5 hover:text-brand-dark'
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: 'auto', opacity: 1, marginLeft: 6 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden whitespace-nowrap text-xs sm:text-sm font-medium inline-block"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex items-center gap-2">
            {speakingMessageId && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-danger border border-brand-danger/30 bg-brand-danger/5 rounded-full hover:bg-brand-danger/10 transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.chatbot.stopSpeakingAria}</span>
              </button>
            )}
            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  clearChatMessages();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-muted hover:text-brand-dark border border-brand-border/80 bg-brand-cream/90 rounded-full hover:bg-brand-light transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.chatbot.clearChatButton}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Card Surface */}
        <div className="relative flex-1 flex flex-col min-h-0 rounded-[16px] border border-brand-border/90 bg-brand-cream/95 shadow-[0_8px_28px_rgba(45,58,46,0.06)] overflow-hidden">
          <TabsContent
            value={activeTab}
            className="mt-0 flex-1 flex flex-col min-h-0 overflow-hidden outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              {/* 1. CHAT PANEL */}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex flex-col flex-1 min-h-0 overflow-hidden"
                >
                  {/* Financial Assistance Context Retained Banner */}
                  {assistantMode === 'financial_assistance' && (
                    <div
                      role="status"
                      data-testid="financial-context-banner"
                      className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-5 py-2.5 border-b border-emerald-200/80 bg-[#E7EBDD]/85 text-xs text-brand-dark"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <ShieldCheck
                          className="w-4 h-4 text-brand-green shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold block">
                            {dt.floatingChatbot.financialBannerTitle}
                          </span>
                          <span className="text-[11px] text-brand-dark/80 block">
                            {dt.floatingChatbot.financialBannerBody}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAssistantMode('general')}
                        className="px-2.5 py-1 rounded-full border border-brand-border bg-white/90 text-[11px] font-medium text-brand-dark hover:bg-brand-light transition-colors cursor-pointer shrink-0"
                      >
                        {dt.floatingChatbot.switchToGeneral}
                      </button>
                    </div>
                  )}

                  {/* Quick agronomy or financial-assistance prompts strip (horizontal swipe on mobile) */}
                  <div
                    className="shrink-0 flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-brand-border/75 bg-brand-light/55 no-scrollbar"
                    role="group"
                    aria-label={t.chatbot.quickActionsLabel}
                  >
                    {quickActions.map((action) => (
                      <button
                        key={action.key}
                        type="button"
                        disabled={isSending}
                        onClick={() => void submitMessage(action.prompt)}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium text-brand-dark bg-brand-cream border border-brand-border rounded-full hover:bg-brand-light-green/80 hover:border-brand-green/45 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-50 whitespace-nowrap cursor-pointer"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable conversation area */}
                  <div
                    ref={scrollContainerRef}
                    data-testid="chat-messages-scroll"
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-5 py-3.5 sm:py-5 space-y-3.5 sm:space-y-5"
                    aria-live="polite"
                  >
                    {chatMessages.length === 0 ? (
                      <div className="max-w-xl mx-auto my-2 sm:my-8 rounded-[14px] border border-brand-border/80 bg-brand-light/65 p-4 sm:p-6 text-center space-y-2.5 sm:space-y-3">
                        <AiChatbotLogo className="w-12 h-12 sm:w-14 sm:h-14 mx-auto" />
                        <h2 className="font-manrope text-lg sm:text-xl font-bold text-brand-dark">
                          {t.chatbot.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                          {t.chatbot.welcomeMessage}
                        </p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <ChatMessage
                          key={msg.id}
                          message={msg}
                          isSpeaking={speakingMessageId === msg.id}
                          onSpeak={speakText}
                          onStopSpeaking={stopSpeaking}
                          onSaveReport={handleSaveDiseaseReport}
                        />
                      ))
                    )}

                    {/* Animated Shimmer Thinking Indicator (exact tabs-10 style) */}
                    {isSending && (
                      <motion.div
                        key="thinking"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-wrap items-center gap-2 px-1 py-1"
                      >
                        <Marker className="inline-flex items-center gap-2.5 rounded-full border border-brand-border/80 bg-brand-light/85 px-4 py-2">
                          <Loader2
                            className="size-3.5 animate-spin text-brand-green"
                            aria-hidden="true"
                          />
                          <MarkerContent>
                            <motion.span
                              className="bg-clip-text text-xs sm:text-sm font-medium text-transparent"
                              style={{
                                backgroundImage:
                                  'linear-gradient(90deg, #77786F 35%, #2D3A2E 50%, #77786F 65%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                              }}
                              animate={{ backgroundPosition: ['150% 0', '-50% 0'] }}
                              transition={{
                                duration: 1.3,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              {sendingHasImages
                                ? t.chatbot.analyzingImageLabel
                                : `${t.chatbot.analyzingLabel}...`}
                            </motion.span>
                          </MarkerContent>
                        </Marker>
                        <button
                          type="button"
                          onClick={handleCancelRequest}
                          className="px-2.5 py-1.5 rounded-full border border-brand-border bg-white text-xs font-medium text-brand-muted hover:text-brand-danger hover:border-brand-danger/40 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom InputGroup Composer (tabs-10 style upgraded with up to 3 leaf photos & voice) */}
                  <div
                    data-testid="chat-composer"
                    className="shrink-0 border-t border-brand-border/80 bg-brand-cream px-3 sm:px-5 py-2.5 sm:py-3.5"
                  >
                    {statusError && (
                      <div
                        role="alert"
                        className="mb-2.5 flex items-center gap-2 rounded-[8px] border border-brand-danger/30 bg-brand-danger/5 px-3 py-2 text-xs text-brand-danger"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{statusError}</span>
                      </div>
                    )}

                    <ImageUploader
                      images={attachedImages}
                      maxImages={3}
                      onRemove={(idx) =>
                        setAttachedImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                    />

                    <InputGroup className="flex w-full items-center justify-between gap-1.5 sm:gap-2 rounded-xl border border-brand-border bg-white/90 px-2.5 sm:px-3 py-2 h-auto shadow-xs">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending || attachedImages.length >= 3}
                        aria-label={t.chatbot.uploadImageAria}
                        title={`${t.chatbot.uploadImageAria} (up to 3)`}
                        className="relative size-9 sm:size-8 rounded-lg border border-brand-border/75 bg-brand-light/70 flex items-center justify-center text-brand-dark hover:bg-brand-light-green transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        <ImagePlus className="size-4" aria-hidden="true" />
                        {attachedImages.length > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-brand-green text-white text-[10px] font-bold flex items-center justify-center px-1">
                            {attachedImages.length}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('voice')}
                        disabled={isSending}
                        aria-label={t.chatbot.voiceStartAria}
                        title={t.chatbot.voiceStartAria}
                        className="size-9 sm:size-8 rounded-lg border border-brand-border/75 bg-brand-light/70 flex items-center justify-center text-brand-dark hover:bg-brand-light-green transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        <Mic className="size-4" aria-hidden="true" />
                      </button>

                      <InputGroupInput
                        value={inputText}
                        onChange={(event) => setInputText(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder={t.chatbot.inputPlaceholder}
                        aria-label={t.chatbot.inputPlaceholder}
                        disabled={isSending}
                        className="w-full min-w-0 bg-transparent border-0 h-auto py-1 px-1.5 shadow-none outline-none focus-visible:ring-0 text-sm text-brand-dark placeholder:text-brand-muted/80 disabled:opacity-60"
                      />

                      <Button
                        type="button"
                        onClick={() => void submitMessage()}
                        disabled={isSending || (!inputText.trim() && attachedImages.length === 0)}
                        size="icon-xs"
                        className="rounded-full size-9 sm:size-8 p-0 bg-brand-dark hover:bg-brand-green text-white shrink-0 cursor-pointer"
                        aria-label={t.chatbot.sendButton}
                      >
                        {isSending ? (
                          <Loader2 className="size-3.5 animate-spin text-white" />
                        ) : (
                          <ArrowUp className="size-4 text-white" />
                        )}
                      </Button>
                    </InputGroup>
                  </div>
                </motion.div>
              )}

              {/* 2. VOICE PANEL (tabs-10 Waveform + Real Web Speech API) */}
              {activeTab === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-5 sm:p-10 gap-5 sm:gap-6"
                >
                  <div className="text-center space-y-1.5 max-w-md">
                    <h2 className="font-manrope text-xl font-bold text-brand-dark">
                      Voice Crop Assistant
                    </h2>
                    <p className="text-sm text-brand-muted">
                      Speak your crop question in <strong className="text-brand-dark">{currentLangLabel}</strong> and send it straight to CropSense AI.
                    </p>
                  </div>

                  {/* Animated 86-bar waveform container (tabs-10 style) */}
                  <div className="flex h-20 w-full max-w-2xl items-center justify-center rounded-2xl border border-brand-border/80 bg-[#ECE9E1]/80 px-5 shadow-inner">
                    <div className="flex items-center justify-center gap-[3px] w-full overflow-hidden">
                      {WAVE_BARS.map((height, index) => (
                        <motion.span
                          key={index}
                          custom={index}
                          variants={waveBarVariants}
                          animate={isListening ? 'recording' : 'idle'}
                          className={cn(
                            'w-[3px] shrink-0 rounded-full transition-colors',
                            isListening ? 'bg-brand-green' : 'bg-brand-dark/35'
                          )}
                          style={{
                            height: height * 1.45,
                            originY: 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                      type="button"
                      onClick={handleToggleVoice}
                      className={cn(
                        'rounded-full h-10 px-6 text-sm font-medium gap-2 cursor-pointer shadow-xs',
                        isListening
                          ? 'bg-brand-danger hover:bg-brand-danger/90 text-white'
                          : 'bg-brand-dark hover:bg-brand-green text-white'
                      )}
                      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    >
                      {isListening ? (
                        <CircleStop className="size-4" />
                      ) : (
                        <Mic className="size-4" />
                      )}
                      <span>{isListening ? 'Stop Listening' : 'Start Voice Input'}</span>
                    </Button>

                    {voiceTranscript.trim() && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          const text = voiceTranscript.trim();
                          setVoiceTranscript('');
                          void submitMessage(text);
                        }}
                        className="rounded-full h-10 px-5 text-sm font-medium gap-2 bg-brand-light-green text-brand-dark hover:bg-brand-light-green/80 cursor-pointer"
                      >
                        <Send className="size-3.5" />
                        <span>Ask CropSense AI</span>
                      </Button>
                    )}
                  </div>

                  {statusError && (
                    <div
                      role="alert"
                      className="max-w-lg flex items-center gap-2 rounded-xl border border-brand-danger/30 bg-brand-danger/5 px-4 py-2.5 text-xs text-brand-danger"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{statusError}</span>
                    </div>
                  )}

                  {voiceTranscript && (
                    <div className="w-full max-w-2xl rounded-xl border border-brand-border bg-white/85 p-4 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                        Captured Transcript
                      </p>
                      <p className="text-sm text-brand-dark leading-relaxed">
                        {voiceTranscript}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 3. VIDEO / LIVE LEAF SCAN PANEL (tabs-10 style + real camera/upload capture) */}
              {activeTab === 'video' && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-5 sm:p-8 gap-4 sm:gap-5"
                >
                  <div className="text-center space-y-1 max-w-md">
                    <h2 className="font-manrope text-xl font-bold text-brand-dark">
                      Live Leaf Scan &amp; Camera
                    </h2>
                    <p className="text-sm text-brand-muted">
                      Point your camera at an affected crop leaf or upload a clear photo for instant AI disease analysis.
                    </p>
                  </div>

                  {/* Camera Status Bar + Viewport */}
                  <div className="w-full max-w-xl space-y-3">
                    <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-border/80 bg-[#ECE9E1]/85 px-4">
                      <Video
                        className={cn(
                          'size-4',
                          cameraActive
                            ? 'text-brand-green animate-pulse'
                            : 'text-brand-muted/70'
                        )}
                      />
                      <span className="text-xs sm:text-sm text-brand-dark font-medium">
                        {cameraActive ? 'Video feed active — align crop leaf in frame' : 'Camera off'}
                      </span>
                    </div>

                    {cameraActive && (
                      <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-dark aspect-video shadow-sm">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {capturedSnapshot && (
                      <div className="rounded-2xl border border-brand-border bg-white/90 p-3 flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src={capturedSnapshot.dataUrl}
                          alt="Captured crop leaf"
                          className="w-28 h-24 rounded-xl object-cover border border-brand-border shrink-0"
                        />
                        <div className="flex-1 text-left space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-brand-green">
                            <CheckCircle2 className="size-4" />
                            <span>Leaf image ready for diagnosis</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                const img = capturedSnapshot;
                                setCapturedSnapshot(null);
                                stopCamera();
                                void submitMessage(
                                  t.chatbot.quickActionPrompts.detectDisease,
                                  [img]
                                );
                              }}
                              className="rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs cursor-pointer"
                            >
                              Analyze Disease Now
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setCapturedSnapshot(null)}
                              className="rounded-full text-xs cursor-pointer"
                            >
                              Retake
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                      type="button"
                      onClick={() => void handleToggleCamera()}
                      className="rounded-full h-10 px-5 text-sm font-medium gap-2 bg-brand-dark hover:bg-brand-green text-white cursor-pointer"
                      aria-label={cameraActive ? 'Stop video feed' : 'Start video feed'}
                    >
                      {cameraActive ? (
                        <CircleStop className="size-4" />
                      ) : (
                        <Video className="size-4" />
                      )}
                      <span>{cameraActive ? 'Stop Camera' : 'Start Camera'}</span>
                    </Button>

                    {cameraActive && (
                      <Button
                        type="button"
                        onClick={handleCaptureCameraFrame}
                        className="rounded-full h-10 px-5 text-sm font-medium gap-2 bg-brand-green hover:bg-brand-dark text-white cursor-pointer"
                      >
                        <Camera className="size-4" />
                        <span>Capture Leaf</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full h-10 px-5 text-sm font-medium gap-2 border-brand-border bg-brand-cream hover:bg-brand-light-green/60 text-brand-dark cursor-pointer"
                    >
                      <ImagePlus className="size-4" />
                      <span>Upload Leaf Photo</span>
                    </Button>
                  </div>

                  {cameraError && (
                    <div
                      role="note"
                      className="max-w-lg flex items-start gap-2 rounded-xl border border-brand-border bg-brand-light/90 px-4 py-3 text-xs text-brand-muted"
                    >
                      <AlertCircle className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" />
                      <span>{cameraError}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 4. SETTINGS PANEL (exact tabs-10 Switch rows wired to real app settings) */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col justify-start sm:justify-center p-4 sm:p-10"
                >
                  <div className="w-full max-w-xl mx-auto rounded-2xl border border-brand-border/85 bg-white/70 p-6 space-y-5 shadow-xs">
                    <div>
                      <h2 className="font-manrope text-lg font-bold text-brand-dark">
                        Assistant Preferences
                      </h2>
                      <p className="text-xs text-brand-muted mt-0.5">
                        Customize how CropSense AI responds, reads answers, and uses your farm details.
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Volume2 className="size-4 text-brand-green shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-dark">
                            Auto-Read AI Replies
                          </p>
                          <p className="text-xs text-brand-muted">
                            Read assistant answers aloud automatically using voice output.
                          </p>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={autoSpeakReplies}
                        onCheckedChange={setAutoSpeakReplies}
                        aria-label="Auto-Read AI Replies"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Sprout className="size-4 text-brand-green shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-dark">
                            Include Farm Profile Context
                          </p>
                          <p className="text-xs text-brand-muted">
                            Tailor advice to {farmDetails.city || 'your location'}, {farmDetails.crop}, and {farmDetails.season} season.
                          </p>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={includeFarmContext}
                        onCheckedChange={setIncludeFarmContext}
                        aria-label="Include Farm Profile Context"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="size-4 text-brand-green shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-brand-dark">
                            Auto-Save Disease Reports
                          </p>
                          <p className="text-xs text-brand-muted">
                            Automatically archive detected leaf disease analyses into Reports.
                          </p>
                        </div>
                      </div>
                      <Switch
                        size="sm"
                        checked={autoSaveDiseaseReports}
                        onCheckedChange={setAutoSaveDiseaseReports}
                        aria-label="Auto-Save Disease Reports"
                      />
                    </div>

                    <Separator />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Globe className="size-4 text-brand-green shrink-0" />
                        <span className="text-sm font-medium text-brand-dark">Language</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {LANGUAGE_OPTIONS.map((opt) => (
                          <Fragment key={opt.code}>
                            <button
                              type="button"
                              onClick={() => setLanguage(opt.code as LanguageCode)}
                              className={cn(
                                'px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer',
                                language === opt.code
                                  ? 'bg-brand-dark text-white'
                                  : 'bg-brand-light text-brand-dark hover:bg-brand-light-green'
                              )}
                            >
                              {opt.nativeName}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
