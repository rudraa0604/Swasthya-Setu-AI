import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, badge, color = 'orange' }) {
  const getBadgeClass = () => {
    if (badge?.type === 'red') return 'badge-red';
    if (badge?.type === 'yellow' || badge?.type === 'orange') return 'badge-yellow';
    if (badge?.type === 'purple') return 'badge-yellow';
    return 'badge-green';
  };

  const getIconColor = () => {
    if (color === 'red') return '#dc2626';
    if (color === 'green') return '#16a34a';
    if (color === 'yellow' || color === 'orange') return '#f97316';
    return '#ea580c';
  };

  return (
    <div className="kpi-card">
      <div>
        <div className="kpi-header">
          <span>{title}</span>
          {Icon && <Icon size={18} color={getIconColor()} />}
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
