"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ChartData {
  date: string;
  rate: number;
}

interface ExchangeRateChartProps {
  data: ChartData[];
  currency: string;
  baseCurrency: string;
}

export default function ExchangeRateChart({ data, currency, baseCurrency }: ExchangeRateChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No historical data available</p>
      </div>
    );
  }

  const maxRate = Math.max(...data.map(d => d.rate));
  const minRate = Math.min(...data.map(d => d.rate));
  const range = maxRate - minRate || 1;
  
  const firstRate = data[0]?.rate || 0;
  const lastRate = data[data.length - 1]?.rate || 0;
  const change = lastRate - firstRate;
  const changePercent = firstRate > 0 ? (change / firstRate) * 100 : 0;

  // Generate SVG path
  const width = 800;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxRate - point.rate) / range) * chartHeight;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {baseCurrency} to {currency} - 7 Day Trend
          </h3>
          <div className="flex items-center gap-2">
            {change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : change < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : (
              <Minus className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-sm font-medium ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="relative">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i / 4) * chartHeight;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}

            {/* Chart area */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={`${pathData} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Data points */}
            {data.map((point, index) => {
              const x = padding + (index / (data.length - 1)) * chartWidth;
              const y = padding + ((maxRate - point.rate) / range) * chartHeight;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#000000"
                  className="hover:r-4 transition-all"
                />
              );
            })}
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
            <span>{maxRate.toFixed(4)}</span>
            <span>{((maxRate + minRate) / 2).toFixed(4)}</span>
            <span>{minRate.toFixed(4)}</span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6 px-8">
            {data.map((point, index) => {
              if (index % Math.ceil(data.length / 5) === 0) {
                return (
                  <span key={index}>
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Current rate */}
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-500">Current Rate</div>
            <div className="text-lg font-semibold">
              1 {baseCurrency} = {lastRate.toFixed(4)} {currency}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">7-Day Range</div>
            <div className="font-medium">
              {minRate.toFixed(4)} - {maxRate.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
