import React from 'react';
import { BedDouble, Users } from 'lucide-react';

export default function PHCBedStaffSection({ bed, staff }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Bed Occupancy Card */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <BedDouble size={20} color="#0284c7" />
            <span>Facility Bed & ICU Capacity</span>
          </div>
        </div>

        {bed && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>General Ward Beds</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                {bed.occupied_beds} / {bed.total_beds}
              </div>
              <div style={{ fontSize: '0.75rem', color: bed.available_beds > 5 ? '#166534' : '#dc2626' }}>
                {bed.available_beds} Beds Available
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ICU Beds (High-Acuity)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: bed.icu_available === 0 ? '#dc2626' : '#0f172a', margin: '4px 0' }}>
                {bed.icu_occupied} / {bed.icu_beds}
              </div>
              <div style={{ fontSize: '0.75rem', color: bed.icu_available === 0 ? '#dc2626' : '#166534', fontWeight: 600 }}>
                {bed.icu_available === 0 ? 'ICU Saturated' : `${bed.icu_available} ICU Available`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Attendance Summary Card */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Users size={20} color="#10b981" />
            <span>Personnel & Staff Strength</span>
          </div>
        </div>

        {staff && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Sanctioned Quota: {staff.total_sanctioned}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: staff.absent_today > 1 ? '#dc2626' : '#166534' }}>
                {staff.present_today} Present • {staff.absent_today} Absent
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {staff.staff_list.slice(0, 4).map((st, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <span><strong>{st.role}:</strong> {st.name}</span>
                  <span className={`badge ${st.present ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.68rem' }}>
                    {st.present ? 'On Duty' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
