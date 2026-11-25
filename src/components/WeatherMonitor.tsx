import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  RefreshCw,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useFarmDetails } from '../hooks/useFarmDetails';
import { useLanguage } from '../hooks/useLanguage';
import { EASE_EDITORIAL } from './MotionPrimitives';

function renderWeatherIcon(conditionType?: string, className = 'w-5 h-5') {
  const normalized = (conditionType || '').toUpperCase();
  if (normalized.includes('THUNDER') || normalized.includes('STORM')) {
    return <CloudLightning className={`${className} text-amber-700`} aria-hidden="true" />;
  }
  if (normalized.includes('RAIN') || normalized.includes('SHOWER') || normalized.includes('DRIZZLE')) {
    return <CloudRain className={`${className} text-sky-700`} aria-hidden="true" />;
  }
  if (normalized.includes('FOG') || normalized.includes('MIST') || normalized.includes('HAZE')) {
    return <CloudFog className={`${className} text-slate-600`} aria-hidden="true" />;
  }
  if (normalized.includes('PARTLY') || normalized.includes('MOSTLY_CLEAR')) {
    return <CloudSun className={`${className} text-amber-600`} aria-hidden="true" />;
  }
  if (normalized.includes('CLOUD') || normalized.includes('OVERCAST')) {
    return <Cloud className={`${className} text-slate-600`} aria-hidden="true" />;
  }
  return <Sun className={`${className} text-amber-500`} aria-hidden="true" />;
}

