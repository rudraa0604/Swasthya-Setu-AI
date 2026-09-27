import React from 'react';
import { Building, Plus, Edit2, Trash2 } from 'lucide-react';

export default function PhcManagerSection({
  phcs,
  phcForm,
  setPhcForm,
  editingPhcId,
  setEditingPhcId,
  handleSavePHC,
  handleEditPHC,
  handleDeletePHC,
  loading
}) {
  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Building size={20} color="#38bdf8" />
          <span>PHC Facility Management & GPS Coordinates</span>
        </div>
        <span className="badge badge-green">{phcs.length} Facilities Live</span>
      </div>

      {/* Create / Edit Form */}
      <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #334155' }}>
        <h4 style={{ color: '#38bdf8', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>
          {editingPhcId ? `Edit PHC Facility (${editingPhcId})` : 'Register New Primary Health Centre (PHC)'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>PHC Unique ID</label>
            <input 
              type="text" 
              className="input-custom" 
              placeholder="e.g. PHC-MH-NAS-11"
              value={phcForm.id} 
              disabled={!!editingPhcId}
              onChange={(e) => setPhcForm({...phcForm, id: e.target.value})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Facility Name</label>
            <input 
              type="text" 
              className="input-custom" 
              placeholder="e.g. Igatpuri Rural Sub-center"
              value={phcForm.name} 
              onChange={(e) => setPhcForm({...phcForm, name: e.target.value})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>District</label>
            <select 
              className="input-custom"
              value={phcForm.district_name}
              onChange={(e) => setPhcForm({...phcForm, district_name: e.target.value, district_id: `DIST-${e.target.value.substring(0,3).toUpperCase()}`})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            >
              <option value="Nashik">Nashik (Maharashtra)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Thane">Thane (Maharashtra)</option>
              <option value="Bengaluru Rural">Bengaluru Rural (Karnataka)</option>
              <option value="Mysuru">Mysuru (Karnataka)</option>
              <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
              <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Latitude</label>
            <input 
              type="number" 
              step="0.0001"
              className="input-custom" 
              value={phcForm.lat} 
              onChange={(e) => setPhcForm({...phcForm, lat: parseFloat(e.target.value) || 0})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Longitude</label>
            <input 
              type="number" 
              step="0.0001"
              className="input-custom" 
              value={phcForm.lng} 
              onChange={(e) => setPhcForm({...phcForm, lng: parseFloat(e.target.value) || 0})}
              style={{ background: '#0f172a', color: '#f8fafc', borderColor: '#475569' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button 
            className="btn-action btn-primary"
            onClick={handleSavePHC}
            disabled={loading}
          >
            <Plus size={15} /> {editingPhcId ? 'Update PHC Facility' : 'Save New PHC'}
          </button>
          {editingPhcId && (
            <button 
              className="btn-action btn-reject"
              onClick={() => {
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
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* PHC Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ color: '#cbd5e1' }}>PHC Identifier</th>
              <th style={{ color: '#cbd5e1' }}>Facility Name</th>
              <th style={{ color: '#cbd5e1' }}>District & State</th>
              <th style={{ color: '#cbd5e1' }}>Coordinates</th>
              <th style={{ color: '#cbd5e1' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {phcs.slice(0, 15).map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700, color: '#ea580c', fontFamily: 'monospace' }}>{p.id}</td>
                <td style={{ color: '#f8fafc' }}>{p.name}</td>
                <td style={{ color: '#cbd5e1' }}>{p.district_name} ({p.state_id})</td>
                <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.lat}, {p.lng}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      className="btn-action" 
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', background: '#ea580c', color: '#fff' }}
                      onClick={() => handleEditPHC(p)}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      className="btn-action btn-reject" 
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => handleDeletePHC(p.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
