import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * 1. Farm Details Logo — faithful transparent SVG matching the user's uploaded
 * Farm Details emblem (farmhouse barn, checklist with checkmarks, trees, and
 * striped green terraced fields on a soft sage circle).
 */
export const FarmDetailsLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="40" cy="40" r="37" fill="#EDF5DC" />

    {/* Checklist board (top-right) */}
    <rect
      x="38"
      y="10"
      width="26"
      height="34"
      rx="5"
      fill="#FAF8F5"
      stroke="#143B16"
      strokeWidth="3.2"
    />
    {/* Checkmark 1 + line */}
    <path
      d="M43.5 20.5L46 23L50.5 18"
      stroke="#143B16"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M53.5 21H59.5" stroke="#143B16" strokeWidth="2.6" strokeLinecap="round" />
    {/* Checkmark 2 + line */}
    <path
      d="M43.5 31L46 33.5L50.5 28.5"
      stroke="#143B16"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M53.5 31.5H59.5" stroke="#143B16" strokeWidth="2.6" strokeLinecap="round" />

    {/* Farmhouse barn (left-center) */}
    <path
      d="M19 42.5L31 32L43 42.5V54H19V42.5Z"
      fill="#143B16"
    />
    <path
      d="M16.5 43.5L31 30.5L45.5 43.5"
      stroke="#143B16"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Barn window & doorway */}
    <rect x="29" y="38.5" width="4" height="4" rx="0.8" fill="#EDF5DC" />
    <rect x="27.5" y="45.5" width="7" height="8.5" rx="1" fill="#EDF5DC" />
    {/* Side shed */}
    <path d="M43 46.5L50 48.5V54H43V46.5Z" fill="#143B16" />

    {/* Left & right green trees */}
    <ellipse cx="14.5" cy="43" rx="3.4" ry="5.5" fill="#468B1B" />
    <path d="M14.5 48.5V52.5" stroke="#143B16" strokeWidth="1.8" strokeLinecap="round" />
    <ellipse cx="55.5" cy="46.5" rx="2.7" ry="4.4" fill="#468B1B" />
    <path d="M55.5 50.8V53.8" stroke="#143B16" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="62" cy="44.5" rx="3.2" ry="5.2" fill="#3B7B19" />
    <path d="M62 49.6V53.5" stroke="#143B16" strokeWidth="1.7" strokeLinecap="round" />

    {/* Striped green terraced fields at bottom (clipped to circle) */}
    <clipPath id="fd-circle-clip">
      <circle cx="40" cy="40" r="36.5" />
    </clipPath>
    <g clipPath="url(#fd-circle-clip)">
      <path d="M2 53C18 49.5 34 49.5 50 53.5L36 62C22 58.5 11 58 2 59.5V53Z" fill="#52981D" />
      <path d="M8 65C23 55.5 46 51.5 76 54.5L76 62C51 59.5 32 63.5 18 73L8 65Z" fill="#468A1A" />
      <path d="M26 76C39 65.5 56 61.5 77 62.5V77H26V76Z" fill="#1E5218" />
    </g>
  </svg>
);

/**
 * 2. AI Chatbot Logo — faithful transparent SVG matching the user's uploaded
 * AI Chatbot emblem (smiling robot head inside a forest-green chat bubble with
 * 3 dots and twin green leaves sprouting from the upper right).
 */
