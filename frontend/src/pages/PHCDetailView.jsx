import React, { useState, useEffect } from 'react';
import { Building, Pill, Users, BedDouble, AlertCircle, ArrowLeft, RefreshCw, Activity } from 'lucide-react';
import StockDepletionChart from '../components/StockDepletionChart';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function PHCDetailView({ phcId = 'PHC-MH-NAS-01', onBack, lang }) {
  const t = translations[lang] || translations.en;
  const [detail, setDetail] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('Paracetamol 500mg');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dData, fData] = await Promise.all([
        apiClient.getPHCDetail(phcId),
        apiClient.getPHCForecasts(phcId, 14)
      ]);
      setDetail(dData);
      setForecasts(fData);
      if (fData && fData.length > 0) {
        setSelectedMedicine(fData[0].medicine_name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [phcId]);

  if (loading || !detail) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading PHC Telemetry & AI Forecast Engine...</div>;
  }

  const phc = detail.phc;
  const currentForecast = forecasts.find(f => f.medicine_name === selectedMedicine) || forecasts[0];

  return (
    <div>
      {/* Back button and facility header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onBack && (
            <button className="btn-action btn-reject" onClick={onBack}>
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: '#0f172a' }}>
              {phc.name} ({phc.id})
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {phc.district_name} District • {phc.state_name} • Geo: {phc.lat}, {phc.lng}
            </div>
          </div>
        </div>

        <span className={`badge ${phc.risk_level === 'Critical' ? 'badge-red' : (phc.risk_level === 'Warning' ? 'badge-yellow' : 'badge-green')}`} style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>
          Facility Status: {phc.risk_level.toUpperCase()}
        </span>
      </div>

      {/* Overview Cards (Beds, Staff, Footfall) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Bed Status */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
            <div className="panel-title" style={{ fontSize: '0.95rem' }}>
              <BedDouble size={18} color="#0284c7" /> Bed Capacity
            </div>
            <span className={`badge ${detail.bed_status?.icu_occupied >= detail.bed_status?.icu_beds ? 'badge-red' : 'badge-green'}`}>
              ICU: {detail.bed_status?.icu_occupied}/{detail.bed_status?.icu_beds}
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {detail.bed_status?.occupied_beds} / {detail.bed_status?.total_beds} Occupied
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
            {detail.bed_status?.available_beds} General Beds Available
          </div>
        </div>

        {/* Staff Attendance */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
            <div className="panel-title" style={{ fontSize: '0.95rem' }}>
              <Users size={18} color="#0284c7" /> Staff Attendance
            </div>
            <span className={`badge ${detail.staff_summary?.present_today >= 7 ? 'badge-green' : 'badge-yellow'}`}>
              {detail.staff_summary?.present_today} Present
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {detail.staff_summary?.present_today} / {detail.staff_summary?.total_sanctioned} Staff On-Duty
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
            {detail.staff_summary?.absent_today} Personnel on Leave Today
          </div>
        </div>

        {/* Outbreak / Footfall Signal */}
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
            <div className="panel-title" style={{ fontSize: '0.95rem' }}>
              <Activity size={18} color="#0284c7" /> OPD Footfall (Today)
            </div>
            {detail.footfall_trend?.[detail.footfall_trend.length - 1]?.is_spike && (
              <span className="badge badge-red">Outbreak Spike</span>
            )}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {detail.footfall_trend?.[detail.footfall_trend.length - 1]?.count || 75} Patients
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
            Tags: {detail.footfall_trend?.[detail.footfall_trend.length - 1]?.tags || 'General'}
          </div>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Pill size={20} color="#0284c7" />
            <span>Essential Medicine Stocks & Depletion Rates</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Click a medicine to view 14-day forecast curve</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Batch ID</th>
                <th>Current Stock</th>
                <th>Buffer Threshold</th>
                <th>Avg Consumption</th>
                <th>Inventory Status</th>
                <th>AI Demand Forecast</th>
              </tr>
            </thead>
            <tbody>
              {detail.stocks.map((st) => {
                const isSelected = st.medicine_name === selectedMedicine;
                return (
                  <tr 
                    key={st.id} 
                    onClick={() => setSelectedMedicine(st.medicine_name)}
                    style={{ 
                      cursor: 'pointer',
                      background: isSelected ? '#e0f2fe' : (st.status === 'Critical' ? '#fff5f5' : 'inherit'),
                      fontWeight: isSelected ? 600 : 'normal'
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{st.medicine_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Exp: {st.expiry_date}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{st.batch_id}</td>
                    <td style={{ fontSize: '1rem', fontWeight: 700, color: st.status === 'Critical' ? '#dc2626' : '#0f172a' }}>
                      {st.quantity} units
                    </td>
                    <td>{st.buffer_threshold} units</td>
                    <td>{st.daily_consumption_avg} units/day</td>
                    <td>
                      <span className={`badge ${st.status === 'Critical' ? 'badge-red' : (st.status === 'Warning' ? 'badge-yellow' : 'badge-green')}`}>
                        {st.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-action btn-primary"
                        style={{ fontSize: '0.72rem' }}
                        onClick={(e) => { e.stopPropagation(); setSelectedMedicine(st.medicine_name); }}
                      >
                        {isSelected ? 'Viewing Curve ↓' : 'View Forecast'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Depletion AI Forecast Curve */}
      {currentForecast && (
        <StockDepletionChart forecast={currentForecast} />
      )}
    </div>
  );
}
