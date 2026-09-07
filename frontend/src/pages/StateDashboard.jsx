import React, { useState, useEffect } from 'react';
import { MapPin, Building, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import RedistributionPanel from '../components/RedistributionPanel';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function StateDashboard({ stateId = 'ST-MH', onSelectDistrict, onSelectPHC, lang }) {
  const t = translations[lang] || translations.en;
  const [phcs, setPhcs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const stateNames = {
    'ST-MH': 'Maharashtra (Simulated)',
    'ST-KA': 'Karnataka (Simulated)',
    'ST-UP': 'Uttar Pradesh (Simulated)'
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [phcData, recData] = await Promise.all([
        apiClient.getPHCs({ state_id: stateId }),
        apiClient.getRecommendations({ state_id: stateId })
      ]);
      setPhcs(phcData);
      setRecommendations(recData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [stateId]);

  // Group PHCs by district
  const districtMap = {};
  phcs.forEach(p => {
    if (!districtMap[p.district_name]) {
      districtMap[p.district_name] = [];
    }
    districtMap[p.district_name].push(p);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {stateNames[stateId] || stateId} — State Health Operations
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            5 Districts Monitored • {phcs.length} Total Primary Health Centres (PHCs)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ST-MH', 'ST-KA', 'ST-UP'].map(sId => (
            <button
              key={sId}
              className={`btn-action ${stateId === sId ? 'btn-primary' : 'btn-reject'}`}
              onClick={() => window.dispatchEvent(new CustomEvent('select-state', { detail: sId }))}
            >
              {sId.replace('ST-', '')}
            </button>
          ))}
        </div>
      </div>

      {/* District Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {Object.entries(districtMap).map(([distName, distPhcs]) => {
          const isNashik = distName === 'Nashik';
          const isPune = distName === 'Pune';
          const isLucknow = distName === 'Lucknow';
          const riskColor = isNashik ? 'red' : (isLucknow ? 'yellow' : 'green');

          return (
            <div
              key={distName}
              onClick={() => onSelectDistrict(distName)}
              style={{
                background: isNashik ? '#fef2f2' : '#ffffff',
                border: `1px solid ${isNashik ? '#ef4444' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '1.15rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{distName}</h4>
                <span className={`badge ${riskColor === 'red' ? 'badge-red' : (riskColor === 'yellow' ? 'badge-yellow' : 'badge-green')}`}>
                  {isNashik ? 'Outbreak Surge' : (isLucknow ? 'Shortage' : 'Stable')}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                {distPhcs.length} PHCs Active • {isNashik ? '12 Critical Alerts' : (isPune ? 'Surplus Hub' : '0 Alerts')}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                View District PHCs →
              </div>
            </div>
          );
        })}
      </div>

      {/* State Redistribution Approvals */}
      <RedistributionPanel
        recommendations={recommendations}
        onUpdate={loadData}
        lang={lang}
        stateId={stateId}
      />
    </div>
  );
}