export const AiChatbotLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="38" cy="42" r="34" fill="#EDF5DC" />

    {/* Chat bubble outline with bottom-left tail */}
    <path
      d="M59.5 29C63.8 34.4 65.4 42 63.2 49.5C59.8 60.8 48.2 67.5 36.4 65.4C32.2 64.6 28.4 63.1 25.2 60.8L16.5 64.8L20.4 56.2C18.5 52.8 17.5 48.8 17.5 44.6"
      stroke="#143B16"
      strokeWidth="3.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FAF8F5"
    />

    {/* Antenna */}
    <path d="M37 19V27" stroke="#143B16" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="37" cy="17" r="3.6" fill="#143B16" />

    {/* Robot head frame */}
    <rect x="17" y="34" width="5.5" height="11" rx="2.75" fill="#143B16" />
    <rect x="51.5" y="34" width="5.5" height="11" rx="2.75" fill="#143B16" />
    <rect
      x="21.5"
      y="27"
      width="31"
      height="25"
      rx="10"
      fill="#FAF8F5"
      stroke="#143B16"
      strokeWidth="3.6"
    />
    {/* Robot inner dark screen */}
    <rect x="26.5" y="31.5" width="21" height="16" rx="6.5" fill="#143B16" />
    {/* Eyes & smile */}
    <circle cx="32.8" cy="38.5" r="2.2" fill="#FAF8F5" />
    <circle cx="41.2" cy="38.5" r="2.2" fill="#FAF8F5" />
    <path
      d="M34 42.8C35.4 44.3 38.6 44.3 40 42.8"
      stroke="#FAF8F5"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Three chat dots */}
    <circle cx="42" cy="58.5" r="1.9" fill="#143B16" />
    <circle cx="48" cy="58.5" r="1.9" fill="#143B16" />
    <circle cx="54" cy="58.5" r="1.9" fill="#143B16" />

    {/* Twin sprouting green leaves (top-right) */}
    <path
      d="M58.5 29C53.2 26.8 50.8 21.8 51.4 15.2C57 17 60.2 21.6 59.5 28L58.5 29Z"
      fill="#5CA121"
    />
    <path
      d="M60.2 29.8C59.2 19.8 64.8 11.2 74.5 9C75.5 18.8 70.6 26.5 61.5 29.8H60.2Z"
      fill="#468A1A"
    />
    <path
      d="M60.8 28.5C64 22.8 67.8 17.8 71.5 13.8"
      stroke="#EDF5DC"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 3. Historical Analysis Logo — faithful transparent SVG matching the user's
 * uploaded Historical Analysis emblem (orbital satellite with signal arcs,
 * 3 ascending dark forest bars, and green terraced fields on a sage circle).
 */
export const HistoricalAnalysisLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="40" cy="42" r="35" fill="#EDF5DC" />

    {/* Orbital satellite (top-left, angled 45deg) */}
    <g transform="translate(24 22) rotate(-42)">
      <rect x="-15" y="-5" width="9" height="10" rx="1.5" fill="#143B16" />
      <rect x="-13" y="-3" width="5" height="6" rx="0.5" fill="#EDF5DC" />
      <rect x="6" y="-5" width="9" height="10" rx="1.5" fill="#143B16" />
      <rect x="8" y="-3" width="5" height="6" rx="0.5" fill="#EDF5DC" />
      <rect x="-5" y="-6.5" width="10" height="13" rx="2.5" fill="#143B16" />
      <path d="M-2 7L0 10L2 7" stroke="#143B16" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Satellite signal waves */}
    <path
      d="M27 33.5C30 34.5 33.2 33 34.8 30.2"
      stroke="#143B16"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M28.5 38.5C33.5 39.8 38.2 37.5 40.5 32.8"
      stroke="#143B16"
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* 3 ascending forest-green bar chart columns */}
    <rect x="37" y="42" width="7.5" height="12" rx="1.8" fill="#164417" />
    <rect x="47.5" y="34.5" width="7.5" height="19.5" rx="1.8" fill="#164417" />
    <rect x="58" y="25" width="7.5" height="29" rx="1.8" fill="#164417" />

    {/* Striped green terraced hills at bottom */}
    <clipPath id="ha-circle-clip">
      <circle cx="40" cy="42" r="34.5" />
    </clipPath>
    <g clipPath="url(#ha-circle-clip)">
      <path d="M3 57.5C22 52 47 52 77 58.5V64C48 58 24 59 5 65L3 57.5Z" fill="#52981D" />
      <path d="M6 67.5C25 60.5 48 59.5 76 66.5V72C50 66 28 67.5 12 75L6 67.5Z" fill="#44881A" />
      <path d="M18 77C36 69.5 55 69.5 74 77H18Z" fill="#2A6518" />
    </g>
  </svg>
);

/**
 * 4. Analysis Configuration Logo — faithful transparent SVG matching the user's
 * uploaded Analysis Configuration emblem (gear cog containing 3 mini chart bars,
 * green leaf on top-right, and 3 horizontal slider tracks).
 */
