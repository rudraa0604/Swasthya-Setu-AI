import React, { useState, useEffect } from 'react';
import { 
  Wifi, WifiOff, UploadCloud, CheckCircle2, Pill, UserPlus, 
  Layers, RefreshCw, Stethoscope, AlertTriangle, Sparkles, 
  FileSpreadsheet, Search, Check, ShieldAlert, ArrowRight, UserCheck
} from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';
import ProximityEarlyWarningRadar from '../components/ProximityEarlyWarningRadar';
import PanelGuideBanner from '../components/PanelGuideBanner';

export default function PHCEdgeApp({ phcId = 'PHC-MH-NAS-01', lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [activeFormTab, setActiveFormTab] = useState('patient_opd'); // 'patient_opd', 'aggregate_footfall', 'medicine_stock', 'records_ledger'

  // --- Form State 1: Individual Patient OPD Consultation ---
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [villageName, setVillageName] = useState('Dindori Village');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['High Fever (>102°F)']);
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('Suspected Dengue Fever');
  const [rapidTestResult, setRapidTestResult] = useState('NS1 Antigen Positive (+)');
  const [prescribedMed, setPrescribedMed] = useState('Paracetamol 500mg');
  const [prescribedQty, setPrescribedQty] = useState(10);
  const [referralRequired, setReferralRequired] = useState(false);
  const [referralDestination, setReferralDestination] = useState('Nashik Civil Hospital');

  // --- Form State 2: Daily Medicine Dispensed Log ---
  const [selectedMedStock, setSelectedMedStock] = useState('Paracetamol 500mg');
  const [qtyStockUsed, setQtyStockUsed] = useState(25);
  const [stockBatchNo, setStockBatchNo] = useState('BATCH-2026-MH-42');

  // --- Form State 3: Daily Footfall Surveillance ---
  const [patientCount, setPatientCount] = useState(65);
  const [diseaseTag, setDiseaseTag] = useState('High Fever, Dengue symptoms, Body ache');

  // --- Clinical Consultation History Ledger ---
  const [patientLedger, setPatientLedger] = useState(() => {
    try {
      const saved = localStorage.getItem(`swasthya_phc_ledger_${phcId}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'OPD-101',
        time: '09:15 AM',
        name: 'Ganesh Gaikwad',
        age: 38,
        gender: 'Male',
        village: 'Dindori Sector 2',
        diagnosis: 'Suspected Dengue Fever',
        symptoms: 'High Fever (>102°F), Body ache, Platelets 48k',
        test: 'NS1 (+)',
        medicine: 'Paracetamol 500mg (10 tab), ORS (5 pkts)',
        referred: 'No',
        synced: true
      },
      {
        id: 'OPD-102',
        time: '09:42 AM',
        name: 'Sunita Patil',
        age: 29,
        gender: 'Female',
        village: 'Mhasrul Pada',
        diagnosis: 'Acute Gastroenteritis',
        symptoms: 'Vomiting, Watery Diarrhea, Dehydration',
        test: 'Clinical',
        medicine: 'ORS Sachet (10 pkts), IV Normal Saline 500ml',
        referred: 'No',
        synced: true
      },
      {
        id: 'OPD-103',
        time: '10:05 AM',
        name: 'Rohan Shinde',
        age: 12,
        gender: 'Male',
        village: 'Dindori Rural',
        diagnosis: 'Severe Dengue with Hemorrhage',
        symptoms: 'High Fever, Epistaxis (Nosebleed), Low BP',
        test: 'NS1 (+), Platelets 22k',
        medicine: 'IV Normal Saline 500ml',
        referred: 'Yes (Apollo / Civil Hospital ICU)',
        synced: true
      }
    ];
  });

  const updateQueueCount = () => {
    const queue = apiClient.getOfflineQueue();
    setQueueCount(queue.length);
  };

  useEffect(() => {
    updateQueueCount();
  }, []);

  const handleToggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Submit Individual OPD Consultation
  const handleSavePatientOPD = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name.');
      return;
    }

    const newRecord = {
      id: `OPD-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: patientName,
      age: Number(patientAge) || 28,
      gender: patientGender,
      village: villageName,
      diagnosis: provisionalDiagnosis,
      symptoms: selectedSymptoms.join(', '),
      test: rapidTestResult,
      medicine: `${prescribedMed} (${prescribedQty} units)`,
      referred: referralRequired ? `Yes (${referralDestination})` : 'No',
      synced: isOnline
    };

    const updatedLedger = [newRecord, ...patientLedger];
    setPatientLedger(updatedLedger);
    try {
      localStorage.setItem(`swasthya_phc_ledger_${phcId}`, JSON.stringify(updatedLedger));
    } catch (err) {
      console.warn(err);
    }

    // Queue or sync both consumption and patient footfall telemetry
    apiClient.enqueueOfflineItem('patient_opd_consultation', {
      phc_id: phcId,
      date: new Date().toISOString().split('T')[0],
      record: newRecord
    });

    apiClient.enqueueOfflineItem('consumption_log', {
      medicine_name: prescribedMed,
      date: new Date().toISOString().split('T')[0],
      quantity_used: Number(prescribedQty)
    });

    if (isOnline) {
      handleSync();
      setSyncStatus(`✅ Saved & Synced: Patient "${patientName}" consultation recorded. AI outbreak telemetry updated!`);
    } else {
      updateQueueCount();
      setSyncStatus(`Offline Queue: Patient "${patientName}" saved locally in IndexedDB buffer. Will auto-sync when online.`);
    }

    // Reset fields
    setPatientName('');
    setPatientAge('');
  };

  // Submit Daily Medicine Dispensation Log
  const handleRecordConsumption = () => {
    apiClient.enqueueOfflineItem('consumption_log', {
      medicine_name: selectedMedStock,
      date: new Date().toISOString().split('T')[0],
      quantity_used: Number(qtyStockUsed),
      batch_no: stockBatchNo
    });

    if (isOnline) {
      handleSync();
      setSyncStatus(`✅ Saved & Synced: ${qtyStockUsed} units of ${selectedMedStock} logged.`);
    } else {
      updateQueueCount();
      setSyncStatus(`Offline Queue: ${qtyStockUsed} units of ${selectedMedStock} queued locally in IndexedDB.`);
    }
  };

  // Submit Daily Outpatient Footfall
  const handleRecordFootfall = () => {
    apiClient.enqueueOfflineItem('patient_footfall', {
      date: new Date().toISOString().split('T')[0],
      patient_count: Number(patientCount),
      suspected_disease_tags: diseaseTag,
      is_outbreak_spike: patientCount > 80
    });

    if (isOnline) {
      handleSync();
      setSyncStatus(`✅ Daily surveillance updated: ${patientCount} patient footfalls synced to central database.`);
    } else {
      updateQueueCount();
      setSyncStatus(`Offline Queue: ${patientCount} patient footfalls buffered locally.`);
    }
  };

  const handleSync = async () => {
    try {
      setSyncStatus('Syncing queued telemetry to Cloud State Node...');
      const res = await apiClient.syncOfflineQueue(phcId);
      updateQueueCount();
      setSyncStatus(`✅ Successfully synced ${res.items_synced || queueCount} updates to central cloud database.`);
    } catch (e) {
      setSyncStatus(`❌ Sync error: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Friendly Explainer & Action Guide Banner */}
      <PanelGuideBanner role="edge" lang={lang} />

      {/* Top Banner with Direct Link to AI Outbreak Predictions */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fb923c', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            <Stethoscope size={14} /> CLINICAL DATA ENTRY & SURVEILLANCE TERMINAL
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#ffffff' }}>
            {phcId}: Local Clinic Daily Entry Station
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Data entered here automatically feeds the <strong>14-Day AI Outbreak Predictor</strong> and triggers early warnings.
          </div>
        </div>

        <button
          onClick={() => {
            window.location.hash = '#/portal/prediction';
          }}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.15rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
          }}
        >
          <Sparkles size={16} /> View AI Outbreak Predictions →
        </button>
      </div>

      {/* Connectivity & Offline IndexedDB Sync Bar */}
      <div className="panel" style={{ background: isOnline ? '#f0fdf4' : '#fffbeb', border: `2px solid ${isOnline ? '#86efac' : '#fde68a'}`, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isOnline ? <Wifi size={24} color="#16a34a" /> : <WifiOff size={24} color="#d97706" />}
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isOnline ? '#166534' : '#92400e' }}>
                {isOnline ? 'Edge Node Status: ONLINE (Connected to State Cloud)' : 'Edge Node Status: OFFLINE (Local Buffer Active)'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Facility: {phcId} • Local Queue: <strong>{queueCount}</strong> items pending commit • Works seamlessly without internet
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn-action ${isOnline ? 'btn-reject' : 'btn-primary'}`}
              onClick={() => setIsOnline(!isOnline)}
              style={{ fontSize: '0.8rem' }}
            >
              Simulate {isOnline ? 'Network Disconnect' : 'Reconnect'}
            </button>

            {isOnline && queueCount > 0 && (
              <button className="btn-action btn-approve" onClick={handleSync} style={{ fontSize: '0.8rem' }}>
                <UploadCloud size={14} /> {t.syncNow || 'Sync Now'} ({queueCount})
              </button>
            )}
          </div>
        </div>

        {syncStatus && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#0f172a', fontWeight: 600, background: 'rgba(255,255,255,0.9)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* AI Proximity Early Warning Radar */}
      <ProximityEarlyWarningRadar phcId={phcId} phcName={phcId} lang={lang} />

      {/* DATA ENTRY TAB SWITCHER */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        overflowX: 'auto',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem'
      }}>
        {[
          { id: 'patient_opd', label: '👤 New Patient Consultation (OPD)', icon: Stethoscope, badge: 'High Priority' },
          { id: 'records_ledger', label: `📋 Today's Patients Register (${patientLedger.length})`, icon: FileSpreadsheet, badge: null },
          { id: 'aggregate_footfall', label: '📊 Daily Surveillance Footfall', icon: UserPlus, badge: null },
          { id: 'medicine_stock', label: '💊 Daily Medicine Dispensation', icon: Pill, badge: null }
        ].map(tab => {
          const isActive = activeFormTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFormTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '8px',
                border: isActive ? '1px solid #ea580c' : '1px solid #cbd5e1',
                background: isActive ? '#ea580c' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(234, 88, 12, 0.25)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255,255,255,0.3)' : '#fee2e2',
                  color: isActive ? '#ffffff' : '#dc2626',
                  fontWeight: 800
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: INDIVIDUAL PATIENT OPD CONSULTATION FORM
         ========================================================================= */}
      {activeFormTab === 'patient_opd' && (
        <div className="panel" style={{ border: '1px solid #fed7aa', boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)' }}>
          <div className="panel-header" style={{ borderBottom: '1px solid #ffedd5', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
            <div className="panel-title">
              <Stethoscope size={22} color="#ea580c" />
              <span>Register Patient Encounter & Symptoms (Real-Time Syndromic Feed)</span>
            </div>
            <span className="badge badge-primary">Instant AI Prediction Update</span>
          </div>

          <form onSubmit={handleSavePatientOPD}>
            {/* Row 1: Patient Demographic Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kadam"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="115"
                  value={patientAge}
                  onChange={e => setPatientAge(e.target.value)}
                  placeholder="e.g. 34"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={e => setPatientGender(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Village / Mohalla Location
                </label>
                <input
                  type="text"
                  value={villageName}
                  onChange={e => setVillageName(e.target.value)}
                  placeholder="e.g. Dindori Sector 3"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Row 2: Chief Complaints & Symptoms Multi-Select Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>
                Observed Symptoms & Chief Complaints (Select All That Apply)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  'High Fever (>102°F)',
                  'Retro-orbital Pain / Headache',
                  'Severe Body Ache / Chills',
                  'Persistent Vomiting / Nausea',
                  'Watery Diarrhea / Dehydration',
                  'Hypoxia / Breathlessness',
                  'Skin Rash / Petechiae',
                  'Dog / Animal Bite Injury'
                ].map(sym => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => handleToggleSymptom(sym)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '999px',
                        border: isChecked ? '1px solid #ea580c' : '1px solid #cbd5e1',
                        background: isChecked ? '#fff7ed' : '#ffffff',
                        color: isChecked ? '#c2410c' : '#475569',
                        fontSize: '0.82rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {isChecked && <Check size={13} color="#ea580c" />}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Provisional Diagnosis & Diagnostic Test Result */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Provisional Disease Diagnosis *
                </label>
                <select
                  value={provisionalDiagnosis}
                  onChange={e => setProvisionalDiagnosis(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="Suspected Dengue Fever">🦟 Suspected Dengue Fever</option>
                  <option value="Confirmed Dengue (Hemorrhagic)">🚨 Confirmed Dengue (Hemorrhagic Shock)</option>
                  <option value="Malaria (Plasmodium Vivax / Falciparum)">🔬 Malaria (Pv / Pf)</option>
                  <option value="Acute Gastroenteritis / Diarrhea">💧 Acute Gastroenteritis / Diarrhea</option>
                  <option value="Acute Respiratory Infection (ARI)">🫁 Acute Respiratory Infection (ARI / Flu)</option>
                  <option value="Suspected Typhoid (Enteric Fever)">🌡️ Suspected Typhoid (Enteric)</option>
                  <option value="Animal / Dog Bite (Rabies Protocol)">🐕 Dog Bite Injury (Anti-Rabies Required)</option>
                  <option value="Non-Infectious / General Ailment">🩺 General Ailment / Hypertension</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Rapid Diagnostic Test (RDT) Result
                </label>
                <select
                  value={rapidTestResult}
                  onChange={e => setRapidTestResult(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="NS1 Antigen Positive (+)">Dengue NS1 Antigen (+ Positive)</option>
                  <option value="Malaria Pv/Pf Positive (+)">Malaria Rapid Kit (+ Positive)</option>
                  <option value="Negative (-)">Test Result Negative (-)</option>
                  <option value="Awaiting Lab Confirmation">Awaiting District Lab Confirmation</option>
                  <option value="Not Tested (Symptomatic Clinical)">Not Tested (Clinical Presumption)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Treatment Dispensation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Primary Medicine Prescribed & Dispensed
                </label>
                <select
                  value={prescribedMed}
                  onChange={e => setPrescribedMed(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Paracetamol 500mg">Paracetamol 500mg Tablets</option>
                  <option value="IV Normal Saline 500ml">IV Normal Saline 500ml Bottle</option>
                  <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
                  <option value="Amoxicillin 250mg">Amoxicillin 250mg Capsules</option>
                  <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies Dose)</option>
                  <option value="Doxycycline 100mg">Doxycycline 100mg Tablets</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Quantity Dispensed
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={prescribedQty}
                  onChange={e => setPrescribedQty(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#0f172a' }}>
                  Referral to Hospital Needed?
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="referCheck"
                    checked={referralRequired}
                    onChange={e => setReferralRequired(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="referCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    Critical Case: Refer to Civil / Private Hospital
                  </label>
                </div>
              </div>
            </div>

            {referralRequired && (
              <div style={{ marginBottom: '1.25rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem', borderRadius: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem', color: '#991b1b' }}>
                  Select Referral Hospital:
                </label>
                <select
                  value={referralDestination}
                  onChange={e => setReferralDestination(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #fca5a5', fontSize: '0.9rem' }}
                >
                  <option value="Nashik District Civil Hospital (Govt)">Nashik District Civil Hospital (Govt - 320 Beds)</option>
                  <option value="Apollo Super Speciality Hospital (Private ICU)">Apollo Super Speciality Hospital (Private ICU - 45 ICU Beds)</option>
                  <option value="Sahyadri Super Speciality Hospital">Sahyadri Super Speciality Hospital (Private)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn-action btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 800,
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              <CheckCircle2 size={18} /> Submit Consultation & Recalculate AI Prediction ({isOnline ? 'Online Sync' : 'Offline Queue'})
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TODAY'S CLINICAL PATIENT LEDGER
         ========================================================================= */}
      {activeFormTab === 'records_ledger' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileSpreadsheet size={20} color="#ea580c" />
              <span>Today's Local Outpatient (OPD) Consultations Register</span>
            </div>
            <span className="badge badge-green">{patientLedger.length} Records Ingested</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
            All patient records entered at this terminal. These records continuously calibrate the localized <strong>Early Warning Radar</strong> and <strong>Prophet 14-day stock depletion model</strong>.
          </p>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Encounter ID</th>
                  <th>Time</th>
                  <th>Patient Name</th>
                  <th>Age/Gender</th>
                  <th>Village / Sector</th>
                  <th>Diagnosis</th>
                  <th>RDT Test</th>
                  <th>Medicine Dispensed</th>
                  <th>Referral</th>
                </tr>
              </thead>
              <tbody>
                {patientLedger.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#ea580c' }}>{row.id}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{row.time}</td>
                    <td style={{ fontWeight: 700 }}>{row.name}</td>
                    <td>{row.age}y / {row.gender}</td>
                    <td>{row.village}</td>
                    <td>
                      <span className={`badge ${row.diagnosis.includes('Dengue') ? 'badge-red' : (row.diagnosis.includes('Gastro') ? 'badge-yellow' : 'badge-primary')}`}>
                        {row.diagnosis}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{row.test}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{row.medicine}</td>
                    <td>
                      <span className={`badge ${row.referred.startsWith('Yes') ? 'badge-red' : 'badge-green'}`}>
                        {row.referred}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DAILY SURVEILLANCE FOOTFALL (AGGREGATE)
         ========================================================================= */}
      {activeFormTab === 'aggregate_footfall' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <UserPlus size={20} color="#ea580c" />
              <span>Daily Outpatient Attendance & Epidemiological Footfall Counter</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Total Patients Attended Today
              </label>
              <input 
                type="number" 
                value={patientCount} 
                onChange={e => setPatientCount(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: patientCount > 80 ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                {patientCount > 80 ? '⚠️ Epidemic Surge: Exceeds 80 patients/day threshold' : 'Normal operating attendance'}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Common Illnesses / Syndromic Tags Observed
              </label>
              <input 
                type="text" 
                value={diseaseTag} 
                onChange={e => setDiseaseTag(e.target.value)}
                placeholder="e.g. High Fever, Dengue, Diarrhea"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button 
            className="btn-action btn-primary" 
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontWeight: 800 }}
            onClick={handleRecordFootfall}
          >
            <CheckCircle2 size={16} /> Save Daily Footfall Report ({isOnline ? 'Direct Cloud Commit' : 'Offline Queue'})
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MEDICINE DISPENSATION LOG
         ========================================================================= */}
      {activeFormTab === 'medicine_stock' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Pill size={20} color="#ea580c" />
              <span>Daily Bulk Medicine Dispensation & Stock Buffer Log</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Select Essential Medicine
              </label>
              <select 
                value={selectedMedStock} 
                onChange={e => setSelectedMedStock(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
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
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Total Quantity Dispensed Today
              </label>
              <input 
                type="number" 
                value={qtyStockUsed} 
                onChange={e => setQtyStockUsed(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Lot / Batch Number
              </label>
              <input 
                type="text" 
                value={stockBatchNo} 
                onChange={e => setStockBatchNo(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button 
            className="btn-action btn-primary" 
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontWeight: 800 }}
            onClick={handleRecordConsumption}
          >
            <CheckCircle2 size={16} /> Save Medicine Usage ({isOnline ? 'Online Sync' : 'Offline Queue'})
          </button>
        </div>
      )}
    </div>
  );
}
