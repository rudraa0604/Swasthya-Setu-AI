import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, badge, color = 'blue' }) {
  const getBadgeClass = () => {
    if (badge?.type === 'red') return 'badge-red';
    if (badge?.type === 'yellow') return 'badge-yellow';
    if (badge?.type === 'purple') return 'badge-purple';
    return 'badge-green';
  };

  return (
    <div className="kpi-card">
      <div>
        <div className="kpi-header">
          <span>{title}</span>
          {Icon && <Icon size={18} color={color === 'red' ? '#ef4444' : (color === 'yellow' ? '#f59e0b' : '#0284c7')} />}
        </div>
        <div className="kpi-value">{value}</div>
      </div>
      <div className="kpi-subtext">
        {badge && <span className={`badge ${getBadgeClass()}`}>{badge.text}</span>}
        <span>{subtext}</span>
      </div>
    </div>
  );
}
