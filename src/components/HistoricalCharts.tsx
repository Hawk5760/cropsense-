import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import {
  ILLUSTRATIVE_FIVE_YEAR_PREVIEW,
  SEASONAL_COMPARISON_PREVIEW,
} from '../data/cropData';
import type { SeasonType } from '../types/cropsense';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';
import { FiveYearWorkspaceLogo } from './SectionLogos';

interface HistoricalChartsProps {
  season: SeasonType;
}

export const HistoricalCharts: React.FC<HistoricalChartsProps> = ({ season }) => {
  const { t } = useLanguage();
  const yearlyData = ILLUSTRATIVE_FIVE_YEAR_PREVIEW[season] ?? ILLUSTRATIVE_FIVE_YEAR_PREVIEW.Kharif;
  const cl = t.historical.chartLabels;
  const ct = t.historical.chartTitles;

  const tooltipStyle = {
    backgroundColor: '#FAF8F5',
    border: '1px solid #DAD5CB',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#2D3A2E',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, ease: EASE_EDITORIAL }}
      aria-labelledby="historical-charts-heading"
      className="space-y-5"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <FiveYearWorkspaceLogo className="w-12 h-12 shrink-0" />
          <h2
            id="historical-charts-heading"
            className="font-playfair text-2xl font-semibold text-brand-dark leading-tight"
          >
            {t.historical.chartsSectionTitle}
          </h2>
        </div>
        <div
          role="note"
          className="flex items-start gap-2 rounded-[10px] border border-brand-border/90 bg-brand-light/90 px-4 py-3 text-xs text-brand-muted leading-relaxed"
        >
          <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
          <span>{t.historical.chartsPreviewNotice}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Vegetation Health Trends */}
        <div className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(45,58,46,0.08)]">
          <h3 className="text-sm font-medium text-brand-dark mb-4">{ct.vegetationHealth}</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DAD5CB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#77786F' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: '#77786F' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="ndvi"
                  name={cl.ndvi}
                  stroke="#3D5A3E"
                  fill="#E7EBDD"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Seasonal Vegetation Index */}
        <div className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(45,58,46,0.08)]">
          <h3 className="text-sm font-medium text-brand-dark mb-4">{ct.seasonalIndex}</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={SEASONAL_COMPARISON_PREVIEW}
                margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#DAD5CB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#77786F' }} />
                <YAxis domain={[0.2, 0.9]} tick={{ fontSize: 12, fill: '#77786F' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="ndvi2024"
                  name="2024"
                  stroke="#77786F"
                  strokeWidth={1.8}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ndvi2025"
                  name="2025"
                  stroke="#D59A36"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ndvi2026"
                  name="2026"
                  stroke="#3D5A3E"
                  strokeWidth={2.2}
                  dot={{ r: 3.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Environmental Parameter Trends */}
        <div className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(45,58,46,0.08)]">
          <h3 className="text-sm font-medium text-brand-dark mb-4">{ct.environmentalTrends}</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearlyData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DAD5CB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#77786F' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#77786F' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#77786F' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="rainfallMm"
                  name={cl.rainfallMm}
                  fill="#4F8051"
                  radius={[3, 3, 0, 0]}
                  barSize={26}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgTempC"
                  name={cl.avgTemp}
                  stroke="#D59A36"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Crop Health Comparisons */}
        <div className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(45,58,46,0.08)]">
          <h3 className="text-sm font-medium text-brand-dark mb-4">{ct.cropHealthComparison}</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DAD5CB" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#77786F' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#77786F' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="cropHealthScore"
                  name={cl.healthScore}
                  fill="#2D3A2E"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="cropCoveragePct"
                  name={cl.cropCoverage}
                  fill="#8CA38A"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Historical Changes Over Five Years (Full Width) */}
      <div className="rounded-[14px] border border-brand-border/90 bg-brand-cream/95 p-5 shadow-[0_6px_22px_rgba(45,58,46,0.05)] transition-shadow hover:shadow-[0_10px_28px_rgba(45,58,46,0.08)]">
        <h3 className="text-sm font-medium text-brand-dark mb-4">{ct.fiveYearChange}</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DAD5CB" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#77786F' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#77786F' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="cropHealthScore"
                name={cl.healthScore}
                stroke="#2D3A2E"
                strokeWidth={2.2}
              />
              <Line
                type="monotone"
                dataKey="soilMoisturePct"
                name={cl.soilMoisture}
                stroke="#4F8051"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="cropCoveragePct"
                name={cl.cropCoverage}
                stroke="#D59A36"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
};