export const WeatherMonitor: React.FC = () => {
  const { weatherData, weatherLoading, weatherError, refreshWeather } = useFarmDetails();
  const { dt } = useLanguage();

  const [viewMode, setViewMode] = useState<'history30' | 'forecast7'>('history30');
  const [chartMetric, setChartMetric] = useState<'temp' | 'rain'>('temp');

  const stats30Day = useMemo(() => {
    const rows = weatherData?.history30d ?? [];
    if (!rows.length) return { avgTemp: null as number | null, totalRain: 0 };
    const avgTemp = rows.reduce((sum, item) => sum + item.tempAvgC, 0) / rows.length;
    const totalRain = rows.reduce((sum, item) => sum + item.rainfallMm, 0);
    return {
      avgTemp: Number(avgTemp.toFixed(1)),
      totalRain: Number(totalRain.toFixed(1)),
    };
  }, [weatherData]);

  const current = weatherData?.current;

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE_EDITORIAL }}
      aria-labelledby="weather-monitoring-heading"
      data-testid="weather-monitor-panel"
      className="bg-brand-cream border border-brand-border rounded-[14px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,58,46,0.05)] space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[9px] bg-[#E7EBDD] border border-[#C6D4B5] flex items-center justify-center shrink-0">
              {renderWeatherIcon(current?.conditionType, 'w-4.5 h-4.5')}
            </span>
            <h2
              id="weather-monitoring-heading"
              className="font-manrope text-[17px] font-bold text-brand-dark tracking-tight leading-tight"
            >
              {dt.weather.title}
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-brand-muted leading-snug">
            {weatherData?.locationLabel || dt.weather.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refreshWeather()}
          disabled={weatherLoading}
          aria-label={dt.weather.refreshButton}
          title={dt.weather.refreshButton}
          className="w-8 h-8 rounded-full border border-brand-border bg-brand-light/80 flex items-center justify-center text-brand-dark hover:bg-[#E7EBDD] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${weatherLoading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Loading State */}
      {weatherLoading && !weatherData && (
        <div className="rounded-[10px] border border-brand-border/80 bg-brand-light/70 p-4 flex items-center gap-2.5 text-xs text-brand-muted">
          <Loader2 className="w-4 h-4 animate-spin text-brand-green shrink-0" aria-hidden="true" />
          <span>{dt.weather.loading}</span>
        </div>
      )}

      {/* Error State */}
      {weatherError && !weatherData && (
        <div
          role="alert"
          className="rounded-[10px] border border-brand-danger/30 bg-brand-danger/5 p-3.5 space-y-2"
        >
          <div className="flex items-start gap-2 text-xs text-brand-danger">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{dt.weather.error}</span>
          </div>
          <button
            type="button"
            onClick={() => void refreshWeather()}
            className="text-xs font-semibold text-brand-dark underline underline-offset-2 cursor-pointer"
          >
            {dt.weather.refreshButton}
          </button>
        </div>
      )}

      {/* Active Weather Data */}
      {weatherData && current && (
        <>
          {/* Current Weather Hero Strip */}
          <div className="rounded-[10px] border border-[#C6D4B5] bg-gradient-to-br from-[#EEF3E6] to-white p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-[10px] bg-white border border-brand-border/75 flex items-center justify-center shrink-0 shadow-2xs">
                {renderWeatherIcon(current.conditionType, 'w-6 h-6')}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-testid="weather-current-temp"
                    className="font-manrope text-2xl font-bold text-brand-dark tabular-nums leading-none"
                  >
                    {Math.round(current.temperatureC)}°C
                  </span>
                  <span className="text-[11px] text-brand-muted tabular-nums">
                    {dt.weather.feelsLike} {Math.round(current.feelsLikeC)}°
                  </span>
                </div>
                <p className="text-xs font-medium text-brand-green truncate mt-0.5">
                  {current.conditionText}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-brand-border px-2 py-0.5 text-[11px] font-medium text-brand-dark tabular-nums">
                <Umbrella className="w-3 h-3 text-sky-700" aria-hidden="true" />
                {current.rainProbabilityPct}%
              </span>
              <p className="text-[10px] text-brand-muted mt-0.5">{dt.weather.rainChance}</p>
            </div>
          </div>

          {/* 4 Compact Metric Cards: Temperature, Humidity, Rainfall, Wind Speed */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[9px] border border-brand-border/80 bg-white/85 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <Thermometer className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                <span>{dt.weather.temperature}</span>
              </div>
              <p className="mt-1 font-manrope text-sm font-bold text-brand-dark tabular-nums">
                {current.temperatureC.toFixed(1)}°C
              </p>
            </div>

            <div className="rounded-[9px] border border-brand-border/80 bg-white/85 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <Droplets className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                <span>{dt.weather.humidity}</span>
              </div>
              <p className="mt-1 font-manrope text-sm font-bold text-brand-dark tabular-nums">
                {current.humidityPct}%
              </p>
            </div>

            <div className="rounded-[9px] border border-brand-border/80 bg-white/85 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <CloudRain className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                <span>{dt.weather.rainfall}</span>
              </div>
              <p className="mt-1 font-manrope text-sm font-bold text-brand-dark tabular-nums">
                {current.rainfallMm} mm
              </p>
            </div>

            <div className="rounded-[9px] border border-brand-border/80 bg-white/85 px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
                <Wind className="w-3.5 h-3.5 text-brand-green" aria-hidden="true" />
                <span>{dt.weather.windSpeed}</span>
              </div>
              <p className="mt-1 font-manrope text-sm font-bold text-brand-dark tabular-nums">
                {Math.round(current.windKmh)} km/h
              </p>
            </div>
          </div>

          {/* Toggle between Past 30 Days Time-Series Chart and Upcoming 7-Day Forecast */}
          <div className="space-y-2.5">
            <div
              role="tablist"
              aria-label="Weather timeline view"
              className="grid grid-cols-2 gap-1 rounded-[9px] bg-[#ECE9E1] p-1 border border-brand-border/75"
            >
              <button
                type="button"
                role="tab"
                data-testid="weather-tab-history"
                aria-selected={viewMode === 'history30'}
                onClick={() => setViewMode('history30')}
                className={`py-1.5 px-2 rounded-[7px] text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'history30'
                    ? 'bg-white text-brand-dark shadow-2xs'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                {dt.weather.past30DaysTitle}
              </button>
              <button
                type="button"
                role="tab"
                data-testid="weather-tab-forecast"
                aria-selected={viewMode === 'forecast7'}
                onClick={() => setViewMode('forecast7')}
                className={`py-1.5 px-2 rounded-[7px] text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'forecast7'
                    ? 'bg-white text-brand-dark shadow-2xs'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                {dt.weather.forecast7DayTitle}
              </button>
            </div>

            {viewMode === 'history30' ? (
              <div className="rounded-[10px] border border-brand-border/80 bg-white/90 p-3 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-brand-dark">
                    {dt.weather.past30DaysTitle}
                  </span>
                  <div className="inline-flex rounded-full border border-brand-border bg-brand-light p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setChartMetric('temp')}
                      className={`px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                        chartMetric === 'temp'
                          ? 'bg-brand-dark text-white'
                          : 'text-brand-muted hover:text-brand-dark'
                      }`}
                    >
                      {dt.weather.tempToggle}
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMetric('rain')}
                      className={`px-2 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${
                        chartMetric === 'rain'
                          ? 'bg-brand-dark text-white'
                          : 'text-brand-muted hover:text-brand-dark'
                      }`}
                    >
                      {dt.weather.rainToggle}
                    </button>
                  </div>
                </div>

                {stats30Day.avgTemp !== null && (
                  <div className="flex items-center justify-between text-[11px] text-brand-muted bg-brand-light/65 rounded-[7px] px-2.5 py-1.5 tabular-nums">
                    <span>
                      {dt.weather.temperature}:{' '}
                      <strong className="text-brand-dark">{stats30Day.avgTemp}°C</strong>
                    </span>
                    <span>
                      {dt.weather.rainfall}:{' '}
                      <strong className="text-sky-800">{stats30Day.totalRain} mm</strong>
                    </span>
                  </div>
                )}

                {weatherData.history30d.length > 0 ? (
                  <div className="h-[168px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height={168} minWidth={0}>
                      <ComposedChart
                        data={weatherData.history30d}
                        margin={{ top: 6, right: 4, left: -24, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 10, fill: '#6F7368' }}
                          interval={6}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 10, fill: '#6F7368' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis yAxisId="right" orientation="right" hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #DAD5CB',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                        {chartMetric === 'temp' ? (
                          <>
                            <Bar
                              yAxisId="right"
                              dataKey="rainfallMm"
                              name="Rain (mm)"
                              fill="#5B9BD5"
                              fillOpacity={0.5}
                              radius={[3, 3, 0, 0]}
                              barSize={6}
                            />
                            <Area
                              yAxisId="left"
                              type="monotone"
                              dataKey="tempAvgC"
                              name="Avg Temp (°C)"
                              stroke="#3D5A3E"
                              strokeWidth={2}
                              fill="#E7EBDD"
                              fillOpacity={0.7}
                            />
                          </>
                        ) : (
                          <>
                            <Bar
                              yAxisId="left"
                              dataKey="rainfallMm"
                              name="Rainfall (mm)"
                              fill="#2F6F8F"
                              fillOpacity={0.75}
                              radius={[3, 3, 0, 0]}
                              barSize={8}
                            />
                            <Area
                              yAxisId="right"
                              type="monotone"
                              dataKey="humidityPct"
                              name="Humidity (%)"
                              stroke="#3D5A3E"
                              strokeWidth={1.8}
                              fill="#E7EBDD"
                              fillOpacity={0.4}
                            />
                          </>
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted py-4 text-center">
                    30-day historical weather archive is temporarily unavailable.
                  </p>
                )}
              </div>
            ) : (
              <div
                data-testid="weather-forecast-list"
                className="rounded-[10px] border border-brand-border/80 bg-white/90 p-3 space-y-2"
              >
                <p className="text-xs font-semibold text-brand-dark">
                  {dt.weather.forecast7DayTitle}
                </p>
                <div className="divide-y divide-brand-border/60">
                  {weatherData.forecast7d.map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between gap-2 py-1.5 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {renderWeatherIcon(day.conditionType, 'w-4 h-4 shrink-0')}
                        <span className="font-semibold text-brand-dark w-11 shrink-0">
                          {day.dayLabel}
                        </span>
                        <span className="text-[11px] text-brand-muted truncate">
                          {day.conditionText}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        {day.rainProbabilityPct > 0 && (
                          <span className="text-[10px] font-medium text-sky-700 bg-sky-50 border border-sky-200/70 rounded-full px-1.5 py-0.5">
                            {day.rainProbabilityPct}%
                          </span>
                        )}
                        <span className="font-semibold text-brand-dark">
                          {Math.round(day.tempMaxC)}°
                        </span>
                        <span className="text-brand-muted">{Math.round(day.tempMinC)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transparent Data Sources Footer */}
          <p className="text-[10px] text-brand-muted/90 leading-snug pt-0.5">
            {dt.weather.sourceLabel}: {weatherData.currentProvider} ·{' '}
            {weatherData.historicalProvider}
          </p>
        </>
      )}
    </motion.section>
  );
};
