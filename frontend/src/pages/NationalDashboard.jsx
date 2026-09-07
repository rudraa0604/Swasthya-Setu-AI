import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Building2, BedDouble, RefreshCw, Layers } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import IndiaMap from '../components/IndiaMap';
import FederatedStatusPanel from '../components/FederatedStatusPanel';
import RedistributionPanel from '../components/RedistributionPanel';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function NationalDashboard({ onSelectState, onSelectPHC, lang }) {
  const t = translations[lang] || translations.en;
  const [rollup, setRollup] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rData, aData, recData] = await Promise.all([
        apiClient.getNationalRollup(),
        apiClient.getAlerts({ limit: 10 }),
        apiClient.getRecommendations({ status: 'pending' })
      ]);
      setRollup(rData);
      setAlerts(aData);
      setRecommendations(recData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScanAlerts = async () => {
    try {
      setLoading(true);
      await apiClient.triggerAlertScan();
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Top Integration Note */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', color: '#166534', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span>🌿 <strong>ABDM / eVIN / HMIS Telemetry Layer:</strong> {t.integrationNote}</span>
        <button className="btn-action" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', minHeight: '32px' }} onClick={handleScanAlerts}>
          <RefreshCw size={12} /> {t.refreshAlerts}
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpi">
        <MetricCard 
          title={t.totalPHCs}
          value={rollup?.total_phcs_monitored || 150}
          subtext="Across 3 States • 15 Districts"
          icon={Building2}
          badge={{ text: "100% Online", type: "green" }}
        />
        <MetricCard 
          title={t.activeAlerts}
          value={rollup?.critical_alerts_count || 14}
          subtext="Imminent Stock-outs / Deficits"
          icon={ShieldAlert}
          color="red"
          badge={{ text: "Urgent Action Required", type: "red" }}
        />
        <MetricCard 
          title={t.pendingTransfers}
          value={recommendations?.length || 6}
          subtext="Awaiting Officer Approval"
          icon={AlertTriangle}
          color="yellow"
          badge={{ text: "Human-in-the-Loop", type: "yellow" }}
        />
        <MetricCard 
          title={t.bedOccupancy}
          value={`${rollup?.bed_occupancy?.occupancy_rate_pct || 68.5}%`}
          subtext={`ICU Occupied: ${rollup?.bed_occupancy?.icu_occupied || 18}/${rollup?.bed_occupancy?.icu_total || 60}`}
          icon={BedDouble}
          badge={{ text: "Nashik ICU Saturated", type: "red" }}
        />
      </div>

      {/* Federated Model Panel (Primary Architectural Differentiator) */}
      <FederatedStatusPanel lang={lang} />

      {/* India Geographic Risk Overview */}
      <IndiaMap 
        onSelectState={onSelectState}
        selectedState={null}
        statesSummary={rollup?.states_summary}
      />

      {/* High-Urgency Alerts Table */}
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

      {/* Redistribution Recommendations */}
      <RedistributionPanel 
        recommendations={recommendations}
        onUpdate={loadData}
        lang={lang}
        stateId="ST-MH"
      />
    </div>
  );
}
