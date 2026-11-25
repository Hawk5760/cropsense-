import React from 'react';
import { motion } from 'motion/react';

interface BrandLogoProps {
  className?: string;
}

/**
 * CropSense Green Fields Logo — faithful vector mark matching the user's
 * CropSense Green Fields Logo (twin sprouting leaves over sweeping striped
 * green terraced fields + deep forest green serif CropSense wordmark).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <motion.span
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.18 }}
      className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 88 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-8 sm:w-11 sm:h-9 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cs-leaf-right" x1="36" y1="36" x2="78" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2F6E17" />
            <stop offset="60%" stopColor="#43841C" />
            <stop offset="100%" stopColor="#589D22" />
          </linearGradient>
          <linearGradient id="cs-leaf-left" x1="16" y1="14" x2="40" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5AA022" />
            <stop offset="100%" stopColor="#357318" />
          </linearGradient>
          <linearGradient id="cs-hill-dark" x1="4" y1="54" x2="42" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B4919" />
            <stop offset="100%" stopColor="#2D6622" />
          </linearGradient>
          <linearGradient id="cs-hill-mid" x1="18" y1="58" x2="74" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B7B19" />
            <stop offset="100%" stopColor="#5DA223" />
          </linearGradient>
          <linearGradient id="cs-hill-bright" x1="34" y1="64" x2="78" y2="43" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A8D1D" />
            <stop offset="100%" stopColor="#65AB25" />
          </linearGradient>
        </defs>

        {/* Left smaller sprout leaf */}
        <path
          d="M36.5 34.5C25.8 32.2 18.2 25.5 17.8 14.5C27.5 16.5 34.8 22.8 37.6 31.8L36.5 34.5Z"
          fill="url(#cs-leaf-left)"
        />
        {/* Inner curved vein on left leaf */}
        <path
          d="M23.5 20.5C28.8 24.4 33 28.8 36 33.4"
          stroke="#FAF8F5"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Right larger sweeping leaf */}
        <path
          d="M38.5 35.8C36.6 21.8 47.4 6.8 75.5 3.6C75.8 20.2 66.2 31.8 49.6 34.5C45.4 35.2 41.6 35.5 38.5 35.8Z"
          fill="url(#cs-leaf-right)"
        />
        {/* Inner curved vein on right leaf */}
        <path
          d="M39.4 34.8C44.8 24.8 53.4 17.6 64.5 12.2"
          stroke="#FAF8F5"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeOpacity="0.92"
        />

        {/* Terraced Field Band 1 — Left deep forest dark green arc */}
        <path
          d="M4.5 53.5C13.8 44.2 26.8 38.6 39.2 38.2C31.2 42.6 22.5 48.2 15.2 55.2C11.2 54.6 7.5 54 4.5 53.5Z"
          fill="url(#cs-hill-dark)"
        />

        {/* Terraced Field Band 2 — Upper sweeping green ridge */}
        <path
          d="M18.8 56C29.8 44.8 48.2 37.4 71.5 38.8C60.5 41.2 46.8 46.8 34.8 58.6C28.8 57.6 23.4 56.7 18.8 56Z"
          fill="url(#cs-hill-mid)"
        />

        {/* Terraced Field Band 3 — Middle sunlit green row */}
        <path
          d="M38.6 59.8C48.6 50.4 61.2 44.6 76.2 43.2C68.6 47.8 60.2 53.6 52.8 62.6C47.8 61.7 43 60.8 38.6 59.8Z"
          fill="url(#cs-hill-bright)"
        />

        {/* Terraced Field Band 4 — Lower right foreground curve */}
        <path
          d="M56.5 63.2C63.2 55.6 70.4 50.2 77.6 47.8C73.8 55.8 67.2 62.4 58.4 64.6C57.7 64.2 57.1 63.7 56.5 63.2Z"
          fill="url(#cs-hill-mid)"
        />
      </svg>

      <span className="font-logo-serif text-[23px] sm:text-[25px] font-bold text-[#143312] tracking-[-0.02em] leading-none">
        CropSense
      </span>
    </motion.span>
  );
};