export const AnalysisConfigLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="40" cy="40" r="36" fill="#EDF5DC" />

    {/* Sprouting leaf at top-right of gear */}
    <path
      d="M42.5 29.5C41.8 20.5 48.2 13 58 11.2C58.8 20.2 53.6 27.6 44.2 30.2L42.5 29.5Z"
      fill="#559B1E"
    />
    <path
      d="M44 28.5C47.2 23.6 50.8 19.4 55 15.8"
      stroke="#EDF5DC"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Dark forest gear cogwheel on the left */}
    <g transform="translate(29 44)">
      <path
        d="M-4 -20H4L5.5 -14.8C6.9 -14.4 8.2 -13.8 9.4 -13.1L14.2 -15.8L19.8 -10.2L17.1 -5.4C17.8 -4.2 18.4 -2.9 18.8 -1.5L24 0V8L18.8 9.5C18.4 10.9 17.8 12.2 17.1 13.4L19.8 18.2L14.2 23.8L9.4 21.1C8.2 21.8 6.9 22.4 5.5 22.8L4 28H-4L-5.5 22.8C-6.9 22.4 -8.2 21.8 -9.4 21.1L-14.2 23.8L-19.8 18.2L-17.1 13.4C-17.8 12.2 -18.4 10.9 -18.8 9.5L-24 8V0L-18.8 -1.5C-18.4 -2.9 -17.8 -4.2 -17.1 -5.4L-19.8 -10.2L-14.2 -15.8L-9.4 -13.1C-8.2 -13.8 -6.9 -14.4 -5.5 -14.8L-4 -20Z"
        transform="translate(0 -4) scale(0.84)"
        fill="#164417"
      />
      <circle cx="0" cy="0" r="10.5" fill="#EDF5DC" />
      {/* 3 mini ascending chart bars inside gear */}
      <rect x="-6.2" y="1" width="3.1" height="5.2" rx="0.9" fill="#164417" />
      <rect x="-1.5" y="-2.2" width="3.1" height="8.4" rx="0.9" fill="#164417" />
      <rect x="3.2" y="-5.6" width="3.1" height="11.8" rx="0.9" fill="#164417" />
    </g>

    {/* 3 horizontal configuration slider tracks */}
    <path d="M51 35H71" stroke="#143B16" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="64" cy="35" r="3.4" fill="#EDF5DC" stroke="#143B16" strokeWidth="2.6" />

    <path d="M51 45H71" stroke="#143B16" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="57" cy="45" r="3.4" fill="#EDF5DC" stroke="#143B16" strokeWidth="2.6" />

    <path d="M51 55H71" stroke="#143B16" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="64" cy="55" r="3.4" fill="#EDF5DC" stroke="#143B16" strokeWidth="2.6" />
  </svg>
);

/**
 * 5. Satellite Imagery Viewer Logo — faithful transparent SVG matching the
 * user's uploaded Satellite Imagery Viewer emblem (green-paneled orbital
 * satellite beaming down onto a patchwork farmland viewport with viewfinder
 * brackets, twin bottom-left leaves, and 3 stacked isometric map layers).
 */
