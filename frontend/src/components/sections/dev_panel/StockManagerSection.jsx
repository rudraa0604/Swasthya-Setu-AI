import React from 'react';
import { Pill, Plus } from 'lucide-react';

export default function StockManagerSection({
  phcs,
  stockForm,
  setStockForm,
  handleSaveStock,
  loading
}) {
  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Pill size={20} color="#10b981" />
          <span>Medicine Inventory Direct State Injection</span>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
        <h4 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>
          Inject or Overwrite Facility Medicine Buffer
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target PHC</label>
            <select 
              className="input-custom"
              value={stockForm.phc_id}
              onChange={(e) => setStockForm({...stockForm, phc_id: e.target.value})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            >
              {phcs.map(p => (
                <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Essential Medicine</label>
            <select 
              className="input-custom"
              value={stockForm.medicine_name}
              onChange={(e) => setStockForm({...stockForm, medicine_name: e.target.value})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            >
              <option value="Paracetamol 500mg">Paracetamol 500mg</option>
              <option value="Amoxicillin 250mg">Amoxicillin 250mg</option>
              <option value="ORS Sachet (Oral Rehydration Salts)">ORS Sachet (Oral Rehydration Salts)</option>
              <option value="Rabies Vaccine (Anti-Rabies)">Rabies Vaccine (Anti-Rabies)</option>
              <option value="Insulin Regular 40IU">Insulin Regular 40IU</option>
              <option value="Doxycycline 100mg">Doxycycline 100mg</option>
              <option value="IV Normal Saline 500ml">IV Normal Saline 500ml</option>
              <option value="Artesunate (Anti-Malarial)">Artesunate (Anti-Malarial)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Available Quantity</label>
            <input 
              type="number" 
              className="input-custom" 
              value={stockForm.quantity} 
              onChange={(e) => setStockForm({...stockForm, quantity: parseInt(e.target.value) || 0})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Buffer Threshold</label>
            <input 
              type="number" 
              className="input-custom" 
              value={stockForm.buffer_threshold} 
              onChange={(e) => setStockForm({...stockForm, buffer_threshold: parseInt(e.target.value) || 0})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button 
            className="btn-action btn-primary"
            style={{ background: '#10b981' }}
            onClick={handleSaveStock}
            disabled={loading}
          >
            <Plus size={15} /> Inject / Update Medicine Stock
          </button>
        </div>
      </div>
    </div>
  );
}
