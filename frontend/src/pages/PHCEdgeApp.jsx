import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, UploadCloud, CheckCircle2, Pill, UserPlus, Layers, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function PHCEdgeApp({ phcId = 'PHC-MH-NAS-01', lang }) {
  const t = translations[lang] || translations.en;
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  
  // Form states
  const [selectedMed, setSelectedMed] = useState('Paracetamol 500mg');
  const [qtyUsed, setQtyUsed] = useState(15);
  const [patientCount, setPatientCount] = useState(25);
  const [diseaseTag, setDiseaseTag] = useState('Fever, Dehydration');

  const updateQueueCount = () => {
    const queue = apiClient.getOfflineQueue();
    setQueueCount(queue.length);
  };

  useEffect(() => {
    updateQueueCount();
  }, []);

  const handleRecordConsumption = () => {
    if (isOnline) {
      // Direct API call
      apiClient.enqueueOfflineItem('consumption_log', {
        medicine_name: selectedMed,
        date: new Date().toISOString().split('T')[0],
        quantity_used: Number(qtyUsed)
      });
      handleSync();
    } else {
      // Offline Enqueue
      apiClient.enqueueOfflineItem('consumption_log', {
        medicine_name: selectedMed,
        date: new Date().toISOString().split('T')[0],
        quantity_used: Number(qtyUsed)
      });
      updateQueueCount();
      setSyncStatus(`Offline: ${qtyUsed} units of ${selectedMed} queued locally in IndexedDB.`);
    }
  };

  const handleRecordFootfall = () => {
    apiClient.enqueueOfflineItem('patient_footfall', {
      date: new Date().toISOString().split('T')[0],
      patient_count: Number(patientCount),
      suspected_disease_tags: diseaseTag,
      is_outbreak_spike: patientCount > 80
    });
    if (isOnline) {
      handleSync();
    } else {
      updateQueueCount();
      setSyncStatus(`Offline: ${patientCount} patient footfalls queued locally.`);
    }
  };

  const handleSync = async () => {
    try {
      setSyncStatus('Syncing queued telemetry to Cloud State Node...');
      const res = await apiClient.syncOfflineQueue(phcId);
      updateQueueCount();
      setSyncStatus(`✅ Successfully synced ${res.items_synced} updates to central database.`);
    } catch (e) {
      setSyncStatus(`❌ Sync error: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Connectivity & Sync Status Bar */}
      <div className="panel" style={{ background: isOnline ? '#f0fdf4' : '#fffbeb', border: `2px solid ${isOnline ? '#86efac' : '#fde68a'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isOnline ? <Wifi size={24} color="#16a34a" /> : <WifiOff size={24} color="#d97706" />}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isOnline ? '#166534' : '#92400e' }}>
                {isOnline ? 'Edge Node Status: ONLINE (Connected)' : 'Edge Node Status: OFFLINE (Local Buffer Active)'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Facility: {phcId} • Local Queue: {queueCount} items pending cloud commit
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn-action ${isOnline ? 'btn-reject' : 'btn-primary'}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              Simulate {isOnline ? 'Network Disconnect' : 'Reconnect'}
            </button>

            {isOnline && queueCount > 0 && (
              <button className="btn-action btn-approve" onClick={handleSync}>
                <UploadCloud size={14} /> {t.syncNow} ({queueCount})
              </button>
            )}
          </div>
        </div>

        {syncStatus && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#0f172a', fontWeight: 500, background: 'rgba(255,255,255,0.8)', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* Quick Entry Form 1: Medicine Dispensation */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Pill size={20} color="#0284c7" />
            <span>Fast Medicine Dispensation / Daily Log</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Select Medicine
            </label>
            <select 
              value={selectedMed} 
              onChange={e => setSelectedMed(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="Paracetamol 500mg">Paracetamol 500mg</option>
              <option value="Amoxicillin 250mg">Amoxicillin 250mg</option>
              <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
              <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies)</option>
              <option value="IV Normal Saline 500ml">IV Normal Saline 500ml</option>
              <option value="Doxycycline 100mg">Doxycycline 100mg</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Quantity Dispensed / Used
            </label>
            <input 
              type="number" 
              value={qtyUsed} 
              onChange={e => setQtyUsed(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <button 
          className="btn-action btn-primary" 
          style={{ width: '100%', marginTop: '1rem', padding: '0.65rem', justifyContent: 'center' }}
          onClick={handleRecordConsumption}
        >
          <CheckCircle2 size={16} /> Log Consumption ({isOnline ? 'Online Sync' : 'Offline Queue'})
        </button>
      </div>

      {/* Quick Entry Form 2: Daily Outpatient Footfall */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <UserPlus size={20} color="#0284c7" />
            <span>Daily Outpatient (OPD) Footfall & Syndromic Surveillance</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Total Patient Footfall Count
            </label>
            <input 
              type="number" 
              value={patientCount} 
              onChange={e => setPatientCount(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Suspected Syndromic Disease Tags
            </label>
            <input 
              type="text" 
              value={diseaseTag} 
              onChange={e => setDiseaseTag(e.target.value)}
              placeholder="e.g. Viral Fever, Dengue, Diarrhea"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <button 
          className="btn-action btn-primary" 
          style={{ width: '100%', marginTop: '1rem', padding: '0.65rem', justifyContent: 'center' }}
          onClick={handleRecordFootfall}
        >
          <CheckCircle2 size={16} /> Record Outpatient Telemetry
        </button>
      </div>
    </div>
  );
}
