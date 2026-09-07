import React, { useState, useEffect } from 'react';
import { Building, MapPin, AlertTriangle, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import RedistributionPanel from '../components/RedistributionPanel';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-action btn-reject" onClick={onBackToState}>
            <ArrowLeft size={14} /> Back to State View
          </button>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {districtName} District Health Officer Dashboard
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {phcs.length} Monitored Primary Health Centres (PHCs)
            </div>
          </div>
        </div>

        {districtName === 'Nashik' && (
          <span className="badge badge-red" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
            <ShieldAlert size={14} /> OUTBREAK ACTIVE: High Paracetamol & IV Saline Demand Surge
          </span>
        )}
      </div>

      {/* PHC List Table */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Building size={20} color="#0284c7" />
            <span>Primary Health Centres (PHCs) Status Overview</span>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>PHC Facility Name</th>
                <th>Facility ID</th>
                <th>Staffing Strength</th>
                <th>Coordinates (Lat/Lng)</th>
                <th>Simulated Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {phcs.map((phc) => {
                const isShortagePHC = phc.id.endsWith(('-01', '-02', '-03')) && districtName === 'Nashik';
                return (
                  <tr key={phc.id}>
                    <td style={{ fontWeight: 600 }}>{phc.name}</td>
                    <td style={{ fontFamily: 'monospace', color: '#0284c7' }}>{phc.id}</td>
                    <td>{phc.sanctioned_staff_count} Sanctioned Personnel</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{phc.lat}, {phc.lng}</td>
                    <td>
                      <span className={`badge ${isShortagePHC ? 'badge-red' : 'badge-green'}`}>
                        {isShortagePHC ? 'Deficit (Outbreak Node)' : 'Normal Operations'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action btn-primary"
                        onClick={() => onSelectPHC(phc.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Inspect Inventory & Forecast →
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
