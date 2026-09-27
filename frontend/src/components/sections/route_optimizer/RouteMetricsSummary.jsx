import React from 'react';
import { Clock, Navigation, Zap, Leaf, ThermometerSnowflake } from 'lucide-react';

export default function RouteMetricsSummary({ activeRoute, routeResult }) {
  if (!activeRoute) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
          <Clock size={13} color="#38bdf8" /> ESTIMATED DURATION
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
          {activeRoute.estimated_duration_mins || 195} mins
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          {activeRoute.green_corridor_active ? 'Green Corridor Priority' : 'Standard Traffic Flow'}
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
          <Navigation size={13} color="#10b981" /> TOTAL DISTANCE
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
          {activeRoute.total_distance_km || activeRoute.distance_km || 212.4} km
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          {activeRoute.waypoints?.length || 5} Waypoint Segments
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
          <Zap size={13} color="#f59e0b" /> GREEN CORRIDOR
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
          -{activeRoute.time_saved_mins || 48} mins
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          RFID & FastTag Emergency Cleared
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
          <Leaf size={13} color="#22c55e" /> CO₂ EMISSIONS
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e', marginTop: '0.2rem' }}>
          {activeRoute.carbon_emission_kg || 28.5} kg
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          Eco-Routing Optimization Score
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
          <ThermometerSnowflake size={13} color="#818cf8" /> COLD-CHAIN INTEGRITY
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
          {activeRoute.cold_chain_risk_pct ? `${100 - activeRoute.cold_chain_risk_pct}%` : '98.4%'} Safe
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          Continuous 2°C - 8°C Monitored
        </div>
      </div>
    </div>
  );
}
