import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function PHCHeaderSection({ phc, onBack, loadData, loading }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onBack && (
          <button className="btn-action btn-reject" onClick={onBack}>
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: '#0f172a' }}>
            {phc.name} ({phc.id})
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {phc.district_name} District • {phc.state_name} • Geo: {phc.lat}, {phc.lng}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <a
          href={`#/portal/edge/${encodeURIComponent(phc.id)}`}
          className="btn-action btn-primary"
          style={{ textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}
        >
          📝 Enter Patient & OPD Data
        </a>
        <a
          href="#/portal/prediction"
          className="btn-action"
          style={{ textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}
        >
          🔮 AI Outbreak Predictions
        </a>
        <span className={`badge ${phc.risk_level === 'Critical' ? 'badge-red' : (phc.risk_level === 'Warning' ? 'badge-yellow' : 'badge-green')}`}>
          Status: {phc.risk_level.toUpperCase()}
        </span>
        <button className="btn-action" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>
    </div>
  );
}
