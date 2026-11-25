import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Languages,
  Leaf,
  Satellite,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { EASE_EDITORIAL } from '../components/MotionPrimitives';
import { SimpleTree } from '@/components/ui/simple-growth-tree';
import {
  BOTANICAL_LEAF_IMAGE,
  HOME_HERO_IMAGE,
  HOME_HERO_SKY_LAYER,
  TERRACED_FIELD_IMAGE,
} from '../data/cropData';
import { useLanguage } from '../hooks/useLanguage';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const scrollToAbout = () => {
    const target = document.getElementById('about-us');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pillars = [
    {
      icon: Leaf,
      title: t.home.about.pillar1Title,
      desc: t.home.about.pillar1Desc,
    },
    {
      icon: Languages,
      title: t.home.about.pillar2Title,
      desc: t.home.about.pillar2Desc,
    },
    {
      icon: Satellite,
      title: t.home.about.pillar3Title,
      desc: t.home.about.pillar3Desc,
    },
  ];

  return (
    <main className="w-full bg-brand-cream">
      {/* 1. Full-Viewport Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-brand-cream">
        {/* Full-viewport static landscape image background */}
        <div
          className="absolute inset-0 overflow-hidden bg-brand-cream [container-type:size]"
          aria-hidden="true"
        >
          <div className="absolute bottom-0 left-[26%] -translate-x-[26%] sm:left-1/2 sm:-translate-x-1/2 w-[max(100cqw,calc(100cqh*1839/855))] h-[max(100cqh,calc(100cqw*855/1839))]">
            <img
              src={HOME_HERO_IMAGE}
              alt=""
              className="w-full h-full block select-none"
            />
            <img
              src={HOME_HERO_SKY_LAYER}
              alt=""
              className="absolute bottom-0 left-0 w-full h-[109.92%] max-w-none block select-none hero-sky-mask"
            />
          </div>
        </div>

        {/* Left-aligned hero content */}
        <div className="relative z-10 flex flex-col items-start max-w-7xl mx-auto pt-28 md:pt-36 px-6 lg:px-8">
          {/* Announcement pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE_EDITORIAL }}
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-dark/15 bg-white/65 backdrop-blur-sm hover:bg-white/85 transition-colors mb-6 md:mb-7 shadow-[0_2px_10px_rgba(45,58,46,0.06)]"
            >
              <span className="text-sm font-medium text-brand-dark">{t.home.announcement}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-dark shrink-0" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Main Manrope Bold editorial headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE_EDITORIAL }}
            className="text-left font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-brand-dark leading-[1.12] tracking-tight max-w-5xl"
          >
            {t.home.headlineLine1}
            <br className="hidden sm:block" /> {t.home.headlineLine2}
          </motion.h1>

          {/* Action Buttons right below headline: Try Us & About Us */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: EASE_EDITORIAL }}
            className="mt-7 md:mt-8 flex flex-wrap items-center gap-3.5"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-dark text-brand-cream text-sm font-medium tracking-wide hover:bg-brand-green transition-colors shadow-[0_8px_22px_rgba(45,58,46,0.18)] whitespace-nowrap"
              >
                <span>{t.home.tryUsButton}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={scrollToAbout}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-brand-dark/20 bg-brand-cream/85 backdrop-blur-sm text-brand-dark text-sm font-medium tracking-wide hover:bg-brand-cream hover:border-brand-dark/35 transition-colors shadow-[0_4px_16px_rgba(45,58,46,0.08)] whitespace-nowrap cursor-pointer"
              >
                <span>{t.home.aboutUsButton}</span>
                <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Us Section */}
      <section
        id="about-us"
        aria-labelledby="about-us-heading"
        className="relative w-full bg-brand-cream border-t border-brand-border/80 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28 space-y-16">
          {/* Asymmetric Editorial Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-brand-green">
                {t.home.about.kicker}
              </p>

              <h2
                id="about-us-heading"
                className="font-manrope text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-dark leading-[1.12] tracking-tight"
              >
                {t.home.about.heading}
              </h2>

              <div className="space-y-4 text-base text-brand-dark/80 leading-relaxed max-w-2xl">
                <p>{t.home.about.paragraph1}</p>
                <p>{t.home.about.paragraph2}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-dark text-brand-cream text-sm font-medium hover:bg-brand-green transition-colors shadow-xs"
                  >
                    <span>{t.home.about.startCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/chatbot"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-light/70 text-brand-dark text-sm font-medium hover:bg-brand-light-green/70 transition-colors"
                  >
                    <span>{t.home.about.chatbotCta}</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Editorial Field & Leaf Visual Composition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE_EDITORIAL }}
              className="lg:col-span-5"
            >
              <div className="grid grid-cols-12 gap-3.5">
                <div className="col-span-12 rounded-[16px] overflow-hidden border border-brand-border/90 bg-brand-light shadow-[0_12px_32px_rgba(45,58,46,0.08)] aspect-[16/10]">
                  <img
                    src={TERRACED_FIELD_IMAGE}
                    alt="Green terraced Indian farmland fields"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="col-span-7 rounded-[14px] border border-brand-border/90 bg-[#EEF3E4]/85 p-5 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-brand-green">
                    4 Languages
                  </span>
                  <p className="mt-2 font-manrope text-lg font-bold text-brand-dark leading-snug">
                    English · हिन्दी · मराठी · ಕನ್ನಡ
                  </p>
                </div>
                <div className="col-span-5 rounded-[14px] overflow-hidden border border-brand-border/90 bg-brand-light aspect-[4/3]">
                  <img
                    src={BOTANICAL_LEAF_IMAGE}
                    alt="Close-up healthy green crop leaf"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3 Core Pillars Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-brand-border/75">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_EDITORIAL }}
                  className="rounded-[14px] border border-brand-border/85 bg-brand-light/55 p-6 space-y-3 hover:border-brand-green/45 hover:bg-brand-cream transition-colors"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-[#E7EBDD] border border-brand-border/70 flex items-center justify-center text-brand-dark">
                    <Icon className="w-5 h-5 stroke-[1.7]" aria-hidden="true" />
                  </div>
                  <h3 className="font-manrope text-lg font-bold text-brand-dark">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-brand-dark/75 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Living Growth Tree Footer */}
        <footer
          data-testid="home-tree-footer"
          className="relative border-t border-brand-border/80 bg-[#FAF8F5] overflow-hidden"
        >
          <SimpleTree
            className="h-[370px] sm:h-[420px] lg:h-[460px]"
            showDefaultOverlay={false}
            backgroundColor="#FAF8F5"
            baseHueRange={[74, 108]}
            growthSpeed={2}
            hintText="Click to grow a new tree"
          >
            {/* Subtle top & bottom gradient scrims for crisp readability without hiding the tree */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/45 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF8F5]/92 via-[#FAF8F5]/55 to-transparent"
              aria-hidden="true"
            />

            {/* Footer Content Overlay (pointer-events-none so clicking open space regrows the tree) */}
            <div className="pointer-events-none relative z-10 max-w-7xl mx-auto h-full px-5 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-between">
              {/* Top Row: Brand & Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
                <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                  <BrandLogo />
                  <span className="text-xs text-brand-muted">{t.home.about.footerTagline}</span>
                </div>

                <nav
                  aria-label="Footer navigation"
                  className="pointer-events-auto flex flex-wrap items-center justify-center sm:justify-end gap-x-5 gap-y-2 text-xs font-medium text-brand-dark/85 bg-[#FAF8F5]/70 backdrop-blur-[2px] px-3.5 py-1.5 rounded-full border border-brand-border/60"
                >
                  <Link to="/dashboard" className="hover:text-brand-green transition-colors">
                    {t.nav.dashboard}
                  </Link>
                  <Link to="/chatbot" className="hover:text-brand-green transition-colors">
                    {t.nav.chatbot}
                  </Link>
                  <Link
                    to="/historical-analysis"
                    className="hover:text-brand-green transition-colors"
                  >
                    {t.nav.historicalAnalysis}
                  </Link>
                  <Link to="/reports" className="hover:text-brand-green transition-colors">
                    {t.nav.reports}
                  </Link>
                </nav>
              </div>

              {/* Bottom Row: Subtle Editorial Caption + Click-to-Grow Hint */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-dark/60">
                <p className="text-center sm:text-left font-medium text-brand-dark/70">
                  © {new Date().getFullYear()} {t.brandName} · {t.home.about.footerTagline}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-brand-dark/55">
                  Click anywhere to grow a new tree
                </span>
              </div>
            </div>
          </SimpleTree>
        </footer>
      </section>
    </main>
  );
};
