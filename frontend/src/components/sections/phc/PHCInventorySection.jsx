import React from 'react';
import { Pill } from 'lucide-react';

export default function PHCInventorySection({ stocks, selectedMedicine, setSelectedMedicine }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Pill size={20} color="#0284c7" />
          <span>Facility Medicine Inventory & Current Buffer Status</span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Description</th>
              <th>Batch Code</th>
              <th>Available Stock</th>
              <th>Safety Threshold</th>
              <th>Daily Avg Burn Rate</th>
              <th>Status</th>
              <th>Simulate Forecast</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id} style={{ background: selectedMedicine === s.medicine_name ? '#f0f9ff' : 'transparent' }}>
                <td style={{ fontWeight: 600 }}>{s.medicine_name}</td>
                <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{s.batch_id}</td>
                <td style={{ fontWeight: 700, color: s.status === 'Critical' ? '#dc2626' : (s.status === 'Warning' ? '#d97706' : '#166534') }}>
                  {s.quantity} units
                </td>
                <td>{s.buffer_threshold} units</td>
                <td>{s.daily_consumption_avg} / day</td>
                <td>
                  <span className={`badge ${s.status === 'Critical' ? 'badge-red' : (s.status === 'Warning' ? 'badge-yellow' : 'badge-green')}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-action"
                    style={{ fontSize: '0.72rem', background: selectedMedicine === s.medicine_name ? '#0284c7' : '#e2e8f0', color: selectedMedicine === s.medicine_name ? '#ffffff' : '#0f172a' }}
                    onClick={() => setSelectedMedicine(s.medicine_name)}
                  >
                    Select Forecast
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
