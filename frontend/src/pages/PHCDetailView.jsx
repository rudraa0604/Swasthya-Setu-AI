import React, { useState, useEffect } from 'react';
import StockDepletionChart from '../components/StockDepletionChart';
import PHCHeaderSection from '../components/sections/phc/PHCHeaderSection';
import PHCInventorySection from '../components/sections/phc/PHCInventorySection';
import PHCBedStaffSection from '../components/sections/phc/PHCBedStaffSection';
import PHCFootfallSection from '../components/sections/phc/PHCFootfallSection';
import ProximityEarlyWarningRadar from '../components/ProximityEarlyWarningRadar';
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
      setForecasts(fData?.forecasts || fData || []);
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
  const currentForecast = (forecasts.find && forecasts.find(f => f.medicine_name === selectedMedicine)) || forecasts[0];

  return (
    <div>
      {/* 1. Header & Quick Actions */}
      <PHCHeaderSection phc={phc} onBack={onBack} loadData={loadData} loading={loading} />

      {/* AI Proximity Early Warning Radar */}
      <ProximityEarlyWarningRadar phcId={phcId} phcName={phc.name} lang={lang} />

      {/* 2. Medicine Inventory Table */}
      <PHCInventorySection 
        stocks={detail.stocks} 
        selectedMedicine={selectedMedicine} 
        setSelectedMedicine={setSelectedMedicine} 
      />

      {/* 3. AI Predictive Stock Depletion Horizon Chart */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>Prophet AI 14-Day Stock Depletion Forecast: {selectedMedicine}</span>
          </div>
          <span className="badge badge-primary">Model: Prophet Additive Trend</span>
        </div>
        <StockDepletionChart forecastData={currentForecast} />
      </div>

      {/* 4. Bed Occupancy & Staffing Strength */}
      <PHCBedStaffSection bed={detail.bed_status} staff={detail.staff_summary} />

      {/* 5. Footfall Pattern & Diagnostic Alerts */}
      <PHCFootfallSection footfall={detail.footfall_trend} alerts={detail.active_alerts} />
    </div>
  );
}
