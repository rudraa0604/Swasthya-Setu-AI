import React from 'react';
import { Zap } from 'lucide-react';

export default function OutbreakSimulatorSection({
  stressForm,
  setStressForm,
  handleTriggerStressOutbreak,
  loading
}) {
  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#ef4444' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Zap size={20} color="#ef4444" />
          <span>Epidemic & Supply Disruption Simulation Engine</span>
        </div>
        <span className="badge badge-red">Stress Test Rig</span>
      </div>

      <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
          Simulates an immediate public health crisis by spiking footfall rates and depleting essential medicines across selected district nodes to evaluate real-time redistribution response.
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
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Footfall Spike Multiplier</label>
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
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Depletion Target Drug</label>
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
            <Zap size={16} /> Inject Outbreak & Recalculate AI Optimizer
          </button>
        </div>
      </div>
    </div>
  );
}
