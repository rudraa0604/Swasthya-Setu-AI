import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, Activity, Truck, 
  MapPin, Clock, CheckCircle2, ChevronRight, Zap, Flame, Droplets, HeartPulse, Sparkles, PlusCircle, X
} from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';

export default function ProximityEarlyWarningRadar({ 
  phcId = "PHC-MH-NAS-01", 
  phcName = "Local Clinic",
  onNavigateToRoute,
  lang = "en"
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState({});
  const [showSimModal, setShowSimModal] = useState(false);
  const [simType, setSimType] = useState('road_accident');
  const [simTitle, setSimTitle] = useState('Highway Multi-Vehicle Crash on NH-60');
  const [simCasualties, setSimCasualties] = useState(30);
  const [simRadius, setSimRadius] = useState(20);
  const [simStatus, setSimStatus] = useState(null);

  const loadProximityWarnings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getProximityEarlyWarnings(phcId);
      setData(res);
    } catch (e) {
      console.error('Failed to load proximity early warnings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProximityWarnings();
    const interval = setInterval(loadProximityWarnings, 15000);
    return () => clearInterval(interval);
  }, [phcId]);

  const handleAcknowledge = (id) => {
    setAcknowledged(prev => ({ ...prev, [id]: true }));
  };

  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    setSimStatus('Broadcasting AI warning to nearby clinics...');
    try {
      await apiClient.reportEmergencyIncident({
        title: simTitle,
        incident_type: simType,
        location_name: "Highway Junction / Nearby Industrial Sector",
        lat: 20.02,
        lng: 73.80,
        severity: "critical",
        estimated_casualties: Number(simCasualties),
        affected_radius_km: Number(simRadius),
        disease_or_trauma_type: simType === 'road_accident' ? 'Mass Trauma & Blood Loss' : 
                               (simType === 'flood_waterborne' ? 'Acute Diarrhea & Dehydration' : 
                               (simType === 'chemical_leak' ? 'Respiratory Distress & Chemical Burns' : 'Emergency Food Poisoning')),
        recommended_supplies: simType === 'road_accident' ? ['IV Normal Saline 500ml', 'Anti-Tetanus Toxoid', 'Trauma Dressing Bandages'] : ['ORS Sachet (Oral Rehydration Salts)', 'Amoxicillin 250mg', 'IV Normal Saline 500ml'],
        recommended_beds: 8
      });
      setSimStatus('Alert broadcasted successfully!');
      setShowSimModal(false);
      loadProximityWarnings();
    } catch (e) {
      setSimStatus('Failed to broadcast simulation.');
    }
  };

  if (loading && !data) {
    return (
      <div className="panel" style={{ padding: '1.25rem', textAlign: 'center', color: '#94a3b8' }}>
        <Activity size={20} className="spin" style={{ margin: '0 auto 8px auto', display: 'block', color: '#ea580c' }} />
        <span>Scanning nearby area for disease outbreaks and emergency events...</span>
      </div>
    );
  }

  const diseaseAlerts = data?.nearby_disease_spread_alerts || [];
  const incidentAlerts = data?.nearby_incident_alerts || [];
  const totalThreats = (diseaseAlerts.length + incidentAlerts.length);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Top Banner Card */}
      <div 
        className="panel" 
        style={{ 
          background: totalThreats > 0 ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : '#ffffff',
          border: totalThreats > 0 ? '2px solid #ef4444' : '1px solid #e2e8f0',
          boxShadow: totalThreats > 0 ? '0 6px 20px rgba(220, 38, 38, 0.25)' : 'var(--card-shadow)',
          color: totalThreats > 0 ? '#ffffff' : '#0f172a',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header with Live Signal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: totalThreats > 0 ? '#dc2626' : '#16a34a', padding: '0.55rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {totalThreats > 0 ? <ShieldAlert size={22} color="#ffffff" /> : <CheckCircle2 size={22} color="#ffffff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: totalThreats > 0 ? '#ffffff' : '#0f172a' }}>
                  AI Early Disease & Emergency Inflow Radar
                </h3>
                {totalThreats > 0 ? (
                  <span className="badge badge-red" style={{ animation: 'pulse 1.5s infinite' }}>
                    🚨 {totalThreats} Nearby Threat{totalThreats > 1 ? 's' : ''} Active
                  </span>
                ) : (
                  <span className="badge badge-green">
                    ✓ All Surrounding Areas Safe
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: totalThreats > 0 ? '#cbd5e1' : '#64748b', margin: '2px 0 0 0' }}>
                Monitors nearby health clinics (within 25 km) to alert you before incoming patient surges or local accidents arrive at your clinic.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowSimModal(true)}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Test by simulating a nearby accident or disease outbreak"
            >
              <Sparkles size={14} /> Simulate Emergency / Outbreak
            </button>
          </div>
        </div>

        {/* 1. SPREADING DISEASE OUTBREAK ALERTS SECTION */}
        {diseaseAlerts.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={15} /> Nearby Fast-Spreading Disease Warnings ({diseaseAlerts.length})
            </div>

            {diseaseAlerts.map((alt, i) => (
              <div 
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${alt.urgency === 'critical' ? '#ef4444' : '#f97316'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                      ⚠️ {alt.disease_name} Outbreak
                    </span>
                    <span className={`badge ${alt.urgency === 'critical' ? 'badge-red' : 'badge-yellow'}`}>
                      {alt.distance_km} km away ({alt.epicenter_phc_name})
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#f1f5f9', lineHeight: 1.45 }}>
                    <strong>Predicted Inflow:</strong> <span style={{ color: '#f97316', fontWeight: 800 }}>+{alt.projected_inflow_surge_pct}% patient surge</span> expected within <strong>{alt.expected_arrival_window}</strong> as residents travel.
                  </div>

                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <strong>Recommended Supplies:</strong> {alt.recommended_medicines.join(' • ')}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                    💡 {alt.recommended_action}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                    <button
                      onClick={() => handleAcknowledge(`disease-${i}`)}
                      style={{
                        flex: 1,
                        background: acknowledged[`disease-${i}`] ? '#16a34a' : '#ea580c',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <CheckCircle2 size={14} /> {acknowledged[`disease-${i}`] ? 'Clinic Prepared ✓' : 'Ready Medicine Buffer'}
                    </button>

                    <button
                      onClick={() => {
                        window.location.hash = '#/portal/routes';
                        if (onNavigateToRoute) onNavigateToRoute();
                      }}
                      style={{
                        background: '#ffffff',
                        color: '#0f172a',
                        border: 'none',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                      title="Request emergency medicine stock from nearest surplus depot"
                    >
                      <Truck size={14} /> Request Transfer →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. EMERGENCY DISASTER & TRAGEDY INFLOW ALERTS SECTION */}
        {incidentAlerts.length > 0 && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HeartPulse size={15} /> Nearby Emergency Incident & Trauma Warnings ({incidentAlerts.length})
            </div>

            {incidentAlerts.map((inc, i) => (
              <div 
                key={i}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '2px solid #dc2626',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                      🚨 {inc.title}
                    </span>
                    <span className="badge badge-red">
                      {inc.distance_km} km away ({inc.location_name})
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.45 }}>
                    <strong>Attention Required:</strong> High casualty event. <strong>~{inc.expected_incoming_patients} Emergency Patients</strong> projected to arrive in <strong>~{inc.eta_minutes} Minutes</strong>.
                  </div>

                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    <strong>Required Trauma Care:</strong> {inc.recommended_supplies.join(' • ')} ({inc.recommended_beds} Beds Needed)
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fca5a5', background: 'rgba(127, 29, 29, 0.4)', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ef4444' }}>
                    🚨 {inc.recommended_action}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                    <button
                      onClick={() => handleAcknowledge(`incident-${i}`)}
                      style={{
                        flex: 1,
                        background: acknowledged[`incident-${i}`] ? '#16a34a' : '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Zap size={14} /> {acknowledged[`incident-${i}`] ? 'Triage Activated ✓' : 'Activate Triage Protocol'}
                    </button>

                    <button
                      onClick={() => {
                        window.location.hash = '#/portal/emergency';
                      }}
                      style={{
                        background: '#f97316',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      title="Open Emergency Green Corridor for instant ambulance route and fast transfers"
                    >
                      Emergency Portal →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safe State Message */}
        {totalThreats === 0 && (
          <div style={{ padding: '0.85rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
              AI Active Scan Complete: No major epidemics or emergency road accidents reported within your 25 km radius. Normal clinic workflow maintained.
            </div>
          </div>
        )}
      </div>

      {/* Simulation Modal */}
      {showSimModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', width: '100%', maxWidth: '500px', color: '#f8fafc', position: 'relative' }}>
            <button
              onClick={() => setShowSimModal(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} /> Simulate Emergency Incident / Outbreak
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Test how SwasthyaSetu AI alerts nearby clinics, predicts incoming patients, and suggests medicine buffers in real-time.
            </p>

            <form onSubmit={handleSimulateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Select Emergency Type
                </label>
                <select
                  value={simType}
                  onChange={(e) => {
                    setSimType(e.target.value);
                    if (e.target.value === 'road_accident') setSimTitle('Highway Multi-Vehicle Crash on NH-60');
                    else if (e.target.value === 'flood_waterborne') setSimTitle('River Water Contamination & Diarrhea Outbreak');
                    else if (e.target.value === 'chemical_leak') setSimTitle('Industrial MIDC Chemical Gas Leak');
                    else setSimTitle('Mass Food Poisoning at Public Festival');
                  }}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                >
                  <option value="road_accident">🚗 Major Highway Crash / Multi-Vehicle Pileup</option>
                  <option value="flood_waterborne">🌊 River Flooding & Waterborne Illness Outbreak</option>
                  <option value="chemical_leak">🏭 Industrial Chemical / Factory Gas Leak</option>
                  <option value="food_poisoning">🍲 Mass Food Poisoning Outbreak</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  Incident Description
                </label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    Estimated Casualties
                  </label>
                  <input
                    type="number"
                    value={simCasualties}
                    onChange={(e) => setSimCasualties(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                    Impact Radius (km)
                  </label>
                  <input
                    type="number"
                    value={simRadius}
                    onChange={(e) => setSimRadius(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {simStatus && (
                <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 600 }}>
                  {simStatus}
                </div>
              )}

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #16a34a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Broadcast Emergency Threat Simulation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
