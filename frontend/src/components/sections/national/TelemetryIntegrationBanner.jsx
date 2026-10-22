import React from 'react';
import { RefreshCw } from 'lucide-react';
import { translations } from '../../../services/i18n';

export default function TelemetryIntegrationBanner({ onScanAlerts, lang }) {
  const t = translations[lang] || translations.en;

  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', color: '#166534', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      <span>🌿 <strong>ABDM / eVIN / HMIS Telemetry Layer:</strong> {t.integrationNote}</span>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <a 
          href="#/portal/prediction" 
          className="btn-action" 
          style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe', fontSize: '0.72rem', minHeight: '32px', textDecoration: 'none', fontWeight: 700 }}
        >
          🔮 AI Outbreak Predictions
        </a>
        <a 
          href="#/portal/edge" 
          className="btn-action" 
          style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontSize: '0.72rem', minHeight: '32px', textDecoration: 'none', fontWeight: 700 }}
        >
          📝 Data Entry Terminal
        </a>
        <button className="btn-action" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', minHeight: '32px' }} onClick={onScanAlerts}>
          <RefreshCw size={12} /> {t.refreshAlerts || 'Scan Telemetry'}
        </button>
      </div>
    </div>
  );
}
