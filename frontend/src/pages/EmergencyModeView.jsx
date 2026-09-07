import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertOctagon, Check, X, Truck, BedDouble, Users, ArrowLeft } from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function EmergencyModeView({ onClose, lang }) {
  const t = translations[lang] || translations.en;
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmergencyData = async () => {
    try {
      setLoading(true);
      const recs = await apiClient.getRecommendations({ status: 'pending' });
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const handleAuthorize = async (recId, action) => {
    try {
      await apiClient.actOnRecommendation(recId, action);
      loadEmergencyData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="emergency-takeover">
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dc2626', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertOctagon size={32} color="#ffffff" style={{ flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
              NATIONAL HEALTH EMERGENCY OVERRIDE ACTIVE
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#fef2f2' }}>
              Target Focus: Epidemic Cluster in Nashik District (Maharashtra) • Triage Protocol Stage 3
            </div>
          </div>
        </div>

        <button 
          className="btn-action" 
          style={{ background: '#ffffff', color: '#dc2626', fontWeight: 800, minHeight: '36px' }}
          onClick={onClose}
        >
          Exit Emergency Mode
        </button>
      </div>

      {/* Emergency KPI Cards */}
      <div className="grid-kpi">
        <div className="kpi-card" style={{ background: '#1e293b', borderColor: '#ef4444' }}>
          <div className="kpi-header">
            <span>CRITICAL STOCK-OUT DEFICITS</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>4 PHCs</div>
          <div className="kpi-subtext" style={{ color: '#94a3b8' }}>Paracetamol & IV Fluids depleted</div>
        </div>

        <div className="kpi-card" style={{ background: '#1e293b', borderColor: '#f59e0b' }}>
          <div className="kpi-header">
            <span>ICU ADMISSION PRESSURE</span>
            <BedDouble size={18} color="#f59e0b" />
          </div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>94.2%</div>
          <div className="kpi-subtext" style={{ color: '#94a3b8' }}>18 of 20 District ICU beds occupied</div>
        </div>

        <div className="kpi-card" style={{ background: '#1e293b', borderColor: '#0284c7' }}>
          <div className="kpi-header">
            <span>RAPID DISPATCH READY</span>
            <Truck size={18} color="#0284c7" />
          </div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>{recommendations.length} Orders</div>
          <div className="kpi-subtext" style={{ color: '#94a3b8' }}>Surplus staged from Pune / Thane</div>
        </div>
      </div>

      {/* Priority Transfer Recommendations (Front & Center) */}
      <div className="panel" style={{ border: '2px solid #ef4444' }}>
        <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
          <div className="panel-title" style={{ color: '#f8fafc' }}>
            <Truck size={20} color="#ef4444" />
            <span>Emergency Inter-Facility Supply Redistribution Authorizations</span>
          </div>
          <span className="badge badge-red">{recommendations.length} Transfers Awaiting Immediate Signature</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Emergency Supply</th>
                <th>Source Depot (Surplus)</th>
                <th>Target Hospital (Deficit)</th>
                <th>Transit Dist. & Urgency</th>
                <th>Immediate Authorization Action</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr key={rec.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>{rec.medicine_name}</div>
                    <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                      📦 {rec.quantity} units requested
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{rec.from_phc_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>District: {rec.from_district}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fca5a5' }}>{rec.to_phc_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#f87171' }}>District: {rec.to_district} (Outbreak Zone)</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{rec.transport_distance_km} km</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
                      Urgency Score: {rec.urgency_score} / 1.0
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-action btn-approve"
                        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', fontWeight: 800, minHeight: '36px' }}
                        onClick={() => handleAuthorize(rec.id, 'approved')}
                      >
                        <Check size={15} /> AUTHORIZE DISPATCH
                      </button>
                      <button 
                        className="btn-action btn-reject"
                        style={{ padding: '0.5rem 0.75rem', minHeight: '36px' }}
                        onClick={() => handleAuthorize(rec.id, 'rejected')}
                      >
                        <X size={15} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
