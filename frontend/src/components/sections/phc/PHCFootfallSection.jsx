import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';

export default function PHCFootfallSection({ footfall, alerts }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem' }}>
      {/* 14-Day Footfall Trend Bars */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={20} color="#0284c7" />
            <span>14-Day Patient Footfall Pattern</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
          {footfall.map((f, i) => {
            const heightPct = Math.min(100, Math.round((f.count / 250) * 100));
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }} title={`${f.date}: ${f.count} patients (${f.tags})`}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${heightPct}%`, 
                    background: f.is_spike ? '#ef4444' : '#0284c7', 
                    borderRadius: '3px 3px 0 0',
                    transition: 'all 0.2s ease'
                  }} 
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
          <span>14 Days Ago</span>
          <span style={{ color: '#ef4444', fontWeight: 600 }}>■ Epidemic Surge Day</span>
          <span>Today</span>
        </div>
      </div>

      {/* Active Alert Signals */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <AlertCircle size={20} color="#ef4444" />
            <span>Facility Active Diagnostic Alerts</span>
          </div>
        </div>

        {alerts && alerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.85rem' }}>
                  {a.message}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '2px' }}>
                  {a.explanation}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#166534', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.85rem' }}>
            ✓ No critical alerts active for this facility node. All inventory and staff operational.
          </div>
        )}
      </div>
    </div>
  );
}
