import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Truck, 
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '../services/api';
import { translations } from '../services/i18n';
import RouteControlPanel from '../components/sections/route_optimizer/RouteControlPanel';
import RouteMetricsSummary from '../components/sections/route_optimizer/RouteMetricsSummary';
import RouteMapCanvas from '../components/sections/route_optimizer/RouteMapCanvas';
import TurnByTurnGuidance from '../components/sections/route_optimizer/TurnByTurnGuidance';
import FleetVrpSection from '../components/sections/route_optimizer/FleetVrpSection';
import IncidentRerouteSimulator from '../components/sections/route_optimizer/IncidentRerouteSimulator';

export default function AIRouteOptimizerView({ 
  lang = 'en', 
  initialOrigin = 'PHC-MH-PUN-01', 
  initialDest = 'PHC-MH-NAS-01',
  onSelectPHC 
}) {
  const t = translations[lang] || translations.en;

  // View Mode: 'point_to_point', 'fleet_vrp', 'incident_reroute'
  const [activeTab, setActiveTab] = useState('point_to_point');

  // Facilities list
  const [phcs, setPhcs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [originId, setOriginId] = useState(initialOrigin);
  const [destId, setDestId] = useState(initialDest);
  const [objective, setObjective] = useState('fastest');
  const [vehicleType, setVehicleType] = useState('reefer_van');
  
  // Route Data
  const [routeResult, setRouteResult] = useState(null);
  const [activeCandidateIdx, setActiveCandidateIdx] = useState(0);

  // Fleet VRP Data
  const [fleetResult, setFleetResult] = useState(null);
  const [selectedFleetVan, setSelectedFleetVan] = useState(0);

  // Incident Simulation State
  const [incidentType, setIncidentType] = useState('Monsoon Flash Flood / Road Inundation');
  const [incidentRadius, setIncidentRadius] = useState(3.5);
  const [incidentApplied, setIncidentApplied] = useState(false);

  // Live Transit Simulation
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0); // 0 to 100%
  const [simSpeed, setSimSpeed] = useState(1);
  const [smsSent, setSmsSent] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  // Load facilities on mount
  useEffect(() => {
    async function loadPHCs() {
      try {
        const data = await apiClient.getPHCs({ state_id: 'ST-MH' });
        setPhcs(data);
      } catch (err) {
        console.error('Error fetching facilities:', err);
      }
    }
    loadPHCs();
  }, []);

  // Fetch Best Path
  const computeRoute = async (applyIncident = false) => {
    setLoading(true);
    setSimulating(false);
    setSimProgress(0);
    try {
      if (applyIncident) {
        const res = await apiClient.simulateReroute({
          origin_id: originId,
          destination_id: destId,
          blocked_lat: 19.4500,
          blocked_lng: 73.8000,
          hazard_type: incidentType,
          hazard_radius_km: incidentRadius
        });
        setRouteResult(res);
        setIncidentApplied(true);
      } else {
        const res = await apiClient.findBestPath({
          origin_id: originId,
          destination_id: destId,
          objective: objective,
          vehicle_type: vehicleType
        });
        setRouteResult(res);
        setIncidentApplied(false);
      }
      setActiveCandidateIdx(0);
    } catch (e) {
      console.error('Route calculation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Multi-stop Fleet Routes
  const loadFleetRoutes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getOptimizedDeliveryRoutes({ state_id: 'ST-MH', district_name: 'Nashik' });
      setFleetResult(res);
    } catch (e) {
      console.error('Fleet route load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'point_to_point' || activeTab === 'incident_reroute') {
      computeRoute(activeTab === 'incident_reroute');
    } else if (activeTab === 'fleet_vrp') {
      loadFleetRoutes();
    }
  }, [activeTab, originId, destId, objective, vehicleType]);

  // Simulation Animation Loop
  useEffect(() => {
    let interval = null;
    if (simulating) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setSimulating(false);
            return 100;
          }
          return prev + 1.2 * simSpeed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [simulating, simSpeed]);

  const activeRoute = routeResult?.candidate_routes?.[activeCandidateIdx] || routeResult?.recommended_route || routeResult;
  const rawWaypoints = activeRoute?.waypoints || activeRoute?.waypoints_coordinates || [
    { lat: 18.5204, lng: 73.8567, name: 'Pune Depot', avg_speed_kmh: 60 },
    { lat: 18.8420, lng: 74.1150, name: 'Shikrapur Hub', avg_speed_kmh: 70 },
    { lat: 19.1830, lng: 74.1020, name: 'Alephata Junction', avg_speed_kmh: 65 },
    { lat: 19.5700, lng: 74.2100, name: 'Sangamner Bypass', avg_speed_kmh: 75 },
    { lat: 19.9975, lng: 73.7898, name: 'Nashik PHC', avg_speed_kmh: 50 }
  ];

  const currentWaypointIdx = Math.min(
    rawWaypoints.length - 1,
    Math.floor((simProgress / 100) * (rawWaypoints.length - 1))
  );
  const currentWp = rawWaypoints[currentWaypointIdx] || rawWaypoints[0];

  // Map projection helpers
  const allLats = rawWaypoints.map(w => w.lat || 19.0);
  const allLngs = rawWaypoints.map(w => w.lng || 73.5);
  const minLat = Math.min(...allLats) - 0.04;
  const maxLat = Math.max(...allLats) + 0.04;
  const minLng = Math.min(...allLngs) - 0.04;
  const maxLng = Math.max(...allLngs) + 0.04;

  const mapWidth = 720;
  const mapHeight = 440;

  const projectToMap = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * (mapWidth - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat || 1)) * (mapHeight - 80) + 40;
    return { x, y };
  };

  const handleSendSMS = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 4000);
  };

  const handleCopyPass = () => {
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 3000);
  };

  return (
    <div style={{ background: '#020617', minHeight: '85vh', padding: '1.25rem', borderRadius: '12px', color: '#f8fafc' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#ea580c', padding: '0.6rem', borderRadius: '10px' }}>
            <Navigation size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 800, margin: 0 }}>
              Fast Delivery Route Planner
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Find fastest routes, multi-stop trips, and avoid road blocks
            </div>
          </div>
        </div>

        {/* View Switch Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`nav-tab-btn ${activeTab === 'point_to_point' ? 'active' : ''}`}
            onClick={() => setActiveTab('point_to_point')}
            style={{ background: activeTab === 'point_to_point' ? '#ea580c' : '#1e293b', color: '#fff' }}
          >
            <Navigation size={14} /> Direct Route
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'fleet_vrp' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleet_vrp')}
            style={{ background: activeTab === 'fleet_vrp' ? '#ea580c' : '#1e293b', color: '#fff' }}
          >
            <Truck size={14} /> Multi-Stop Trip
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'incident_reroute' ? 'active' : ''}`}
            onClick={() => setActiveTab('incident_reroute')}
            style={{ background: activeTab === 'incident_reroute' ? '#ea580c' : '#1e293b', color: '#fff' }}
          >
            <AlertTriangle size={14} /> Avoid Road Hazard
          </button>
        </div>
      </div>

      {activeTab === 'point_to_point' && (
        <>
          {/* Form & Objective Selector */}
          <RouteControlPanel 
            phcs={phcs}
            originId={originId}
            setOriginId={setOriginId}
            destId={destId}
            setDestId={setDestId}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            objective={objective}
            setObjective={setObjective}
            computeRoute={computeRoute}
            loading={loading}
            routeResult={routeResult}
            activeCandidateIdx={activeCandidateIdx}
            setActiveCandidateIdx={setActiveCandidateIdx}
          />

          {/* Metric KPIs */}
          <RouteMetricsSummary activeRoute={activeRoute} routeResult={routeResult} />

          {/* Map Simulation Canvas */}
          <RouteMapCanvas 
            waypoints={rawWaypoints}
            projectToMap={projectToMap}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            simulating={simulating}
            setSimulating={setSimulating}
            simProgress={simProgress}
            setSimProgress={setSimProgress}
            simSpeed={simSpeed}
            setSimSpeed={setSimSpeed}
            currentWp={currentWp}
            activeRoute={activeRoute}
          />

          {/* Turn-by-Turn Guidance Table */}
          <TurnByTurnGuidance 
            activeRoute={activeRoute}
            routeResult={routeResult}
            currentWaypointIdx={currentWaypointIdx}
            simulating={simulating}
            handleSendSMS={handleSendSMS}
            smsSent={smsSent}
            handleCopyPass={handleCopyPass}
            copiedPass={copiedPass}
          />
        </>
      )}

      {activeTab === 'fleet_vrp' && (
        <FleetVrpSection 
          fleetResult={fleetResult}
          selectedFleetVan={selectedFleetVan}
          setSelectedFleetVan={setSelectedFleetVan}
          onSelectPHC={onSelectPHC}
        />
      )}

      {activeTab === 'incident_reroute' && (
        <>
          <IncidentRerouteSimulator 
            incidentType={incidentType}
            setIncidentType={setIncidentType}
            incidentRadius={incidentRadius}
            setIncidentRadius={setIncidentRadius}
            incidentApplied={incidentApplied}
            computeRoute={computeRoute}
            loading={loading}
          />

          <RouteMetricsSummary activeRoute={activeRoute} routeResult={routeResult} />

          <RouteMapCanvas 
            waypoints={rawWaypoints}
            projectToMap={projectToMap}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            simulating={simulating}
            setSimulating={setSimulating}
            simProgress={simProgress}
            setSimProgress={setSimProgress}
            simSpeed={simSpeed}
            setSimSpeed={setSimSpeed}
            currentWp={currentWp}
            activeRoute={activeRoute}
          />
        </>
      )}
    </div>
  );
}
