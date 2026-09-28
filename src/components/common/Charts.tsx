import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { CurrencyCode } from '../../types';

interface RevenueDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface RevenueAreaChartProps {
  data: RevenueDataPoint[];
  currency?: CurrencyCode;
  height?: number;
}

export const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({
  data,
  currency = 'UZS',
  height = 200,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const paddingX = 40;
  const paddingY = 30;

  const maxValue = Math.max(...data.map((d) => d.value), 100000);
  const minValue = 0;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.value - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth SVG curve
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="relative w-full overflow-hidden">
      {hoveredIdx !== null && (
        <div
          className="absolute z-10 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 font-mono tabular-nums"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100}%`,
          }}
        >
          <div className="font-sans font-medium text-neutral-300">{data[hoveredIdx].label}</div>
          <div className="font-bold text-indigo-300">
            {formatCurrency(data[hoveredIdx].value, currency)}
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = height - paddingY - ratio * (height - paddingY * 2);
          const val = minValue + ratio * (maxValue - minValue);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-neutral-400 dark:fill-neutral-500 text-[10px] font-mono tabular-nums"
              >
                {Math.round(val / 1000)}k
              </text>
            </g>
          );
        })}

        {/* Fill Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive nodes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 6 : 3.5}
              className={`transition-all duration-150 ${
                hoveredIdx === i
                  ? 'fill-indigo-500 stroke-white dark:stroke-neutral-900 stroke-2'
                  : 'fill-indigo-600'
              }`}
            />
            {/* Hit area */}
            <circle
              cx={p.x}
              cy={p.y}
              r={18}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className={`text-[11px] font-sans transition-colors ${
                hoveredIdx === i
                  ? 'fill-indigo-600 dark:fill-indigo-400 font-semibold'
                  : 'fill-neutral-500 dark:fill-neutral-400'
              }`}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

interface BarDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

export const AppointmentsBarChart: React.FC<{
  data: BarDataPoint[];
  height?: number;
}> = ({ data, height = 180 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 500;
  const paddingX = 30;
  const paddingBottom = 28;
  const paddingTop = 20;

  const maxVal = Math.max(...data.map((d) => d.value), 5);
  const barWidth = 32;
  const gap = (width - paddingX * 2 - data.length * barWidth) / (data.length - 1 || 1);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {data.map((d, i) => {
          const barHeight = ((d.value / maxVal) * (height - paddingBottom - paddingTop));
          const x = paddingX + i * (barWidth + gap);
          const y = height - paddingBottom - barHeight;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 4)}
                rx={6}
                className={`transition-colors duration-150 ${
                  d.highlight || isHovered
                    ? 'fill-indigo-600 dark:fill-indigo-500'
                    : 'fill-neutral-200 dark:fill-neutral-800 hover:fill-neutral-300 dark:hover:fill-neutral-700'
                }`}
              />

              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className={`text-[11px] font-mono tabular-nums ${
                  isHovered ? 'fill-indigo-600 dark:fill-indigo-400 font-bold' : 'fill-neutral-400'
                }`}
              >
                {d.value}
              </text>

              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className={`text-[11px] font-sans ${
                  isHovered ? 'fill-neutral-900 dark:fill-white font-semibold' : 'fill-neutral-500 dark:fill-neutral-400'
                }`}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export const ServiceBreakdownDonut: React.FC<{
  slices: DonutSlice[];
  currency?: CurrencyCode;
}> = ({ slices, currency = 'UZS' }) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;

  let currentAngle = 0;
  const radius = 58;
  const strokeWidth = 18;
  const center = 75;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 150 150" className="w-full h-full transform -rotate-90">
          {slices.map((slice, i) => {
            const fraction = slice.value / total;
            const strokeDasharray = `${fraction * 2 * Math.PI * radius} ${2 * Math.PI * radius}`;
            const strokeDashoffset = -currentAngle * 2 * Math.PI * radius;
            currentAngle += fraction;

            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Total</span>
          <span className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
            {slices.length} Svcs
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {slices.map((s, idx) => {
          const percent = Math.round((s.value / total) * 100);
          return (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">{s.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <span className="text-neutral-500">{percent}%</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {formatCurrency(s.value, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