export const SatelliteViewerLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="44" cy="46" r="35" fill="#EAF3D6" />

    {/* Tilted satellite viewport screen */}
    <g transform="translate(46 50) rotate(-6)">
      <rect
        x="-26"
        y="-17"
        width="50"
        height="34"
        rx="6"
        fill="#FAF8F5"
        stroke="#143B16"
        strokeWidth="2.8"
      />
      {/* Patchwork green farmland map inside screen */}
      <clipPath id="sv-map-clip">
        <rect x="-22.5" y="-13.5" width="43" height="27" rx="3.2" />
      </clipPath>
      <g clipPath="url(#sv-map-clip)">
        <rect x="-23" y="-14" width="44" height="28" fill="#3D7C1A" />
        {/* Patchwork agricultural plots */}
        <path d="M-23 -14L-4 -14L-11 2L-23 2Z" fill="#5CA121" />
        <path d="M-4 -14L12 -14L5 0L-10 0Z" fill="#2B6117" />
        <path d="M12 -14L22 -14L22 -1L6 -1Z" fill="#8DBE2C" />
        <path d="M-23 2L-7 2L-13 15L-23 15Z" fill="#2A5E17" />
        <path d="M-7 2L8 2L2 15L-13 15Z" fill="#6AA924" />
        <path d="M8 2L22 2L22 15L2 15Z" fill="#B6CE43" />
        {/* Plot parcel divider lines */}
        <path
          d="M-23 1H22M-7 -14L-15 15M8 -14L1 15M-18 -6H18M-15 8H19"
          stroke="#EAF3D6"
          strokeWidth="1"
          strokeOpacity="0.85"
        />
      </g>
      {/* White viewfinder corner brackets */}
      <path d="M-19 -6V-10H-15" stroke="#FAF8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 -10H17V-6" stroke="#FAF8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-19 6V10H-15" stroke="#FAF8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Angled orbital satellite (top-left) */}
    <g transform="translate(31 20) rotate(-36)">
      {/* Left solar wing */}
      <rect x="-22" y="-6.5" width="14" height="13" rx="2" fill="#63A523" stroke="#143B16" strokeWidth="2.2" />
      <path d="M-15 -6.5V6.5M-22 0H-8" stroke="#143B16" strokeWidth="1.4" />
      {/* Right solar wing */}
      <rect x="8" y="-6.5" width="14" height="13" rx="2" fill="#63A523" stroke="#143B16" strokeWidth="2.2" />
      <path d="M15 -6.5V6.5M8 0H22" stroke="#143B16" strokeWidth="1.4" />
      {/* Center body cylinder */}
      <rect x="-6.5" y="-8.5" width="13" height="17" rx="4" fill="#46891B" stroke="#143B16" strokeWidth="2.4" />
      <ellipse cx="0" cy="8.5" rx="4.5" ry="2.2" fill="#143B16" />
    </g>

    {/* Signal arcs beaming down to map */}
    <path
      d="M36 33.5C40.5 34.8 44.5 32.5 46 28.2"
      stroke="#143B16"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M36.5 39.2C43.2 40.8 49.5 37.2 51.8 30.8"
      stroke="#143B16"
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* Bottom-left green sprout leaves */}
    <path
      d="M17.5 64C12.5 60.5 10.5 55.5 11.2 49.5C16.2 51 19 55.2 18.8 61.5L17.5 64Z"
      fill="#4D921C"
    />
    <path
      d="M18 65.5C13 66.8 9.2 65.5 6.8 62.5C10.8 60.8 14.8 61.5 18 65.5Z"
      fill="#387719"
    />
    <path
      d="M19.5 66.5C20.2 60.5 22.8 56.8 26.8 54.8C26.5 60.5 24 64.5 19.5 66.5Z"
      fill="#5CA121"
    />
    <path d="M18.5 63.5L21 72" stroke="#143B16" strokeWidth="2" strokeLinecap="round" />

    {/* Bottom-right 3 stacked isometric map layers */}
    <g transform="translate(65 65)">
      {/* Bottom layer */}
      <path
        d="M0 13L-14 5.5L0 -2L14 5.5L0 13Z"
        fill="#4D8F1C"
        stroke="#143B16"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Middle layer */}
      <path
        d="M0 6.5L-14 -1L0 -8.5L14 -1L0 6.5Z"
        fill="#82B743"
        stroke="#143B16"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Top layer */}
      <path
        d="M0 0L-14 -7.5L0 -15L14 -7.5L0 0Z"
        fill="#E5EED0"
        stroke="#143B16"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/**
 * 6. Five-Year Visualization Workspace Logo — faithful transparent SVG
 * matching the user's uploaded Five-Year Visualization Workspace emblem
 * (dashboard window with 5 Years badge, 5 ascending green bars, line chart
 * with circular nodes, left sprout, and striped green terraced hills).
 */
