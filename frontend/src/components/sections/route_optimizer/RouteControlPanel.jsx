import React from 'react';
import { Truck, Navigation, Sparkles, Zap, Leaf, ThermometerSnowflake, Plane } from 'lucide-react';

export default function RouteControlPanel({
  phcs,
  originId,
  setOriginId,
  destId,
  setDestId,
  vehicleType,
  setVehicleType,
  objective,
  setObjective,
  computeRoute,
  loading,
  routeResult,
  activeCandidateIdx,
  setActiveCandidateIdx
}) {
  const candidateRoutes = routeResult?.candidate_routes || [];

  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Sparkles size={18} color="#38bdf8" />
          <span>Route Planner & Multi-Criteria Optimization</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* Origin Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Origin PHC Depot (Source)</label>
          <select 
            className="input-custom"
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
          >
            {phcs.map(p => (
              <option key={p.id} value={p.id}>{p.district_name}: {p.name}</option>
            ))}
          </select>
        </div>

        {/* Destination Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target PHC (Deficit / Outbreak)</label>
          <select 
            className="input-custom"
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
          >
            {phcs.map(p => (
              <option key={p.id} value={p.id}>{p.district_name}: {p.name}</option>
            ))}
          </select>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Dispatch Vehicle Asset</label>
          <select 
            className="input-custom"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
          >
            <option value="reefer_van">Cold-Chain Reefer Van (2-8°C)</option>
            <option value="ambulance">Emergency Ambulance (Green Corridor)</option>
            <option value="rapid_carrier">Rapid Carrier Mini-Truck</option>
            <option value="drone">Medical Cargo Drone Airlift</option>
          </select>
        </div>

        {/* Optimization Objective */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Route Priority Goal</label>
          <select 
            className="input-custom"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
          >
            <option value="fastest">Fastest Trip (Shortest Time)</option>
            <option value="shortest">Shortest Distance (Lowest KM)</option>
            <option value="cold_chain">Medicine Safety (Cold-Chain Priority)</option>
            <option value="eco">Fuel Efficient (Lowest Carbon)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button 
          className="btn-action btn-primary"
          style={{ background: '#ea580c', padding: '0.65rem 1.25rem', fontWeight: 800 }}
          onClick={() => computeRoute(false)}
          disabled={loading}
        >
          <Navigation size={16} /> Find Best Route
        </button>

        {/* Candidate Route Tabs */}
        {candidateRoutes.length > 1 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {candidateRoutes.map((c, i) => (
              <button
                key={i}
                className="btn-action"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  background: activeCandidateIdx === i ? '#ea580c' : '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  fontWeight: activeCandidateIdx === i ? 700 : 500
                }}
                onClick={() => setActiveCandidateIdx(i)}
              >
                Route #{i + 1}: {c.route_name || `${c.total_distance_km} km`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
