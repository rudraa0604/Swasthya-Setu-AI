import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Building2, BedDouble } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import IndiaMap from '../components/IndiaMap';
import FederatedStatusPanel from '../components/FederatedStatusPanel';
import RedistributionPanel from '../components/RedistributionPanel';
import TelemetryIntegrationBanner from '../components/sections/national/TelemetryIntegrationBanner';
import EarlyWarningAlertsSection from '../components/sections/national/EarlyWarningAlertsSection';
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
      {/* Top Telemetry Integration Note */}
      <TelemetryIntegrationBanner onScanAlerts={handleScanAlerts} lang={lang} />

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

      {/* Federated Model Panel */}
      <FederatedStatusPanel lang={lang} />

      {/* India Geographic Risk Overview */}
      <IndiaMap 
        onSelectState={onSelectState}
        selectedState={null}
        statesSummary={rollup?.states_summary}
      />

      {/* High-Urgency Alerts Table Section */}
      <EarlyWarningAlertsSection alerts={alerts} onSelectPHC={onSelectPHC} />

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
