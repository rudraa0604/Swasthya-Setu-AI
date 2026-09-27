import React, { useState, useEffect } from 'react';
import { Building, MapPin, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import RedistributionPanel from '../components/RedistributionPanel';
import ProximityEarlyWarningRadar from '../components/ProximityEarlyWarningRadar';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function DistrictDashboard({ districtName = 'Nashik', onSelectPHC, onBackToState, lang }) {
  const t = translations[lang] || translations.en;
  const [phcs, setPhcs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [phcData, recData] = await Promise.all([
        apiClient.getPHCs({ district_name: districtName }),
        apiClient.getRecommendations()
      ]);
      setPhcs(phcData);
      setRecommendations(recData.filter(r => r.to_district === districtName || r.from_district === districtName));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [districtName]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-action btn-reject" onClick={onBackToState}>
            <ArrowLeft size={14} /> Back to State View
          </button>
          <div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, color: '#0f172a' }}>
              {districtName} District Health Officer Dashboard
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {phcs.length} Monitored Primary Health Centres (PHCs)
            </div>
          </div>
        </div>

        {districtName === 'Nashik' && (
          <span className="badge badge-red" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', whiteSpace: 'normal', textAlign: 'left' }}>
            <ShieldAlert size={14} style={{ flexShrink: 0 }} /> OUTBREAK ACTIVE: High Paracetamol & IV Saline Demand Surge
          </span>
        )}
      </div>

      {/* AI Proximity Early Warning Radar for District Clinics */}
      <ProximityEarlyWarningRadar 
        phcId={phcs[0]?.id || 'PHC-MH-NAS-01'} 
        phcName={`${districtName} District Zone`}
        lang={lang} 
      />

      {/* PHC List Table */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Building size={20} color="#ea580c" />
            <span>Health Clinics (PHCs) Status Overview</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Clinic Name</th>
                <th>Clinic ID</th>
                <th>Staff Strength</th>
                <th>Location (Lat/Lng)</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {phcs.map((phc) => {
                const isShortagePHC = phc.id.endsWith(('-01', '-02', '-03')) && districtName === 'Nashik';
                return (
                  <tr key={phc.id}>
                    <td style={{ fontWeight: 600 }}>{phc.name}</td>
                    <td style={{ fontFamily: 'monospace', color: '#ea580c', fontWeight: 600 }}>{phc.id}</td>
                    <td>{phc.sanctioned_staff_count} Staff Members</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{phc.lat}, {phc.lng}</td>
                    <td>
                      <span className={`badge ${isShortagePHC ? 'badge-red' : 'badge-green'}`}>
                        {isShortagePHC ? 'Low Stock (High Demand)' : 'Well Stocked'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-primary"
                        onClick={() => onSelectPHC(phc.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Check Stock & Forecast →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Redistribution Approvals */}
      <RedistributionPanel
        recommendations={recommendations}
        onUpdate={loadData}
        lang={lang}
      />
    </div>
  );
}
