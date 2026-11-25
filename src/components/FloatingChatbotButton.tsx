import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface FloatingChatbotButtonProps {
  fromFinancialAssistance?: boolean;
  desktopOnly?: boolean;
  onClick: () => void;
}

export const FloatingChatbotButton: React.FC<FloatingChatbotButtonProps> = ({
  fromFinancialAssistance = false,
  desktopOnly = false,
  onClick,
}) => {
  const { dt } = useLanguage();

  const label = fromFinancialAssistance
    ? dt.floatingChatbot.financialLabel
    : dt.floatingChatbot.generalLabel;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      aria-label={label}
      title={fromFinancialAssistance ? dt.floatingChatbot.financialTooltip : label}
      data-testid="floating-chatbot-button"
      className={`${
        desktopOnly ? 'hidden lg:inline-flex' : 'inline-flex'
      } fixed bottom-[76px] right-3.5 lg:bottom-6 lg:right-6 z-40 items-center justify-center lg:gap-2.5 w-[48px] h-[48px] lg:w-auto lg:h-auto p-0 lg:pl-4 lg:pr-5 lg:py-3 rounded-full bg-brand-dark text-white shadow-[0_10px_28px_rgba(45,58,46,0.32)] hover:bg-brand-green border border-white/15 transition-colors cursor-pointer ${
        fromFinancialAssistance ? 'ring-2 ring-[#C6D4B5]/85 lg:ring-0' : ''
      }`}
    >
      <span className="relative flex items-center justify-center w-8 h-8 lg:w-7 lg:h-7 rounded-full bg-white/15">
        {fromFinancialAssistance ? (
          <Sparkles className="w-4 h-4 text-[#E7EBDD]" aria-hidden="true" />
        ) : (
          <MessageCircle className="w-4 h-4 text-white" aria-hidden="true" />
        )}
        {fromFinancialAssistance && (
          <span
            className="lg:hidden absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-brand-dark"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="hidden lg:inline text-xs lg:text-sm font-semibold tracking-tight whitespace-nowrap">
        {label}
      </span>
    </motion.button>
  );
};
