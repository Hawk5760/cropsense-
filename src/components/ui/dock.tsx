'use client';

import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'motion/react';
import { cn } from '@/lib/utils';

const DEFAULT_MAGNIFICATION = 58;
const DEFAULT_BASE_SIZE = 38;
const DEFAULT_DISTANCE = 130;
const DEFAULT_PANEL_HEIGHT = 52;

type TooltipPlacement = 'top' | 'bottom';

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  baseItemSize?: number;
  spring?: SpringOptions;
  tooltipPlacement?: TooltipPlacement;
  ariaLabel?: string;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  ariaCurrent?: 'page' | undefined;
  isActive?: boolean;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DockContextType = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  baseItemSize: number;
  distance: number;
  tooltipPlacement: TooltipPlacement;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DockContextType;
};

const DockContext = createContext<DockContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 180, damping: 14 },
  magnification = DEFAULT_MAGNIFICATION,
  baseItemSize = DEFAULT_BASE_SIZE,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  tooltipPlacement = 'bottom',
  ariaLabel = 'Application dock',
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={({ clientX }) => {
        mouseX.set(clientX);
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
      className={cn(
        'mx-auto flex w-fit items-center gap-2.5 rounded-full border border-brand-border/90 bg-brand-cream/92 px-3 shadow-[0_6px_22px_rgba(45,58,46,0.08)] backdrop-blur-md',
        className
      )}
      style={{ height: panelHeight }}
      role="toolbar"
      aria-label={ariaLabel}
    >
      <DockProvider
        value={{
          mouseX,
          spring,
          distance,
          magnification,
          baseItemSize,
          tooltipPlacement,
        }}
      >
        {children}
      </DockProvider>
    </motion.div>
  );
}

function DockItem({
  children,
  className,
  onClick,
  ariaLabel,
  ariaCurrent,
  isActive = false,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const { distance, magnification, baseItemSize, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const sizeTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );

  const size = useSpring(sizeTransform, spring);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full cursor-pointer transition-colors shrink-0',
        isActive
          ? 'bg-brand-dark text-brand-cream shadow-sm'
          : 'bg-brand-light-green/75 text-brand-dark hover:bg-brand-light-green',
        className
      )}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(
          child as React.ReactElement<{
            width?: MotionValue<number>;
            isHovered?: MotionValue<number>;
          }>,
          { width: size, isHovered }
        );
      })}
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-green"
        />
      )}
    </motion.button>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const { tooltipPlacement } = useDock();
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number> | undefined;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  const isTop = tooltipPlacement === 'top';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? 4 : -4 }}
          animate={{ opacity: 1, y: isTop ? -8 : 8 }}
          exit={{ opacity: 0, y: isTop ? 4 : -4 }}
          transition={{ duration: 0.18 }}
          className={cn(
            'pointer-events-none absolute left-1/2 z-50 w-fit whitespace-nowrap rounded-md border border-brand-border bg-brand-dark px-2.5 py-1 text-[11px] font-medium text-brand-cream shadow-md',
            isTop ? '-top-7' : '-bottom-8',
            className
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps['width'] as MotionValue<number> | undefined;

  const fallbackWidth = useMotionValue(DEFAULT_BASE_SIZE);
  const activeWidth = width ?? fallbackWidth;
  const iconSize = useTransform(activeWidth, (val) => val * 0.48);

  return (
    <motion.div
      style={{ width: iconSize, height: iconSize }}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
