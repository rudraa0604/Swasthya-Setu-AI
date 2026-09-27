import React from 'react';
import { Navigation, Clock, ShieldCheck, Printer, Smartphone, CheckCircle2 } from 'lucide-react';

export default function TurnByTurnGuidance({
  activeRoute,
  routeResult,
  currentWaypointIdx,
  simulating,
  handleSendSMS,
  smsSent,
  handleCopyPass,
  copiedPass
}) {
  const waypoints = activeRoute?.waypoints || activeRoute?.turn_by_turn_instructions || [];

  return (
    <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
      <div className="panel-header" style={{ borderBottomColor: '#334155' }}>
        <div className="panel-title" style={{ color: '#f8fafc' }}>
          <Navigation size={18} color="#38bdf8" />
          <span>Turn-by-Turn Strategic Route Telemetry</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-action" 
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: smsSent ? '#166534' : '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
            onClick={handleSendSMS}
          >
            <Smartphone size={13} /> {smsSent ? 'SMS Dispatched ✓' : 'Send Driver SMS'}
          </button>
          <button 
            className="btn-action" 
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: copiedPass ? '#0369a1' : '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
            onClick={handleCopyPass}
          >
            <ShieldCheck size={13} /> {copiedPass ? 'Pass Copied ✓' : 'Toll Pass QR'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '360px', overflowY: 'auto' }}>
        {waypoints.map((wp, idx) => {
          const isPassed = idx < currentWaypointIdx;
          const isCurrent = idx === currentWaypointIdx && simulating;
          const stepNum = wp.step || (idx + 1);
          const instruction = wp.instruction || wp.text || `Proceed via ${wp.name || wp.road_name || 'Corridor'}`;
          const dist = wp.dist_km || wp.segment_distance_km || 0;
          const time = wp.time_mins || wp.segment_duration_mins || 0;

          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                borderRadius: '6px',
                background: isCurrent ? 'rgba(2, 132, 199, 0.25)' : (isPassed ? 'rgba(30, 41, 59, 0.4)' : '#1e293b'),
                border: isCurrent ? '1px solid #38bdf8' : '1px solid #334155',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isCurrent ? '#38bdf8' : (isPassed ? '#10b981' : '#475569'),
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {isPassed ? '✓' : stepNum}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isCurrent ? '#38bdf8' : '#f8fafc' }}>
                    {instruction}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {wp.road_name ? `${wp.road_name} • ` : ''}Lat: {wp.lat || '19.xx'}, Lng: {wp.lng || '73.xx'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
                  {dist} km
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  ~{time} mins
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
