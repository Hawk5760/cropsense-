import React from 'react';
import { motion } from 'motion/react';

export const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealBlockProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  delay = 0,
  y = 14,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
