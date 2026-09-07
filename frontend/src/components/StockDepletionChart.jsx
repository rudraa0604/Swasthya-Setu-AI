import React, { useState } from 'react';
import { LineChart as LineIcon, BarChart3, PieChart as PieIcon, BarChart2, ShieldAlert, Clock, Info } from 'lucide-react';

export default function StockDepletionChart({ forecast }) {
  const [chartType, setChartType] = useState('line'); // 'line', 'bar', 'histogram', 'pie'

  if (!forecast || !forecast.forecast_points || forecast.forecast_points.length === 0) {
    return <div>No forecast trajectory data available.</div>;
  }

  const points = forecast.forecast_points;
  const initialStock = forecast.current_stock;
  const bufferThreshold = forecast.buffer_threshold;
  const dailyAvg = forecast.daily_consumption_rate || 15;

  // Chart dimensions
  const width = 640;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const maxVal = Math.max(initialStock * 1.25, bufferThreshold * 1.6, ...points.map(p => p.projected_stock_level), 60);
  const minVal = 0;

  const getX = (idx) => padding.left + (idx / (points.length - 1)) * (width - padding.left - padding.right);
  const getY = (val) => padding.top + (1 - (val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

  // 1. Line Chart Path
  const linePathD = points.reduce((acc, pt, idx) => {
    const x = getX(idx);
    const y = getY(pt.projected_stock_level);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const bufferY = getY(bufferThreshold);

  // 2. Bar Chart calculation
  const barSlotWidth = (width - padding.left - padding.right) / points.length;
  const barWidth = Math.max(8, barSlotWidth * 0.7);

  // 3. Histogram Bins (Distribution of Daily Demand)
  const demandValues = points.map(p => p.predicted_demand);
  const maxDemand = Math.max(...demandValues, 40);
  const binCount = 5;
  const binStep = maxDemand / binCount;
  const histogramBins = Array.from({ length: binCount }, (_, i) => {
    const minB = i * binStep;
    const maxB = (i + 1) * binStep;
    const count = demandValues.filter(d => (i === binCount - 1 ? (d >= minB && d <= maxB) : (d >= minB && d < maxB))).length;
    return {
      label: `${Math.round(minB)}-${Math.round(maxB)}`,
      count,
      pct: Math.round((count / demandValues.length) * 100)
    };
  });
  const maxBinCount = Math.max(...histogramBins.map(b => b.count), 1);

  // 4. Pie / Donut Chart calculation (Proportions of Inventory Status)
  const projected7DayDemand = Math.round(dailyAvg * 7);
  const safetyBufferCover = Math.max(0, initialStock - projected7DayDemand);
  const deficitRisk = Math.max(0, bufferThreshold - initialStock);
  const pieData = [
    { label: 'Current Usable Stock', value: Math.max(5, initialStock), color: '#0284c7' },
    { label: 'Required Buffer Margin', value: Math.max(5, bufferThreshold), color: '#f59e0b' },
    { label: '7-Day Projected Demand', value: Math.max(5, projected7DayDemand), color: '#8b5cf6' },
    { label: 'Critical Deficit Risk', value: Math.max(0, deficitRisk), color: '#ef4444' }
  ].filter(item => item.value > 0);

  const totalPieVal = pieData.reduce((sum, item) => sum + item.value, 0);

  // Donut SVG Generator
  let cumulativeAngle = 0;
  const pieCenter = { x: 180, y: 120, r: 85, innerR: 45 };

  const donutSlices = pieData.map((item) => {
    const fraction = item.value / totalPieVal;
    const angle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = pieCenter.x + pieCenter.r * Math.cos(startAngle);
    const y1 = pieCenter.y + pieCenter.r * Math.sin(startAngle);
    const x2 = pieCenter.x + pieCenter.r * Math.cos(endAngle);
    const y2 = pieCenter.y + pieCenter.r * Math.sin(endAngle);

    const ix1 = pieCenter.x + pieCenter.innerR * Math.cos(endAngle);
    const iy1 = pieCenter.y + pieCenter.innerR * Math.sin(endAngle);
    const ix2 = pieCenter.x + pieCenter.innerR * Math.cos(startAngle);
    const iy2 = pieCenter.y + pieCenter.innerR * Math.sin(startAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${pieCenter.r} ${pieCenter.r} 0 ${largeArc} 1 ${x2} ${y2}
      L ${ix1} ${iy1}
      A ${pieCenter.innerR} ${pieCenter.innerR} 0 ${largeArc} 0 ${ix2} ${iy2}
      Z
    `;

    return { ...item, pathData, pct: Math.round(fraction * 100) };
  });

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', marginTop: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      
      {/* Header with Title & Multi-Graph Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
            {forecast.medicine_name} — Visual Forecasting Trajectory
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Stock: <strong>{initialStock} units</strong> • Daily Consumption: ~<strong>{dailyAvg} units/day</strong> • Buffer: <strong>{bufferThreshold} units</strong>
          </div>
        </div>

        {/* Graph Type Switcher Buttons */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', gap: '0.25rem', overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
          <button
            className={`nav-tab-btn ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
            title="Line Graph: Depletion Trajectory"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', minHeight: '32px' }}
          >
            <LineIcon size={14} /> Line Graph
          </button>

          <button
            className={`nav-tab-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            title="Bar Graph: Daily Projected Remaining Stock"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', minHeight: '32px' }}
          >
            <BarChart3 size={14} /> Bar Graph
          </button>

          <button
            className={`nav-tab-btn ${chartType === 'histogram' ? 'active' : ''}`}
            onClick={() => setChartType('histogram')}
            title="Histogram: Demand Surge Distribution"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', minHeight: '32px' }}
          >
            <BarChart2 size={14} /> Histogram
          </button>

          <button
            className={`nav-tab-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
            title="Pie / Donut: Inventory Proportions"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', minHeight: '32px' }}
          >
            <PieIcon size={14} /> Pie Chart
          </button>
        </div>
      </div>

      {/* Trajectory Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className={`badge ${forecast.urgency_level === 'Critical' ? 'badge-red' : (forecast.urgency_level === 'Warning' ? 'badge-yellow' : 'badge-green')}`}>
            {forecast.urgency_level === 'Critical' ? <ShieldAlert size={12} /> : <Clock size={12} />}
            {forecast.days_to_stockout <= 3 ? `Stock-Out in ${forecast.days_to_stockout} Days` : `${forecast.days_to_stockout} Days Safety Inventory`}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Risk Probability: <strong style={{ color: forecast.stockout_probability_pct > 70 ? '#dc2626' : '#0284c7' }}>{forecast.stockout_probability_pct}%</strong>
          </span>
        </div>

        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          Active View: {chartType === 'line' ? '📈 14-Day Trajectory Curve' : (chartType === 'bar' ? '📊 Daily Stock Levels' : (chartType === 'histogram' ? '📶 Consumption Frequency Bins' : '🥧 Proportion Breakdown'))}
        </div>
      </div>

      {/* Dynamic Graph Rendering Area */}
      <div style={{ width: '100%', overflowX: 'auto', background: '#fafafa', borderRadius: '8px', padding: '0.5rem', border: '1px solid #f1f5f9' }}>
        
        {/* VIEW 1: LINE GRAPH */}
        {chartType === 'line' && (
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '240px' }}>
            <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="#e2e8f0" strokeDasharray="3 3" />
            <line x1={padding.left} y1={height / 2} x2={width - padding.right} y2={height / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#94a3b8" />

            {/* Buffer threshold reference line */}
            {bufferY >= padding.top && bufferY <= height - padding.bottom && (
              <g>
                <line x1={padding.left} y1={bufferY} x2={width - padding.right} y2={bufferY} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x={width - padding.right - 5} y={bufferY - 4} fill="#d97706" fontSize="10" textAnchor="end" fontWeight="700">
                  Buffer Threshold ({bufferThreshold} units)
                </text>
              </g>
            )}

            {/* Main Path */}
            <path d={linePathD} fill="none" stroke={forecast.urgency_level === 'Critical' ? '#ef4444' : '#0284c7'} strokeWidth="3" />

            {/* Data Points */}
            {points.map((pt, idx) => {
              const cx = getX(idx);
              const cy = getY(pt.projected_stock_level);
              const isZero = pt.projected_stock_level === 0;
              return (
                <g key={idx}>
                  <circle cx={cx} cy={cy} r={isZero ? 5.5 : 4} fill={isZero ? '#dc2626' : '#0284c7'} stroke="#ffffff" strokeWidth="1.5" />
                  {idx % 2 === 0 && (
                    <text x={cx} y={height - padding.bottom + 16} fill="#64748b" fontSize="9" textAnchor="middle">
                      Day {idx + 1}
                    </text>
                  )}
                </g>
              );
            })}

            <text x={padding.left - 8} y={getY(maxVal)} fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(maxVal)}</text>
            <text x={padding.left - 8} y={getY(0)} fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
          </svg>
        )}

        {/* VIEW 2: BAR GRAPH */}
        {chartType === 'bar' && (
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '240px' }}>
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#94a3b8" />

            {points.map((pt, idx) => {
              const x = padding.left + idx * barSlotWidth + (barSlotWidth - barWidth) / 2;
              const barHeight = Math.max(2, (pt.projected_stock_level / maxVal) * (height - padding.top - padding.bottom));
              const y = (height - padding.bottom) - barHeight;
              const isShortage = pt.projected_stock_level < bufferThreshold;

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={pt.projected_stock_level === 0 ? '#ef4444' : (isShortage ? '#f59e0b' : '#0284c7')}
                    rx="3"
                  />
                  <text x={x + barWidth / 2} y={y - 4} fill="#475569" fontSize="8.5" textAnchor="middle" fontWeight="600">
                    {Math.round(pt.projected_stock_level)}
                  </text>
                  <text x={x + barWidth / 2} y={height - padding.bottom + 15} fill="#64748b" fontSize="8.5" textAnchor="middle">
                    D{idx + 1}
                  </text>
                </g>
              );
            })}
            <text x={padding.left - 8} y={getY(maxVal)} fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(maxVal)}</text>
            <text x={padding.left - 8} y={getY(0)} fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
          </svg>
        )}

        {/* VIEW 3: HISTOGRAM GRAPH */}
        {chartType === 'histogram' && (
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '240px' }}>
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#94a3b8" />
            
            {histogramBins.map((bin, idx) => {
              const histSlotWidth = (width - padding.left - padding.right) / binCount;
              const hBarWidth = histSlotWidth * 0.8;
              const x = padding.left + idx * histSlotWidth + (histSlotWidth - hBarWidth) / 2;
              const bHeight = (bin.count / maxBinCount) * (height - padding.top - padding.bottom);
              const y = (height - padding.bottom) - bHeight;

              return (
                <g key={idx}>
                  <rect x={x} y={y} width={hBarWidth} height={bHeight} fill="#8b5cf6" rx="4" opacity="0.85" />
                  <text x={x + hBarWidth / 2} y={y - 5} fill="#5b21b6" fontSize="10" textAnchor="middle" fontWeight="700">
                    {bin.count} days ({bin.pct}%)
                  </text>
                  <text x={x + hBarWidth / 2} y={height - padding.bottom + 18} fill="#475569" fontSize="9.5" textAnchor="middle" fontWeight="600">
                    {bin.label} units/day
                  </text>
                </g>
              );
            })}
            <text x={padding.left - 8} y={height / 2} fill="#94a3b8" fontSize="10" textAnchor="end">Days</text>
          </svg>
        )}

        {/* VIEW 4: PIE / DONUT CHART */}
        {chartType === 'pie' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1rem, 3vw, 2rem)', padding: '0.5rem', flexWrap: 'wrap' }}>
            <svg width="220" height="220" viewBox="0 0 240 240" style={{ maxWidth: '100%', height: 'auto' }}>
              {donutSlices.map((slice, idx) => (
                <path key={idx} d={slice.pathData} fill={slice.color} stroke="#ffffff" strokeWidth="2" />
              ))}
              <circle cx="120" cy="120" r="40" fill="#ffffff" />
              <text x="120" y="116" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">TOTAL</text>
              <text x="120" y="132" textAnchor="middle" fontSize="10" fill="#64748b">{initialStock}u</text>
            </svg>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
              {donutSlices.map((slice, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: slice.color, flexShrink: 0 }} />
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{slice.label}:</span>
                  <span style={{ color: '#64748b' }}>{slice.value} units ({slice.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Explainability Insight */}
      <div className={`reason-box ${forecast.urgency_level === 'Critical' ? 'urgent' : ''}`} style={{ marginTop: '0.75rem' }}>
        <strong>AI Diagnostic Summary:</strong> {forecast.explanation}
      </div>
    </div>
  );
}
