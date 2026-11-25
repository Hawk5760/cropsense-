import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Sprout, Volume2, VolumeX } from 'lucide-react';
import type { ChatMessageItem } from '../types/cropsense';
import { DiseaseResult } from './DiseaseResult';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface ChatMessageProps {
  message: ChatMessageItem;
  isSpeaking: boolean;
  onSpeak: (text: string, messageId: string) => void;
  onStopSpeaking: () => void;
  onSaveReport: (message: ChatMessageItem) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  onSaveReport,
}) => {
  const { t } = useLanguage();
  const isUser = message.role === 'user';

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    const previews =
      message.imagePreviews && message.imagePreviews.length > 0
        ? message.imagePreviews
        : message.imagePreview
          ? [message.imagePreview]
          : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
        className="flex justify-end"
      >
        <div className="max-w-[88%] sm:max-w-[75%] min-w-0 rounded-[12px] bg-brand-dark text-white px-3.5 sm:px-4 py-2.5 sm:py-3 space-y-2 shadow-sm">
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Uploaded crop photo ${idx + 1}`}
                  className="max-h-44 w-auto rounded-[6px] border border-white/15 object-cover"
                />
              ))}
            </div>
          )}
          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
          <div className="text-[11px] text-white/65 text-right tabular-nums">
            {formattedTime}
          </div>
        </div>
      </motion.div>
    );
  }

  const speakableText = message.diseaseAnalysis
    ? `${message.content} ${message.diseaseAnalysis.diseaseName}. ${message.diseaseAnalysis.suggestedTreatment.join('. ')}`
    : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: EASE_EDITORIAL }}
      className="flex justify-start"
    >
      <div
        className={`max-w-[94%] sm:max-w-[86%] min-w-0 rounded-[12px] border px-3.5 sm:px-4 py-3 sm:py-3.5 shadow-[0_2px_10px_rgba(45,58,46,0.03)] ${
          message.isError
            ? 'border-brand-danger/35 bg-brand-danger/5'
            : 'border-brand-border bg-brand-light/70'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green">
            <Sprout className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.brandName}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!message.isError && speakableText && (
              <button
                type="button"
                onClick={() =>
                  isSpeaking ? onStopSpeaking() : onSpeak(speakableText, message.id)
                }
                aria-label={isSpeaking ? t.chatbot.stopSpeakingAria : t.chatbot.speakAria}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-brand-muted hover:text-brand-dark rounded-[4px] hover:bg-brand-cream transition-colors cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-brand-danger" aria-hidden="true" />
                    <span className="text-brand-danger">{t.chatbot.stopSpeakingAria}</span>
                  </>
                ) : (
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            )}
            <span className="text-[11px] text-brand-muted tabular-nums">{formattedTime}</span>
          </div>
        </div>

        {message.status === 'partial' && !message.diseaseAnalysis && !message.isError && (
          <div
            role="note"
            className="mb-2 flex items-start gap-1.5 rounded-[6px] border border-amber-300/75 bg-amber-50/75 px-2.5 py-1.5 text-[11px] text-amber-950"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>Partial response: some supporting details were unavailable.</span>
          </div>
        )}

        <div className="text-sm text-brand-dark leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {message.diseaseAnalysis && (
          <DiseaseResult
            result={message.diseaseAnalysis}
            isSaved={Boolean(message.savedReportId)}
            onSaveReport={() => onSaveReport(message)}
          />
        )}
      </div>
    </motion.div>
  );
};
