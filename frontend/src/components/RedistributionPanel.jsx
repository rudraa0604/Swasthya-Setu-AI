import React, { useState } from 'react';
import { Truck, Check, X, AlertCircle, Compass, Zap } from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function RedistributionPanel({ recommendations, onUpdate, lang, stateId }) {
  const t = translations[lang] || translations.en;
  const [processingId, setProcessingId] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleAction = async (recId, action) => {
    try {
      setProcessingId(recId);
      await apiClient.actOnRecommendation(recId, action);
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await apiClient.generateRecommendations(stateId || 'ST-MH');
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Truck size={20} color="#0284c7" />
          <span>{t.pendingTransfers}</span>
          <span className="badge badge-yellow">
            {recommendations?.filter(r => r.status === 'pending').length || 0} Pending Human Approval
          </span>
        </div>
        <button 
          className="btn-action btn-primary"
          onClick={handleGenerate}
          disabled={generating}
        >
          <Zap size={14} />
          {generating ? 'Optimizing...' : t.triggerOptimization}
        </button>
      </div>

      {(!recommendations || recommendations.length === 0) ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <Check size={32} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
          <p>No active cross-facility transfer deficits. All monitored facilities have adequate stock buffers.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Medicine & Quantity</th>
                <th>Supply Facility (Surplus Source)</th>
                <th>Demand Facility (Deficit Target)</th>
                <th>Logistics (Distance / Urgency)</th>
                <th>Status</th>
                <th>Officer Authorization Action</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr key={rec.id} style={{ background: rec.status === 'pending' ? '#fffdf7' : 'inherit' }}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{rec.medicine_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                      📦 {rec.quantity} units requested
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rec.from_phc_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>District: {rec.from_district}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{rec.to_phc_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>District: {rec.to_district}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                      <Compass size={13} color="#64748b" /> {rec.transport_distance_km} km
                    </div>
                    <div style={{ fontSize: '0.75rem', color: rec.urgency_score > 0.7 ? '#dc2626' : '#d97706', fontWeight: 600 }}>
                      Urgency Score: {rec.urgency_score}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${rec.status === 'approved' ? 'badge-green' : (rec.status === 'rejected' ? 'badge-red' : 'badge-yellow')}`}>
                      {rec.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {rec.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn-action btn-approve"
                          onClick={() => handleAction(rec.id, 'approved')}
                          disabled={processingId === rec.id}
                        >
                          <Check size={13} /> {t.approve}
                        </button>
                        <button 
                          className="btn-action btn-reject"
                          onClick={() => handleAction(rec.id, 'rejected')}
                          disabled={processingId === rec.id}
                        >
                          <X size={13} /> {t.reject}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Reviewed {rec.reviewed_at ? new Date(rec.reviewed_at).toLocaleTimeString() : ''}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show detailed AI reason preview for pending ones */}
      {recommendations?.filter(r => r.status === 'pending').slice(0, 3).map(rec => (
        <div key={rec.id} className="reason-box urgent" style={{ marginTop: '0.75rem' }}>
          <strong>Optimizer Rationale ({rec.medicine_name} &rarr; {rec.to_phc_name}):</strong> {rec.reason}
        </div>
      ))}
    </div>
  );
}
