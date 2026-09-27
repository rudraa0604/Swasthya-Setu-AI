import React from 'react';
import { AlertTriangle, Zap, RotateCcw } from 'lucide-react';

export default function IncidentRerouteSimulator({
  incidentType,
  setIncidentType,
  incidentRadius,
  setIncidentRadius,
  incidentApplied,
  computeRoute,
  loading
}) {
  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#ef4444' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <span>Real-time Monsoon Hazard & Road Blockage Dynamic Re-Routing</span>
        </div>
        <span className="badge badge-red">Active Incident Simulator</span>
      </div>

      <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
          Simulates mid-route disasters (e.g., Kasara Ghat landslide, bridge inundation) to trigger Dijkstra dynamic recalculation and automatic expressway bypasses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Hazard Classification</label>
            <select 
              className="input-custom"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            >
              <option value="Monsoon Flash Flood / Road Inundation">Monsoon Flash Flood / Road Inundation</option>
              <option value="Western Ghats Mountain Landslide">Western Ghats Mountain Landslide</option>
              <option value="Severe Multi-Vehicle Highway Congestion">Severe Multi-Vehicle Highway Congestion</option>
              <option value="Emergency Security Road Closure">Emergency Security Road Closure</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Impact Radius Zone</label>
            <select 
              className="input-custom"
              value={incidentRadius}
              onChange={(e) => setIncidentRadius(parseFloat(e.target.value))}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            >
              <option value={2.5}>2.5 km Radius</option>
              <option value={3.5}>3.5 km Radius (Standard)</option>
              <option value={5.0}>5.0 km Radius (Major)</option>
              <option value={8.0}>8.0 km Radius (Severe)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-action btn-reject"
            style={{ background: '#dc2626', color: '#ffffff', padding: '0.65rem 1.25rem', fontWeight: 800 }}
            onClick={() => computeRoute(true)}
            disabled={loading}
          >
            <Zap size={16} /> Inject Disaster & Recalculate Alternate Green Corridor
          </button>
          {incidentApplied && (
            <button 
              className="btn-action"
              style={{ background: '#334155', color: '#f8fafc' }}
              onClick={() => computeRoute(false)}
              disabled={loading}
            >
              <RotateCcw size={14} /> Clear Road Hazard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
