import React from 'react';
import { X } from 'lucide-react';
import type { PreparedPlantImage } from '../services/diseaseService';
import { useLanguage } from '../hooks/useLanguage';

interface ImageUploaderProps {
  images: PreparedPlantImage[];
  onRemove: (index: number) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onRemove,
  maxImages = 3,
}) => {
  const { t } = useLanguage();
  if (images.length === 0) return null;

  return (
    <div
      data-testid="chat-attached-images"
      className="mb-2.5 space-y-1.5 rounded-[8px] border border-brand-border bg-brand-light/90 p-2.5"
    >
      <div className="flex items-center justify-between text-[11px] font-medium text-brand-muted px-0.5">
        <span>
          {t.chatbot.imageReadyLabel} ({images.length}/{maxImages})
        </span>
        <span>JPEG / PNG / WebP · max 8 MB each</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((image, idx) => (
          <div
            key={`${image.fileName}-${idx}`}
            className="flex items-center gap-2 rounded-[6px] border border-brand-border bg-white/95 p-1.5 pr-2 max-w-[210px]"
          >
            <img
              src={image.dataUrl}
              alt={image.fileName}
              className="w-11 h-11 rounded-[4px] object-cover border border-brand-border shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-brand-dark truncate">{image.fileName}</p>
              <p className="text-[10px] text-brand-muted">Photo {idx + 1}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(idx)}
              aria-label={`${t.chatbot.removeImageAria} ${idx + 1}`}
              className="w-6 h-6 rounded-[4px] border border-brand-border bg-brand-cream flex items-center justify-center text-brand-dark hover:bg-brand-danger/10 hover:text-brand-danger transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
