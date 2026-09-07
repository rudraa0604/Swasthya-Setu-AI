import React from 'react';
import { MapPin, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function IndiaMap({ onSelectState, selectedState, statesSummary }) {
  const states = [
    {
      id: 'ST-MH',
      name: 'Maharashtra',
      districts: '5 Districts • 50 PHCs',
      status: 'High Risk (Nashik Outbreak)',
      statusType: 'red',
      activeAlerts: 14,
      pendingTransfers: 6,
      topMedicineDeficit: 'Paracetamol 500mg, IV Saline',
      color: '#fee2e2',
      borderColor: '#ef4444'
    },
    {
      id: 'ST-UP',
      name: 'Uttar Pradesh',
      districts: '5 Districts • 50 PHCs',
      status: 'Moderate Risk (Lucknow Shortage)',
      statusType: 'yellow',
      activeAlerts: 5,
      pendingTransfers: 2,
      topMedicineDeficit: 'Rabies Vaccine (Anti-Rabies)',
      color: '#fef3c7',
      borderColor: '#f59e0b'
    },
    {
      id: 'ST-KA',
      name: 'Karnataka',
      districts: '5 Districts • 50 PHCs',
      status: 'Healthy / Resilient',
      statusType: 'green',
      activeAlerts: 1,
      pendingTransfers: 0,
      topMedicineDeficit: 'None (Adequate Safety Stock)',
      color: '#d1fae5',
      borderColor: '#10b981'
    }
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <MapPin size={20} color="#0284c7" />
          <span>National Geographic Health Risk Overview (Federated State Nodes)</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Select a state node to drill down
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {states.map((st) => {
          const isSelected = selectedState === st.id;
          return (
            <div
              key={st.id}
              onClick={() => onSelectState(st.id)}
              style={{
                background: st.color,
                border: `2px solid ${isSelected ? '#0284c7' : st.borderColor}`,
                borderRadius: '10px',
                padding: '1.15rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : 'none',
                boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{st.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{st.districts}</div>
                </div>
                <span className={`badge ${st.statusType === 'red' ? 'badge-red' : (st.statusType === 'yellow' ? 'badge-yellow' : 'badge-green')}`}>
                  {st.statusType === 'red' ? <ShieldAlert size={12} /> : (st.statusType === 'yellow' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />)}
                  {st.status}
                </span>
              </div>

              <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.7)', padding: '0.65rem', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Active Alerts</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: st.statusType === 'red' ? '#dc2626' : '#0f172a' }}>
                    {st.activeAlerts}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Pending Transfers</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0284c7' }}>
                    {st.pendingTransfers}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#334155' }}>
                <strong>Vulnerability Focus:</strong> {st.topMedicineDeficit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
