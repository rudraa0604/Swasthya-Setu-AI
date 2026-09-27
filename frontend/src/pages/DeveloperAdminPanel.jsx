import React, { useState, useEffect } from 'react';
import { 
  Code, Building, Pill, Zap, Sliders, CheckCircle2, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';
import DevOverviewKpiSection from '../components/sections/dev_panel/DevOverviewKpiSection';
import PhcManagerSection from '../components/sections/dev_panel/PhcManagerSection';
import StockManagerSection from '../components/sections/dev_panel/StockManagerSection';
import OutbreakSimulatorSection from '../components/sections/dev_panel/OutbreakSimulatorSection';
import SystemMaintenanceSection from '../components/sections/dev_panel/SystemMaintenanceSection';

export default function DeveloperAdminPanel({ lang }) {
  const t = translations[lang] || translations.en;
  
  const [activeDevTab, setActiveDevTab] = useState('phcs'); // 'phcs', 'stocks', 'stress', 'system'
  const [overview, setOverview] = useState(null);
  const [phcs, setPhcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // PHC Form States
  const [phcForm, setPhcForm] = useState({
    id: '',
    name: '',
    district_id: 'DIST-NAS',
    district_name: 'Nashik',
    state_id: 'ST-MH',
    state_name: 'Maharashtra (Simulated)',
    lat: 19.9975,
    lng: 73.7898,
    sanctioned_staff_count: 10
  });
  const [editingPhcId, setEditingPhcId] = useState(null);

  // Stock Form States
  const [stockForm, setStockForm] = useState({
    phc_id: 'PHC-MH-NAS-01',
    medicine_name: 'Paracetamol 500mg',
    batch_id: 'BAT-DEV-101',
    quantity: 500,
    buffer_threshold: 200,
    daily_consumption_avg: 25.0,
    expiry_date: '2027-12-31'
  });

  // Outbreak Stress Test Form
  const [stressForm, setStressForm] = useState({
    district_name: 'Nashik',
    surge_multiplier: 3.5,
    disease_tags: 'Dengue Fever, Viral Outbreak, Dehydration',
    target_medicine: 'Paracetamol 500mg',
    target_stock_reduction_pct: 85
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [oData, pData] = await Promise.all([
        apiClient.getDevOverview(),
        apiClient.getPHCs()
      ]);
      setOverview(oData);
      setPhcs(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  // PHC Handlers
  const handleSavePHC = async () => {
    try {
      setLoading(true);
      if (editingPhcId) {
        await apiClient.updatePHC(editingPhcId, phcForm);
        showToast(`PHC ${editingPhcId} updated successfully.`);
      } else {
        await apiClient.createPHC(phcForm);
        showToast(`PHC ${phcForm.id} registered into database.`);
      }
      setEditingPhcId(null);
      setPhcForm({
        id: '',
        name: '',
        district_id: 'DIST-NAS',
        district_name: 'Nashik',
        state_id: 'ST-MH',
        state_name: 'Maharashtra (Simulated)',
        lat: 19.9975,
        lng: 73.7898,
        sanctioned_staff_count: 10
      });
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPHC = (p) => {
    setEditingPhcId(p.id);
    setPhcForm({
      id: p.id,
      name: p.name,
      district_id: p.district_id,
      district_name: p.district_name,
      state_id: p.state_id,
      state_name: p.state_name,
      lat: p.lat,
      lng: p.lng,
      sanctioned_staff_count: p.sanctioned_staff_count
    });
    setActiveDevTab('phcs');
  };

  const handleDeletePHC = async (phcId) => {
    if (!window.confirm(`Are you sure you want to delete ${phcId}?`)) return;
    try {
      setLoading(true);
      await apiClient.deletePHC(phcId);
      showToast(`PHC ${phcId} deleted.`);
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Stock Handlers
  const handleSaveStock = async () => {
    try {
      setLoading(true);
      await apiClient.addOrUpdateStock(stockForm);
      showToast(`Stock updated for ${stockForm.medicine_name} at ${stockForm.phc_id}`);
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Outbreak Simulation Handler
  const handleTriggerStressOutbreak = async () => {
    try {
      setLoading(true);
      const res = await apiClient.triggerOutbreakStressTest(stressForm);
      showToast(`Outbreak Stress Test Injected: ${res.message || 'Complete'}`);
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset & Reseed Handlers
  const handleResetHealthy = async () => {
    try {
      setLoading(true);
      await apiClient.resetAllStocksHealthy();
      showToast('All PHC medicine inventories restored to safe buffer levels.');
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReseedDatabase = async () => {
    if (!window.confirm('Reset and re-seed the entire database with pristine demonstration data?')) return;
    try {
      setLoading(true);
      await apiClient.reseedDatabase();
      showToast('Database re-seeded successfully.');
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFederatedRound = async () => {
    try {
      setLoading(true);
      const res = await apiClient.runFederatedSimulation(5);
      showToast(`Federated Round Complete: Global Loss ${res.new_global_loss} (${res.accuracy_improvement})`);
      loadData();
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#020617', minHeight: '85vh', padding: '1.25rem', borderRadius: '12px', color: '#f8fafc' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#0284c7', padding: '0.6rem', borderRadius: '10px' }}>
            <Code size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 800, margin: 0 }}>
              Master Developer & Architect Control Panel
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              SwasthyaSetu AI Core • Direct Schema CRUD & Disruption Stress-Testing
            </div>
          </div>
        </div>

        <button 
          className="btn-action" 
          style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155' }}
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div style={{ background: '#0369a1', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* KPI Overview Section */}
      <DevOverviewKpiSection overview={overview} phcs={phcs} />

      {/* Dev Control Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`nav-tab-btn ${activeDevTab === 'phcs' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('phcs')}
          style={{ background: activeDevTab === 'phcs' ? '#0284c7' : '#1e293b', color: '#f8fafc' }}
        >
          <Building size={15} /> PHC Facility CRUD ({phcs.length})
        </button>
        <button 
          className={`nav-tab-btn ${activeDevTab === 'stocks' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('stocks')}
          style={{ background: activeDevTab === 'stocks' ? '#0284c7' : '#1e293b', color: '#f8fafc' }}
        >
          <Pill size={15} /> Stock Buffers
        </button>
        <button 
          className={`nav-tab-btn ${activeDevTab === 'stress' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('stress')}
          style={{ background: activeDevTab === 'stress' ? '#0284c7' : '#1e293b', color: '#f8fafc' }}
        >
          <Zap size={15} /> Outbreak Simulator
        </button>
        <button 
          className={`nav-tab-btn ${activeDevTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('system')}
          style={{ background: activeDevTab === 'system' ? '#0284c7' : '#1e293b', color: '#f8fafc' }}
        >
          <Sliders size={15} /> Database & Models
        </button>
      </div>

      {/* Tab Panels */}
      {activeDevTab === 'phcs' && (
        <PhcManagerSection 
          phcs={phcs}
          phcForm={phcForm}
          setPhcForm={setPhcForm}
          editingPhcId={editingPhcId}
          setEditingPhcId={setEditingPhcId}
          handleSavePHC={handleSavePHC}
          handleEditPHC={handleEditPHC}
          handleDeletePHC={handleDeletePHC}
          loading={loading}
        />
      )}

      {activeDevTab === 'stocks' && (
        <StockManagerSection 
          phcs={phcs}
          stockForm={stockForm}
          setStockForm={setStockForm}
          handleSaveStock={handleSaveStock}
          loading={loading}
        />
      )}

      {activeDevTab === 'stress' && (
        <OutbreakSimulatorSection 
          stressForm={stressForm}
          setStressForm={setStressForm}
          handleTriggerStressOutbreak={handleTriggerStressOutbreak}
          loading={loading}
        />
      )}

      {activeDevTab === 'system' && (
        <SystemMaintenanceSection 
          handleResetHealthy={handleResetHealthy}
          handleReseedDatabase={handleReseedDatabase}
          handleRunFederatedRound={handleRunFederatedRound}
          loading={loading}
        />
      )}
    </div>
  );
}
