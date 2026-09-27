import React, { useState } from 'react';
import { Zap, Sparkles, AlertTriangle, Flame, Truck } from 'lucide-react';
import { api } from '../../../services/api';

export default function OutbreakSimulatorSection({
  stressForm,
  setStressForm,
  handleTriggerStressOutbreak,
  loading
}) {
  const [incidentTitle, setIncidentTitle] = useState('Highway Multi-Vehicle Pileup on NH-60');
  const [incidentType, setIncidentType] = useState('road_accident');
  const [casualties, setCasualties] = useState(35);
  const [radius, setRadius] = useState(20);
  const [incMsg, setIncMsg] = useState(null);

  const handleBroadcastIncident = async () => {
    setIncMsg('Broadcasting emergency mass casualty alert to surrounding clinics...');
    try {
      const res = await api.reportEmergencyIncident({
        title: incidentTitle,
        incident_type: incidentType,
        location_name: "Highway Junction / Industrial Zone",
        lat: 20.02,
        lng: 73.80,
        severity: "critical",
        estimated_casualties: Number(casualties),
        affected_radius_km: Number(radius),
        disease_or_trauma_type: incidentType === 'road_accident' ? 'Mass Trauma Care' : 'Emergency Toxic Inhalation',
        recommended_supplies: ['IV Normal Saline 500ml', 'Anti-Tetanus Toxoid', 'Trauma Dressing Bandages'],
        recommended_beds: 8
      });
      setIncMsg(`✓ Success: Proximity warning broadcasted to all clinics within ${radius}km!`);
      setTimeout(() => setIncMsg(null), 5000);
    } catch (e) {
      setIncMsg('Failed to broadcast incident.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Epidemic Disease Outbreak Simulator */}
      <div className="panel" style={{ background: '#0f172a', borderColor: '#ef4444', marginBottom: 0 }}>
        <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
          <div className="panel-title" style={{ color: '#f8fafc' }}>
            <Zap size={20} color="#ef4444" />
            <span>AI Epidemic & Disease Spread Simulator</span>
          </div>
          <span className="badge badge-red">Disease Spread Engine</span>
        </div>

        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
            Simulate an early epidemic surge in any district. Surrounding clinics within 25 km will automatically receive proximity surge alerts (+145% patient inflow) and buffer stock recommendations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Outbreak District</label>
              <select 
                className="input-custom"
                value={stressForm.district_name}
                onChange={(e) => setStressForm({...stressForm, district_name: e.target.value})}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              >
                <option value="Nashik">Nashik (Maharashtra)</option>
                <option value="Pune">Pune (Maharashtra)</option>
                <option value="Bengaluru Rural">Bengaluru Rural (Karnataka)</option>
                <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
                <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Footfall Surge Multiplier</label>
              <input 
                type="number" 
                step="0.5"
                className="input-custom" 
                value={stressForm.surge_multiplier} 
                onChange={(e) => setStressForm({...stressForm, surge_multiplier: parseFloat(e.target.value) || 1.0})}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Primary Affected Medicine</label>
              <select 
                className="input-custom"
                value={stressForm.target_medicine}
                onChange={(e) => setStressForm({...stressForm, target_medicine: e.target.value})}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              >
                <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                <option value="IV Normal Saline 500ml">IV Normal Saline 500ml</option>
                <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
                <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button 
              className="btn-action btn-reject"
              style={{ background: '#dc2626', color: '#ffffff', padding: '0.65rem 1.25rem', fontWeight: 800 }}
              onClick={handleTriggerStressOutbreak}
              disabled={loading}
            >
              <Zap size={16} /> Broadcast Outbreak & Update Nearby Clinic Radars
            </button>
          </div>
        </div>
      </div>

      {/* 2. Disaster & Mass Casualty Incident Simulator */}
      <div className="panel" style={{ background: '#0f172a', borderColor: '#f97316', marginBottom: 0 }}>
        <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
          <div className="panel-title" style={{ color: '#f8fafc' }}>
            <Flame size={20} color="#f97316" />
            <span>Disaster & Mass Casualty Proximity Broadcast Tool</span>
          </div>
          <span className="badge badge-yellow">Emergency Inflow Simulator</span>
        </div>

        <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
            Simulates a sudden tragedy (highway crash, chemical spill, factory fire). Nearby clinics calculate exact distance in km, incoming patient arrival ETA (e.g. 15-30 mins), and required trauma kits.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tragedy Incident Type</label>
              <select 
                className="input-custom"
                value={incidentType}
                onChange={(e) => {
                  setIncidentType(e.target.value);
                  if (e.target.value === 'road_accident') setIncidentTitle('Highway Multi-Vehicle Pileup on NH-60');
                  else if (e.target.value === 'chemical_leak') setIncidentTitle('Chemical Factory Gas Leak');
                  else if (e.target.value === 'flood_waterborne') setIncidentTitle('River Flood & Acute Diarrhea Cluster');
                  else setIncidentTitle('Mass Food Poisoning Crisis');
                }}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              >
                <option value="road_accident">🚗 Major Highway Accident</option>
                <option value="chemical_leak">🏭 Chemical Plant Leak</option>
                <option value="flood_waterborne">🌊 Flood Waterborne Crisis</option>
                <option value="food_poisoning">🍲 Mass Food Poisoning</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Incident Title</label>
              <input 
                type="text" 
                className="input-custom" 
                value={incidentTitle} 
                onChange={(e) => setIncidentTitle(e.target.value)}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Estimated Casualties</label>
              <input 
                type="number" 
                className="input-custom" 
                value={casualties} 
                onChange={(e) => setCasualties(parseInt(e.target.value) || 10)}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Impact Radius (km)</label>
              <input 
                type="number" 
                className="input-custom" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value) || 10)}
                style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
              />
            </div>
          </div>

          {incMsg && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#86efac', fontWeight: 700 }}>
              {incMsg}
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <button 
              className="btn-action"
              style={{ background: '#ea580c', color: '#ffffff', padding: '0.65rem 1.25rem', fontWeight: 800 }}
              onClick={handleBroadcastIncident}
            >
              <Sparkles size={16} /> Broadcast Disaster Alert to All Nearby Clinics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
