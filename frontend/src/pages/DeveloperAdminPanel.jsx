import React, { useState, useEffect } from 'react';
import { 
  Code, Database, Plus, Edit2, Trash2, Zap, RefreshCw, CheckCircle2, 
  AlertTriangle, ShieldAlert, Cpu, Layers, MapPin, Building, Pill, Sliders 
} from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

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

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 5000);
  };

  // PHC CRUD Handlers
  const handleSavePHC = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingPhcId) {
        await apiClient.updatePHC(editingPhcId, phcForm);
        notify(`✅ PHC ${editingPhcId} updated successfully.`);
        setEditingPhcId(null);
      } else {
        await apiClient.createPHC(phcForm);
        notify(`✅ Created new PHC: ${phcForm.name} (${phcForm.id}).`);
      }
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
      await loadData();
    } catch (err) {
      notify(`❌ Error saving PHC: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPHC = (phc) => {
    setEditingPhcId(phc.id);
    setPhcForm({
      id: phc.id,
      name: phc.name,
      district_id: phc.district_id,
      district_name: phc.district_name,
      state_id: phc.state_id,
      state_name: phc.state_name,
      lat: phc.lat,
      lng: phc.lng,
      sanctioned_staff_count: phc.sanctioned_staff_count
    });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleDeletePHC = async (id) => {
    if (!window.confirm(`Are you sure you want to delete PHC ${id}?`)) return;
    try {
      setLoading(true);
      await apiClient.deletePHC(id);
      notify(`🗑️ Deleted PHC ${id}.`);
      await loadData();
    } catch (err) {
      notify(`❌ Error deleting PHC: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Stock CRUD Handler
  const handleSaveStock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiClient.addOrUpdateStock(stockForm);
      notify(`✅ Stock updated: ${stockForm.medicine_name} at ${stockForm.phc_id} (${stockForm.quantity} units).`);
      await loadData();
    } catch (err) {
      notify(`❌ Error updating stock: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Stress Test Trigger
  const handleTriggerOutbreak = async () => {
    try {
      setLoading(true);
      const res = await apiClient.triggerOutbreakStressTest(stressForm);
      notify(`⚡ ${res.message}`);
      await loadData();
    } catch (err) {
      notify(`❌ Stress test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetHealthy = async () => {
    try {
      setLoading(true);
      const res = await apiClient.resetAllStocksHealthy();
      notify(`🌿 ${res.message}`);
      await loadData();
    } catch (err) {
      notify(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm("Are you sure you want to completely re-seed the database? This resets all simulated data.")) return;
    try {
      setLoading(true);
      const res = await apiClient.reseedDatabase();
      notify(`🔄 ${res.message}`);
      await loadData();
    } catch (err) {
      notify(`❌ Error re-seeding: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Code size={28} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Developer & Master Admin Control Console</h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Live Database Inspection • Dynamic Entity CRUD • Real-Time Outbreak Stress Testing • ML Engine Tuning
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-action" style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 700 }} onClick={loadData}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Telemetry
            </button>
          </div>
        </div>

        {/* Live Overview Cards */}
        {overview && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL PHC FACILITIES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{overview.total_phcs}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL MEDICINE STOCKS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80' }}>{overview.total_stock_records}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ACTIVE ALERTS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>{overview.total_active_alerts}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PENDING TRANSFERS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>{overview.pending_transfers}</div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Banner */}
      {notification && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {notification}
        </div>
      )}

      {/* Dev Navigation Tabs */}
      <div className="nav-tabs" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`nav-tab-btn ${activeDevTab === 'phcs' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('phcs')}
        >
          <Building size={15} /> PHC Facility Manager (CRUD)
        </button>

        <button
          className={`nav-tab-btn ${activeDevTab === 'stocks' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('stocks')}
        >
          <Pill size={15} /> Inventory & Stock Adjuster
        </button>

        <button
          className={`nav-tab-btn ${activeDevTab === 'stress' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('stress')}
        >
          <Zap size={15} /> Outbreak & Stress Simulator
        </button>

        <button
          className={`nav-tab-btn ${activeDevTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveDevTab('system')}
        >
          <Cpu size={15} /> ML Engines & DB Reset
        </button>
      </div>

      {/* TAB 1: PHC FACILITY CRUD */}
      {activeDevTab === 'phcs' && (
        <div>
          {/* Add / Edit Form */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <Building size={20} color="#0284c7" />
                <span>{editingPhcId ? `Edit Facility: ${editingPhcId}` : 'Register New PHC / CHC Facility'}</span>
              </div>
              {editingPhcId && (
                <button className="btn-action btn-reject" onClick={() => setEditingPhcId(null)}>
                  Cancel Editing
                </button>
              )}
            </div>

            <form onSubmit={handleSavePHC}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>PHC ID (e.g. PHC-MH-PUN-11)</label>
                  <input
                    type="text"
                    value={phcForm.id}
                    onChange={(e) => setPhcForm({ ...phcForm, id: e.target.value })}
                    required
                    disabled={!!editingPhcId}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>PHC Name</label>
                  <input
                    type="text"
                    value={phcForm.name}
                    onChange={(e) => setPhcForm({ ...phcForm, name: e.target.value })}
                    required
                    placeholder="e.g. Baramati Community Sub-center"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>District Name</label>
                  <input
                    type="text"
                    value={phcForm.district_name}
                    onChange={(e) => setPhcForm({ ...phcForm, district_name: e.target.value, district_id: `DIST-${e.target.value.substring(0,3).toUpperCase()}` })}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>State Selection</label>
                  <select
                    value={phcForm.state_id}
                    onChange={(e) => {
                      const sName = e.target.value === 'ST-MH' ? 'Maharashtra (Simulated)' : (e.target.value === 'ST-KA' ? 'Karnataka (Simulated)' : 'Uttar Pradesh (Simulated)');
                      setPhcForm({ ...phcForm, state_id: e.target.value, state_name: sName });
                    }}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="ST-MH">Maharashtra (ST-MH)</option>
                    <option value="ST-KA">Karnataka (ST-KA)</option>
                    <option value="ST-UP">Uttar Pradesh (ST-UP)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Latitude / Longitude</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      step="0.0001"
                      value={phcForm.lat}
                      onChange={(e) => setPhcForm({ ...phcForm, lat: parseFloat(e.target.value) })}
                      style={{ width: '50%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={phcForm.lng}
                      onChange={(e) => setPhcForm({ ...phcForm, lng: parseFloat(e.target.value) })}
                      style={{ width: '50%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sanctioned Staff Count</label>
                  <input
                    type="number"
                    value={phcForm.sanctioned_staff_count}
                    onChange={(e) => setPhcForm({ ...phcForm, sanctioned_staff_count: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-action btn-primary"
                style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', fontWeight: 700 }}
              >
                <Plus size={16} /> {editingPhcId ? 'Save Changes' : 'Register Facility'}
              </button>
            </form>
          </div>

          {/* PHC Table */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <span>Existing Monitored Facilities ({phcs.length} total)</span>
              </div>
            </div>

            <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Facility ID</th>
                    <th>Name</th>
                    <th>District</th>
                    <th>State</th>
                    <th>Coordinates</th>
                    <th>Staff</th>
                    <th>Developer Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {phcs.slice(0, 30).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>{p.id}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.district_name}</td>
                      <td>{p.state_name.split(' ')[0]}</td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.lat}, {p.lng}</td>
                      <td>{p.sanctioned_staff_count}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn-action btn-reject" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleEditPHC(p)}>
                            <Edit2 size={12} /> Edit
                          </button>
                          <button className="btn-action btn-reject" style={{ padding: '0.25rem 0.5rem', color: '#dc2626' }} onClick={() => handleDeletePHC(p.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK TUNER */}
      {activeDevTab === 'stocks' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Pill size={20} color="#0284c7" />
              <span>Medicine Stock & Buffer Adjuster</span>
            </div>
          </div>

          <form onSubmit={handleSaveStock}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Target PHC</label>
                <select
                  value={stockForm.phc_id}
                  onChange={(e) => setStockForm({ ...stockForm, phc_id: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  {phcs.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Medicine Name</label>
                <select
                  value={stockForm.medicine_name}
                  onChange={(e) => setStockForm({ ...stockForm, medicine_name: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                  <option value="Amoxicillin 250mg">Amoxicillin 250mg</option>
                  <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
                  <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies)</option>
                  <option value="Insulin Regular 40IU">Insulin Regular 40IU</option>
                  <option value="IV Normal Saline 500ml">IV Normal Saline 500ml</option>
                  <option value="Doxycycline 100mg">Doxycycline 100mg</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Current Quantity on Hand</label>
                <input
                  type="number"
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Buffer Safety Threshold</label>
                <input
                  type="number"
                  value={stockForm.buffer_threshold}
                  onChange={(e) => setStockForm({ ...stockForm, buffer_threshold: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Avg Daily Consumption (units/day)</label>
                <input
                  type="number"
                  step="0.5"
                  value={stockForm.daily_consumption_avg}
                  onChange={(e) => setStockForm({ ...stockForm, daily_consumption_avg: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Batch Expiry Date</label>
                <input
                  type="date"
                  value={stockForm.expiry_date}
                  onChange={(e) => setStockForm({ ...stockForm, expiry_date: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-action btn-primary"
              style={{ marginTop: '1.25rem', padding: '0.6rem 1.25rem', fontWeight: 700 }}
            >
              <CheckCircle2 size={16} /> Save Stock Telemetry
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: OUTBREAK & STRESS SIMULATOR */}
      {activeDevTab === 'stress' && (
        <div className="panel" style={{ border: '2px solid #ef4444' }}>
          <div className="panel-header" style={{ borderBottomColor: '#fecaca' }}>
            <div className="panel-title" style={{ color: '#dc2626' }}>
              <Zap size={20} color="#dc2626" />
              <span>Real-Time Outbreak & Supply Shock Injector</span>
            </div>
            <span className="badge badge-red">Stress Test Engine</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
            Simulate sudden epidemic spikes in any district. This will inject patient footfall surges, rapidly deplete essential medicines, trigger multi-factor early warnings, and automatically test the PuLP redistribution optimizer.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#fef2f2', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>Target Outbreak District</label>
              <select
                value={stressForm.district_name}
                onChange={(e) => setStressForm({ ...stressForm, district_name: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #fca5a5' }}
              >
                <option value="Nashik">Nashik (Maharashtra)</option>
                <option value="Pune">Pune (Maharashtra)</option>
                <option value="Nagpur">Nagpur (Maharashtra)</option>
                <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
                <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
                <option value="Mysuru">Mysuru (Karnataka)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>Footfall Surge Multiplier</label>
              <select
                value={stressForm.surge_multiplier}
                onChange={(e) => setStressForm({ ...stressForm, surge_multiplier: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #fca5a5' }}
              >
                <option value={2.0}>2.0x Surge (Mild Outbreak)</option>
                <option value={3.5}>3.5x Surge (Severe Epidemic)</option>
                <option value={5.0}>5.0x Surge (Catastrophic Health Shock)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>Primary Deficit Medicine</label>
              <select
                value={stressForm.target_medicine}
                onChange={(e) => setStressForm({ ...stressForm, target_medicine: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #fca5a5' }}
              >
                <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                <option value="IV Normal Saline 500ml">IV Normal Saline 500ml</option>
                <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
                <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>Disease Tag Annotation</label>
              <input
                type="text"
                value={stressForm.disease_tags}
                onChange={(e) => setStressForm({ ...stressForm, disease_tags: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #fca5a5' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn-action btn-approve"
              style={{ background: '#dc2626', padding: '0.75rem 1.5rem', fontWeight: 800 }}
              onClick={handleTriggerOutbreak}
              disabled={loading}
            >
              <Zap size={16} /> INJECT OUTBREAK STRESS TEST
            </button>

            <button
              className="btn-action btn-approve"
              style={{ padding: '0.75rem 1.25rem' }}
              onClick={handleResetHealthy}
              disabled={loading}
            >
              <CheckCircle2 size={16} /> Reset All Stocks to Safe Surplus
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM ENGINES & DB RE-SEED */}
      {activeDevTab === 'system' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Database size={20} color="#0284c7" />
              <span>AI System Engines & Database Re-seeding</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Demand Forecasting Engine</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
                Multi-horizon (7, 14, 30-day) time-series forecasting with day-of-week seasonality, trend regression, and depletion trajectory estimation.
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>PuLP Redistribution Optimizer</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
                Linear programming transportation solver matching surplus facilities to shortage nodes under distance and shelf-life constraints.
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Federated Learning Coordinator</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
                Coordinates Flower-compatible FedAvg weight sharing across 3 simulated state nodes with strict zero-raw-data guarantees.
              </div>
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
              Factory Reset / Full Database Re-Seed
            </div>
            <p style={{ fontSize: '0.8rem', color: '#78350f', marginBottom: '1rem' }}>
              Wipes all existing SQLite tables and re-seeds 150 PHCs across Maharashtra, Karnataka, and Uttar Pradesh with 60 days of clean time-series history and the default Nashik outbreak scenario.
            </p>

            <button
              className="btn-action btn-reject"
              style={{ background: '#d97706', color: '#ffffff', fontWeight: 700, padding: '0.65rem 1.25rem' }}
              onClick={handleReseed}
              disabled={loading}
            >
              <RefreshCw size={15} /> Re-Seed Complete 150-PHC Database
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
