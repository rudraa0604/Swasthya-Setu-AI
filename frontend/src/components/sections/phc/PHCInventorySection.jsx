import React from 'react';
import { Pill } from 'lucide-react';

export default function PHCInventorySection({ stocks, selectedMedicine, setSelectedMedicine }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Pill size={20} color="#ea580c" />
          <span>Clinic Medicine Stock & Safety Levels</span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch No.</th>
              <th>In Stock</th>
              <th>Min Safety Level</th>
              <th>Daily Usage</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id} style={{ background: selectedMedicine === s.medicine_name ? '#fff7ed' : 'transparent' }}>
                <td style={{ fontWeight: 600 }}>{s.medicine_name}</td>
                <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{s.batch_id}</td>
                <td style={{ fontWeight: 700, color: s.status === 'Critical' ? '#dc2626' : (s.status === 'Warning' ? '#f97316' : '#16a34a') }}>
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
                    style={{ fontSize: '0.72rem', background: selectedMedicine === s.medicine_name ? '#ea580c' : '#f1f5f9', color: selectedMedicine === s.medicine_name ? '#ffffff' : '#0f172a', border: '1px solid #e2e8f0' }}
                    onClick={() => setSelectedMedicine(s.medicine_name)}
                  >
                    View Chart
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
