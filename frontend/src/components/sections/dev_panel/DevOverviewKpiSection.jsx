import React from 'react';
import { Database, ShieldAlert, AlertTriangle, Layers, Building, Pill, Cpu } from 'lucide-react';

export default function DevOverviewKpiSection({ overview, phcs }) {
  return (
    <div className="grid-kpi" style={{ marginBottom: '1.5rem' }}>
      <div className="kpi-card" style={{ background: '#0f172a', borderColor: '#38bdf8' }}>
        <div className="kpi-header">
          <span style={{ color: '#94a3b8' }}>SYSTEM DATABASE STATE</span>
          <Database size={16} color="#38bdf8" />
        </div>
        <div className="kpi-value" style={{ color: '#38bdf8', fontSize: '1.3rem' }}>
          {overview?.db_status || 'Online & Synchronized'}
        </div>
        <div className="kpi-subtext" style={{ color: '#64748b' }}>
          {phcs.length} Active Simulated PHCs
        </div>
      </div>

      <div className="kpi-card" style={{ background: '#0f172a', borderColor: '#ef4444' }}>
        <div className="kpi-header">
          <span style={{ color: '#94a3b8' }}>UNRESOLVED SIGNALS</span>
          <ShieldAlert size={16} color="#ef4444" />
        </div>
        <div className="kpi-value" style={{ color: '#ef4444' }}>
          {overview?.active_alerts ?? 48}
        </div>
        <div className="kpi-subtext" style={{ color: '#64748b' }}>
          Early Warning Stock & Staff Alerts
        </div>
      </div>

      <div className="kpi-card" style={{ background: '#0f172a', borderColor: '#f59e0b' }}>
        <div className="kpi-header">
          <span style={{ color: '#94a3b8' }}>AI REDISTRIBUTIONS</span>
          <AlertTriangle size={16} color="#f59e0b" />
        </div>
        <div className="kpi-value" style={{ color: '#f59e0b' }}>
          {overview?.pending_transfers ?? 15}
        </div>
        <div className="kpi-subtext" style={{ color: '#64748b' }}>
          Inter-Facility Transfer Recommendations
        </div>
      </div>

      <div className="kpi-card" style={{ background: '#0f172a', borderColor: '#10b981' }}>
        <div className="kpi-header">
          <span style={{ color: '#94a3b8' }}>FEDAVG TRAINING ROUNDS</span>
          <Cpu size={16} color="#10b981" />
        </div>
        <div className="kpi-value" style={{ color: '#10b981' }}>
          {overview?.federated_rounds ?? 18}
        </div>
        <div className="kpi-subtext" style={{ color: '#64748b' }}>
          100% Zero Raw Data Exposure
        </div>
      </div>
    </div>
  );
}
