import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function EarlyWarningAlertsSection({ alerts, onSelectPHC }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldAlert size={20} color="#ef4444" />
          <span>National Early Warning Triage (Top Critical Deficits)</span>
        </div>
        <span className="badge badge-red">{alerts.length} Critical Signals</span>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Facility & District</th>
              <th>Alert Type</th>
              <th>Diagnostic Headline</th>
              <th>Explainable Root Cause</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>
                  <div>{a.phc_id}</div>
                </td>
                <td>
                  <span className={`badge ${a.severity === 'critical' ? 'badge-red' : 'badge-yellow'}`}>
                    {a.type.toUpperCase()}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: a.severity === 'critical' ? '#dc2626' : '#d97706' }}>
                  {a.message}
                </td>
                <td style={{ fontSize: '0.78rem', color: '#475569' }}>
                  {a.explanation}
                </td>
                <td>
                  <button 
                    className="btn-action btn-primary"
                    onClick={() => onSelectPHC(a.phc_id)}
                    style={{ fontSize: '0.72rem' }}
                  >
                    Inspect PHC
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
