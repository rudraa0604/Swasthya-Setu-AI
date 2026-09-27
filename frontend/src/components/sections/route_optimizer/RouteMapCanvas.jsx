import React from 'react';
import { Play, Pause, RotateCcw, Truck, MapPin } from 'lucide-react';

export default function RouteMapCanvas({
  waypoints,
  projectToMap,
  mapWidth,
  mapHeight,
  simulating,
  setSimulating,
  simProgress,
  setSimProgress,
  simSpeed,
  setSimSpeed,
  currentWp,
  originPHC,
  destPHC,
  activeRoute
}) {
  const pointsString = waypoints
    .map(w => {
      const p = projectToMap(w.lat, w.lng);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const currentPos = projectToMap(currentWp.lat, currentWp.lng);

  return (
    <div className="panel" style={{ background: '#020617', borderColor: '#1e293b', overflow: 'hidden', position: 'relative' }}>
      <div className="panel-header" style={{ borderBottomColor: '#1e293b' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Truck size={18} color="#38bdf8" />
          <span>Interactive Green Corridor Transit Simulation Canvas</span>
        </div>

        {/* Live Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-action" 
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: simulating ? '#dc2626' : '#059669', color: '#fff' }}
            onClick={() => setSimulating(!simulating)}
          >
            {simulating ? <><Pause size={13} /> Pause Transit</> : <><Play size={13} /> Live Simulate Transit</>}
          </button>
          <button 
            className="btn-action" 
            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
            onClick={() => { setSimProgress(0); setSimulating(false); }}
            title="Reset to Origin"
          >
            <RotateCcw size={13} />
          </button>
          <select 
            value={simSpeed}
            onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
            style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '4px', fontSize: '0.75rem', padding: '0.25rem 0.4rem' }}
          >
            <option value={1}>1x Speed</option>
            <option value={2}>2x Speed</option>
            <option value={5}>5x Fast</option>
          </select>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ width: '100%', height: '360px', background: '#020617', position: 'relative', borderRadius: '8px' }}>
        <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} style={{ width: '100%', height: '100%' }}>
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Route Polyline Glow */}
          {pointsString && (
            <>
              <polyline
                fill="none"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={simulating ? "8,4" : "none"}
                points={pointsString}
              />
            </>
          )}

          {/* Waypoint Markers */}
          {waypoints.map((w, idx) => {
            const p = projectToMap(w.lat, w.lng);
            const isOrigin = idx === 0;
            const isDest = idx === waypoints.length - 1;
            const color = isOrigin ? '#10b981' : (isDest ? '#ef4444' : '#38bdf8');

            return (
              <g key={idx} transform={`translate(${p.x}, ${p.y})`}>
                <circle r={isOrigin || isDest ? 8 : 4} fill={color} stroke="#0f172a" strokeWidth="2" />
                <text
                  y={isOrigin || isDest ? -12 : 14}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize={isOrigin || isDest ? "10" : "8"}
                  fontWeight={isOrigin || isDest ? "bold" : "normal"}
                >
                  {w.name || (isOrigin ? 'Origin' : (isDest ? 'Destination' : `WP #${idx}`))}
                </text>
              </g>
            );
          })}

          {/* Moving Simulated Vehicle Asset */}
          {waypoints.length > 0 && (
            <g transform={`translate(${currentPos.x}, ${currentPos.y})`} style={{ transition: 'all 0.1s linear' }}>
              <circle r="14" fill="rgba(2, 132, 199, 0.4)" stroke="#38bdf8" strokeWidth="2" />
              <circle r="6" fill="#38bdf8" />
            </g>
          )}
        </svg>

        {/* Live HUD Overlay */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid #334155', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <div>📍 Current Location: <strong style={{ color: '#38bdf8' }}>{currentWp.name || 'En Route NH-60'}</strong></div>
          <div>⚡ Transit Progress: <strong>{Math.round(simProgress)}%</strong> • Avg Speed: <strong>{currentWp.avg_speed_kmh || 65} km/h</strong></div>
        </div>
      </div>
    </div>
  );
}