export const FiveYearWorkspaceLogo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Soft sage circular backdrop */}
    <circle cx="44" cy="44" r="36" fill="#EAF3D6" />

    {/* Dashboard window frame */}
    <rect
      x="14"
      y="16"
      width="62"
      height="48"
      rx="8"
      fill="#FAF8F5"
      stroke="#143B16"
      strokeWidth="2.8"
    />
    {/* Window top bar */}
    <path d="M14 28H76" stroke="#143B16" strokeWidth="2" />
    {/* Three top-right window dots */}
    <circle cx="61" cy="22" r="2" fill="#143B16" />
    <circle cx="66.5" cy="22" r="2" fill="#143B16" />
    <circle cx="72" cy="22" r="2" fill="#143B16" />

    {/* "5 Years" calendar pill badge */}
    <rect
      x="18.5"
      y="18.5"
      width="30"
      height="13.5"
      rx="6.75"
      fill="#FAF8F5"
      stroke="#366E1B"
      strokeWidth="1.9"
    />
    {/* Tiny calendar icon */}
    <rect x="22" y="22.4" width="6.2" height="5.8" rx="1.2" stroke="#143B16" strokeWidth="1.4" />
    <path d="M23.5 21.3V22.8M26.6 21.3V22.8M22 24.5H28.2" stroke="#143B16" strokeWidth="1.2" strokeLinecap="round" />
    <text
      x="30.2"
      y="27.5"
      fill="#143B16"
      fontSize="6.4"
      fontWeight="700"
      fontFamily="Manrope, Inter, sans-serif"
    >
      5 Yr
    </text>

    {/* 5 ascending green bar columns */}
    <rect x="22" y="50" width="7.2" height="9" rx="1.6" fill="#69AB25" />
    <rect x="32.5" y="46" width="7.2" height="13" rx="1.6" fill="#5CA121" />
    <rect x="43" y="42" width="7.2" height="17" rx="1.6" fill="#52981D" />
    <rect x="53.5" y="37" width="7.2" height="22" rx="1.6" fill="#468A1A" />
    <rect x="64" y="31.5" width="7.2" height="27.5" rx="1.6" fill="#63A824" />

    {/* Trend line + 3 hollow nodes */}
    <path
      d="M25.5 46L36.5 39.5L47 41.2L57.5 34.5L67.5 28.5"
      stroke="#143B16"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="36.5" cy="39.5" r="2.6" fill="#FAF8F5" stroke="#143B16" strokeWidth="2" />
    <circle cx="57.5" cy="34.5" r="2.6" fill="#FAF8F5" stroke="#143B16" strokeWidth="2" />
    <circle cx="67.5" cy="28.5" r="2.6" fill="#FAF8F5" stroke="#143B16" strokeWidth="2" />

    {/* Foreground sweeping striped terraced hills (clipped to circle) */}
    <clipPath id="fy-circle-clip">
      <circle cx="44" cy="44" r="35.5" />
    </clipPath>
    <g clipPath="url(#fy-circle-clip)">
      <path d="M4 60C22 52 46 53 68 72L4 76V60Z" fill="#3C7D19" />
      <path d="M10 66C24 58 43 58 60 73L52 76C38 64 23 63 10 70V66Z" fill="#99C23C" />
      <path d="M18 75C31 65 44 65 56 76H18Z" fill="#2A6217" />
      <path d="M51 60C62 56 73 56 84 60V76H58C55 70 53 64 51 60Z" fill="#357218" />
      <path d="M55 65C64 60.5 74 60.5 83 64V68C74 64.5 65 64.5 57 68.5L55 65Z" fill="#A4CA43" />
    </g>

    {/* Left twin-leaf sprout rising out of the hills */}
    <path
      d="M15.5 55.5C10.2 52.5 8 47.8 8.6 42C13.8 43.4 16.5 47.4 16.5 53.5L15.5 55.5Z"
      fill="#4D921C"
    />
    <path
      d="M17.2 56.2C16.8 46.8 21.8 39.2 30.2 37.5C30.8 46.2 26.2 53.2 18.2 56.5L17.2 56.2Z"
      fill="#5CA121"
    />
    <path
      d="M17.8 55.2C20.5 50 23.8 45.8 27.5 42.2"
      stroke="#EAF3D6"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M16.6 54.5V64" stroke="#143B16" strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);

