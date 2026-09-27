import React from 'react';
import { RefreshCw, CheckCircle2, Cpu } from 'lucide-react';

export default function SystemMaintenanceSection({
  handleResetHealthy,
  handleReseedDatabase,
  handleRunFederatedRound,
  loading
}) {
  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <RefreshCw size={20} color="#ea580c" />
          <span>System Maintenance & Reset Tools</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
        {/* Reset Stocks to Healthy */}
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#ea580c', marginBottom: '0.5rem', fontWeight: 700 }}>Restore Baseline Stock</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
            Resets all 150 clinic medicine inventories back to safe, healthy stock levels and clears active stockout warnings.
          </p>
          <button 
            className="btn-action"
            style={{ background: '#ea580c', color: '#fff', width: '100%', justifyContent: 'center' }}
            onClick={handleResetHealthy}
            disabled={loading}
          >
            <CheckCircle2 size={15} /> Reset All Stocks to Safe Level
          </button>
        </div>

        {/* Trigger FedAvg Cycle */}
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontWeight: 700 }}>Trigger Federated Cycle</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
            Collects differential gradient weights from all 3 State nodes and performs secure FedAvg global aggregation.
          </p>
          <button 
            className="btn-action"
            style={{ background: '#059669', color: '#fff', width: '100%', justifyContent: 'center' }}
            onClick={handleRunFederatedRound}
            disabled={loading}
          >
            <Cpu size={15} /> Execute FedAvg Aggregation Round
          </button>
        </div>

        {/* Full Database Reseed */}
        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 700 }}>Full Database Reseed</h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
            Regenerates 45-day telemetry datasets, footfall spikes, bed occupancies, and default routes.
          </p>
          <button 
            className="btn-action"
            style={{ background: '#d97706', color: '#fff', width: '100%', justifyContent: 'center' }}
            onClick={handleReseedDatabase}
            disabled={loading}
          >
            <RefreshCw size={15} /> Reseed Clean Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
