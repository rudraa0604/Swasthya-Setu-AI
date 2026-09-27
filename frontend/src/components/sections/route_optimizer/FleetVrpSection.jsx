import React from 'react';
import { Truck, Navigation, Clock, CheckCircle2 } from 'lucide-react';

export default function FleetVrpSection({ fleetResult, selectedFleetVan, setSelectedFleetVan, onSelectPHC }) {
  const routes = fleetResult?.fleet_overview || fleetResult?.routes || [];

  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Truck size={20} color="#38bdf8" />
          <span>Multi-Vehicle Fleet Routing Problem (VRP) Dispatch Optimizer</span>
        </div>
        <span className="badge badge-green">{routes.length} Active Fleet Carriers</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
        {routes.map((v, i) => (
          <div 
            key={i}
            onClick={() => setSelectedFleetVan(i)}
            style={{
              background: selectedFleetVan === i ? '#1e293b' : '#0f172a',
              border: selectedFleetVan === i ? '2px solid #38bdf8' : '1px solid #334155',
              borderRadius: '8px',
              padding: '1.15rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem' }}>
                {v.vehicle_type || v.route_id}
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                {v.status || 'Active Dispatch'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
              <strong>Driver:</strong> {v.driver || 'Central Transport Officer'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
              <strong>From:</strong> {v.origin || 'Regional Medical Warehouse'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fca5a5', marginBottom: '0.5rem' }}>
              <strong>To:</strong> {v.destination || 'Outbreak Facility'}
            </div>

            <div style={{ background: '#020617', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
              📦 <strong>Manifest:</strong> {v.cargo_manifest || 'Essential Antipyretics & IV Fluids'}
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${v.progress_pct || 50}%`, height: '100%', background: '#38bdf8' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              <span>Transit: {v.progress_pct || 50}% complete</span>
              <span>ETA: {v.eta_mins || 45} mins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
