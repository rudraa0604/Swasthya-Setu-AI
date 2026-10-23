import React, { useState } from 'react';
import { 
  Info, ChevronDown, ChevronUp, Sparkles, CheckCircle2, 
  HelpCircle, ArrowRight, BookOpen, Lightbulb, Zap, 
  ShieldCheck, Globe, Layers, MapPin, Building, Building2, 
  Wifi, Navigation, Code, ShieldAlert, FileSpreadsheet
} from 'lucide-react';

// Comprehensive configuration for each panel's purpose, steps, and plain-language definitions
const PANEL_GUIDE_CONFIG = {
  national: {
    badge: 'Apex Overwatch • All-India Layer',
    badgeColor: '#dc2626',
    title: 'National Health Ministry Dashboard',
    subtitle: 'High-level real-time oversight of health facilities, stock rollups, and national supply coordination.',
    whatItDoes: 'Provides apex health officials with a unified view of all 150+ health centers across states, tracks critical drug deficits, and enables one-click emergency mode deployment across inter-state supply corridors.',
    steps: [
      {
        num: '1',
        title: 'Inspect Critical Alerts & Deficits',
        desc: 'Review the KPI grid and Telemetry integration banner for imminent drug stockouts or ICU pressure across states.'
      },
      {
        num: '2',
        title: 'Review Inter-State Redistribution',
        desc: 'Check human-in-the-loop pending medicine transfers. Approve high-priority transfers from surplus states to deficit districts.'
      },
      {
        num: '3',
        title: 'Geographic Risk & Model Consensus',
        desc: 'Click any state on the interactive India map to drill down into state-level operations, or inspect Federated AI model weights.'
      }
    ],
    proTips: [
      { term: 'Telemetry Rollup', def: 'Aggregates live clinic data hourly without uploading raw patient records, preserving citizen privacy.' },
      { term: 'Federated Consensus', def: 'AI models learn from all state trends without transferring private records across state borders.' },
      { term: 'Emergency Override', def: 'Activates priority police green corridors and emergency transport when disease surges occur.' }
    ],
    quickActions: [
      { label: 'AI Demand Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' },
      { label: 'Smart Delivery Routes', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' },
      { label: 'Hospital Resource Optimizer', hash: '#/portal/hospital', icon: Building2, bg: '#f0fdf4', color: '#166534' }
    ]
  },

  state: {
    badge: 'State Directorate • Regional Supply Node',
    badgeColor: '#16a34a',
    title: 'State Health Directorate Operations',
    subtitle: 'State-wide medicine balancing, viral curve monitoring, and inter-district transfer logistics.',
    whatItDoes: 'Empowers State Health Secretaries and Directors to monitor district health stocks, move surplus supplies between districts (e.g. Pune to Nashik), and coordinate cold-chain vaccine logistics.',
    steps: [
      {
        num: '1',
        title: 'Switch & Compare States',
        desc: 'Use the top-right state toggles (MH, KA, UP) to quickly inspect district clusters and clinic coverage.'
      },
      {
        num: '2',
        title: 'Evaluate District Risk Ratings',
        desc: 'Identify which districts have active disease outbreaks (e.g., Nashik) vs. those with healthy stock depots (e.g., Pune).'
      },
      {
        num: '3',
        title: 'Approve District Transfers',
        desc: 'Trigger optimization algorithms to balance inventory and authorize medicine trucks directly between districts.'
      }
    ],
    proTips: [
      { term: 'Surplus-to-Deficit Matching', def: 'Matches clinics with excess medicine to nearby clinics facing imminent stockout within 4 hours.' },
      { term: 'Cold Chain Compliance', def: 'Ensures temperature-sensitive vaccines (2-8°C) are dispatched along reefer van routes.' }
    ],
    quickActions: [
      { label: 'State AI Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' },
      { label: 'Fast Delivery Routes', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' }
    ]
  },

  district: {
    badge: 'District Jurisdiction • Administrative Oversight',
    badgeColor: '#f97316',
    title: 'District Health Officer (DHO) Portal',
    subtitle: 'Direct supervision of all 10+ local Primary Health Centres (PHCs) in the district.',
    whatItDoes: 'Gives District Health Officers live visibility into clinic footfall, medicine stocks, staff attendance, and local epidemic indicators with 1-click approvals for emergency re-allocations.',
    steps: [
      {
        num: '1',
        title: 'Monitor Early Warning Radar',
        desc: 'Check the real-time proximity radar for fever clusters, platelet drops, and sudden medicine consumption jumps.'
      },
      {
        num: '2',
        title: 'Inspect Individual PHCs',
        desc: 'Click "Inspect Telemetry & AI Forecast" on any clinic row in the table to see its 14-day stock depletion curve.'
      },
      {
        num: '3',
        title: 'Approve Local Transfers',
        desc: 'Authorize instant medicine dispatches between clinics in your district to keep all clinics fully stocked.'
      }
    ],
    proTips: [
      { term: 'Proximity Radar', def: 'Uses spatial distance and symptom co-occurrence to detect outbreak epicenters before hospital admissions spike.' },
      { term: 'Buffer Threshold', def: 'The minimum safety stock needed to ensure a clinic can treat patients for 7 days without new delivery.' }
    ],
    quickActions: [
      { label: 'District AI Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' },
      { label: 'Dispatch Delivery Van', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' }
    ]
  },

  edge: {
    badge: 'Frontline Offline Terminal • Edge Clinic',
    badgeColor: '#ea580c',
    title: 'PHC Daily Data Entry & Edge Terminal',
    subtitle: 'Built for rural healthcare workers and pharmacists — works 100% offline without active internet.',
    whatItDoes: 'Allows doctors and pharmacists to register patient OPD consultations, log medicine dispenses, and track daily footfall. All data is saved safely in the browser and syncs automatically when network reconnects.',
    steps: [
      {
        num: '1',
        title: 'Choose Data Entry Mode',
        desc: 'Select from: Patient OPD Consultation, Daily Medicine Stock Dispensed, or Aggregate Footfall Surveillance.'
      },
      {
        num: '2',
        title: 'Enter Patient Details or Medicine',
        desc: 'Fill out symptoms, prescribed medications, and test results. No internet is required.'
      },
      {
        num: '3',
        title: 'Check Sync Status',
        desc: 'View your local queue counter. When internet is detected, click "Sync Now" to automatically push records to the state server.'
      }
    ],
    proTips: [
      { term: 'Offline IndexedDB Store', def: 'Stores all entries locally on your device with cryptographic signatures so zero data is lost.' },
      { term: 'Automatic Re-sync', def: 'The moment WiFi, 4G, or satellite network is detected, queued entries upload silently in background.' }
    ],
    quickActions: [
      { label: 'View Clinic Telemetry & Charts', hash: '#/portal/phc', icon: Building, bg: '#fff7ed', color: '#ea580c' },
      { label: 'AI Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' }
    ]
  },

  phc: {
    badge: 'Clinical Telemetry • 14-Day Horizon',
    badgeColor: '#0284c7',
    title: 'Primary Health Centre (PHC) Telemetry & AI Forecast',
    subtitle: 'Deep-dive inspection into medicine inventory, Prophet AI stock depletion, and bed occupancy.',
    whatItDoes: 'Visualizes the 14-day stock depletion curve for each medicine, current doctor/nurse staffing strength, and disease symptom alerts for this specific clinic.',
    steps: [
      {
        num: '1',
        title: 'Select Medicine to Inspect',
        desc: 'Click on any drug in the Medicine Inventory table (e.g., Paracetamol, ORS, IV Saline) to load its forecast curve.'
      },
      {
        num: '2',
        title: 'Read Stock Depletion Horizon',
        desc: 'The chart shows predicted daily consumption. If the curve touches the red safety line, an automatic transfer request is triggered.'
      },
      {
        num: '3',
        title: 'Check Bed Occupancy & Staffing',
        desc: 'Review maternity, general, and emergency bed occupancy alongside attending medical officers.'
      }
    ],
    proTips: [
      { term: 'Prophet Time-Series AI', def: 'Accounts for day-of-week trends, seasonal monsoon illnesses, and historical spikes to project exact exhaustion dates.' },
      { term: 'Stock-Out Alert', def: 'Alerts are raised automatically 5-7 days before stock hits zero, giving ample time for delivery vans to arrive.' }
    ],
    quickActions: [
      { label: 'Open Daily Entry Terminal', hash: '#/portal/edge', icon: FileSpreadsheet, bg: '#fff7ed', color: '#ea580c' },
      { label: 'Plan Medicine Delivery Route', hash: '#/portal/routes', icon: Navigation, bg: '#f0fdf4', color: '#166534' }
    ]
  },

  hospital: {
    badge: 'Tertiary Hospital AI • MILP & CP-SAT Solver',
    badgeColor: '#0284c7',
    title: 'Private Hospitals AI Resource Optimizer',
    subtitle: 'Multi-specialty hospital management: admission forecasting, bed/ICU allocation, robotic OT scheduling, and nursing rosters.',
    whatItDoes: 'Designed for medical directors and hospital administrators to optimize inpatient admissions, reduce surgical turnover idle time, allocate deluxe/ICU beds, and balance nurse shifts under labor regulations.',
    steps: [
      {
        num: '1',
        title: 'Switch Between Feature Tabs',
        desc: 'Use tabs like Bed Optimization, Operating Theaters (OT), Staff Roster, Emergency Surge, and What-If Simulator.'
      },
      {
        num: '2',
        title: 'Run MILP & CP-SAT Optimizers',
        desc: 'Click "Run AI Solver" to generate mathematically optimal bed allocations and robotic surgical sequences with zero room collisions.'
      },
      {
        num: '3',
        title: 'Live Inpatient Admission Entry',
        desc: 'Use "Hospital Data Entry" to register new patient admissions, assign ICU/HDU beds, and monitor real-time acuity.'
      }
    ],
    proTips: [
      { term: 'MILP Bed Allocation', def: 'Mixed-Integer Linear Programming guarantees maximum patient intake while maintaining emergency reserve buffers.' },
      { term: 'CP-SAT OT Scheduler', def: 'Constraint Programming Solver schedules robotic, laparoscopic, and open surgeries with optimal cleaning turnover.' },
      { term: 'Human-in-the-Loop', def: 'AI suggests schedules; clinical directors retain final one-click authorization before executing roster changes.' }
    ],
    quickActions: [
      { label: 'AI Demand Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' },
      { label: 'Emergency Logistics', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' }
    ]
  },

  route: {
    badge: 'Logistics AI • VRP & Hazard Rerouting',
    badgeColor: '#ea580c',
    title: 'Smart Medicine Delivery Route Planner',
    subtitle: 'Point-to-point emergency corridors, fleet vehicle routing (VRP), and weather/flood incident re-routing.',
    whatItDoes: 'Calculates the fastest delivery routes between medical warehouses and rural clinics, avoiding flooded roads, ghat passes, and landslides with live GPS guidance and driver SMS dispatch.',
    steps: [
      {
        num: '1',
        title: 'Select Origin & Destination',
        desc: 'Choose the dispatch depot (e.g. Pune Surplus Hub) and the receiving clinic (e.g. Nashik Outbreak PHC).'
      },
      {
        num: '2',
        title: 'Simulate Road Blockages',
        desc: 'Switch to the "Incident Re-route Simulator" to simulate a flash flood or roadblock. Watch AI recompute alternate highways instantly.'
      },
      {
        num: '3',
        title: 'Live Transit & Driver Dispatch',
        desc: 'Click "Start Live Simulation" to preview real-time vehicle movement, or "Send Driver SMS" to generate instant navigation passes.'
      }
    ],
    proTips: [
      { term: 'Cold-Chain Reefer Routing', def: 'Prioritizes routes with minimum travel time and reliable power grid stops for refrigerated medicine vans.' },
      { term: 'Hazard Polygon Buffer', def: 'Creates real-time exclusion zones around landslides and waterlogged bridges to ensure convoy safety.' }
    ],
    quickActions: [
      { label: 'National Health Hub', hash: '#/portal/national', icon: Globe, bg: '#fef2f2', color: '#dc2626' },
      { label: 'AI Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' }
    ]
  },

  prediction: {
    badge: 'Epidemic AI Engine • Prophet + XGBoost',
    badgeColor: '#7c3aed',
    title: 'AI Epidemic Outbreak & Healthcare Demand Predictions',
    subtitle: 'Unified forecasting across all tiers: Local Clinics, Districts, States, and Tertiary Hospitals.',
    whatItDoes: 'Simulates viral outbreak curves, dengue/malaria surges, ICU admission spikes, and required medicine quantities under different weather and monsoon scenarios.',
    steps: [
      {
        num: '1',
        title: 'Select Your Jurisdiction Scope',
        desc: 'Switch between National, State, District, Local PHC, or Private Hospital scopes to see tailored predictions.'
      },
      {
        num: '2',
        title: 'Tune Epidemic Parameters',
        desc: 'Adjust the Surge Multiplier, Monsoon Risk Factor, and Forecast Horizon (7, 14, 30 days) to test stress scenarios.'
      },
      {
        num: '3',
        title: 'Actionable Clinical Advisories',
        desc: 'Read AI-generated procurement advisories, emergency buffer recommendations, and rapid medicine transfer triggers.'
      }
    ],
    proTips: [
      { term: 'Multi-Disease Modeler', def: 'Tracks Dengue, Malaria, Typhoid, Viral Respiratory illness, and Acute Gastroenteritis.' },
      { term: 'Monsoon Sensitivity', def: 'Incorporates rainfall, stagnant water indices, and humidity to predict vector breeding 2 weeks in advance.' }
    ],
    quickActions: [
      { label: 'Private Hospitals Portal', hash: '#/portal/hospital', icon: Building2, bg: '#f0fdf4', color: '#166534' },
      { label: 'Delivery Route Planner', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' }
    ]
  },

  dev: {
    badge: 'Developer Sandbox • System Simulation',
    badgeColor: '#ea580c',
    title: 'Admin & System Simulation Console',
    subtitle: 'Full testing control: add clinics, inject synthetic outbreaks, modify drug stocks, and reset demo state.',
    whatItDoes: 'Enables administrators and evaluators to stress-test the entire SwasthyaSetu AI platform by creating synthetic epidemics, adjusting inventory levels, and inspecting raw database tables.',
    steps: [
      {
        num: '1',
        title: 'Manage Health Clinics (PHCs)',
        desc: 'Add new clinics or edit coordinates, sanctioned staff counts, and assigned district jurisdictions.'
      },
      {
        num: '2',
        title: 'Inject Simulated Disease Surges',
        desc: 'Go to "Outbreak Stress Test" to trigger a sudden 3.5x dengue outbreak in Nashik or any district of your choice.'
      },
      {
        num: '3',
        title: 'Clean Reset System Database',
        desc: 'Use "System Maintenance" to re-seed demo data and restore all clinics to their pristine benchmark state.'
      }
    ],
    proTips: [
      { term: 'Stress Simulation', def: 'Artificially reduces stock by up to 85% to verify that automated alerts and transfer recommendations fire accurately.' },
      { term: 'Safe Sandbox', def: 'All modifications are strictly contained within the demo simulation environment.' }
    ],
    quickActions: [
      { label: 'National Dashboard', hash: '#/portal/national', icon: Globe, bg: '#fef2f2', color: '#dc2626' },
      { label: 'AI Demand Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' }
    ]
  },

  emergency: {
    badge: 'Priority Red Alert • Green Corridor Activated',
    badgeColor: '#dc2626',
    title: 'National Health Emergency Override Mode',
    subtitle: 'Instant authorization protocol for high-mortality disease clusters and catastrophic medicine shortages.',
    whatItDoes: 'Bypasses standard multi-tier procurement queues to fast-track medicine dispatches, reserve ICU beds across private and government hospitals, and establish highway green corridors.',
    steps: [
      {
        num: '1',
        title: 'Review Critical Deficits',
        desc: 'Inspect clinics with 0 days of safety buffer for life-saving drugs like IV Saline, Paracetamol, and Antibiotics.'
      },
      {
        num: '2',
        title: 'One-Click Emergency Approval',
        desc: 'Authorize urgent stock transfer orders with a single tap to initiate immediate vehicle loading.'
      },
      {
        num: '3',
        title: 'Monitor Green Corridors',
        desc: 'Track police-escorted delivery convoys moving between cities to ensure arrival within the golden window.'
      }
    ],
    proTips: [
      { term: 'Green Corridor', def: 'Synchronizes with traffic police and toll plazas to grant priority signal passage to medical transport vans.' },
      { term: 'Stage 3 Triage', def: 'Prioritizes intensive care bed allocation for patients with life-threatening hemodynamic instability.' }
    ],
    quickActions: [
      { label: 'Delivery Route Navigator', hash: '#/portal/routes', icon: Navigation, bg: '#fff7ed', color: '#ea580c' },
      { label: 'AI Predictions', hash: '#/portal/prediction', icon: Sparkles, bg: '#f5f3ff', color: '#6d28d9' }
    ]
  }
};

export default function PanelGuideBanner({ role = 'national', lang = 'en', onActionClick }) {
  const config = PANEL_GUIDE_CONFIG[role] || PANEL_GUIDE_CONFIG.national;
  const storageKey = `swasthya_guide_expanded_${role}`;

  // Default to expanded for immediate clarity, user can collapse
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'terms'

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    try {
      localStorage.setItem(storageKey, String(nextState));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = (hash) => {
    window.location.hash = hash;
    if (onActionClick) onActionClick(hash);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fffbf5 100%)',
        border: '1px solid #fed7aa',
        borderLeft: `5px solid ${config.badgeColor}`,
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(234, 88, 12, 0.08)',
        marginBottom: '1.25rem',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Top Header Bar (Always Visible) */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: isExpanded ? 'rgba(254, 243, 199, 0.35)' : 'transparent',
          borderBottom: isExpanded ? '1px solid #fed7aa' : 'none',
          cursor: 'pointer'
        }}
        onClick={toggleExpand}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: `${config.badgeColor}15`,
              color: config.badgeColor,
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Lightbulb size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: config.badgeColor,
                  background: `${config.badgeColor}15`,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  border: `1px solid ${config.badgeColor}30`
                }}
              >
                {config.badge}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                💡 Panel Guide & Quick Start
              </span>
            </div>
            <h3
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0.2rem 0 0 0',
                lineHeight: 1.2
              }}
            >
              {config.title}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700 }}>
            {isExpanded ? 'Hide Guide' : 'Show How to Use'}
          </span>
          <button
            type="button"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '0.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#334155'
            }}
            aria-label={isExpanded ? 'Collapse panel guide' : 'Expand panel guide'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Guide Body */}
      {isExpanded && (
        <div style={{ padding: '1.25rem 1.25rem 1.1rem 1.25rem' }}>
          {/* 1-Sentence Purpose Explainer */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}
          >
            <Info size={18} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
              <strong>Panel Purpose:</strong> {config.whatItDoes}
            </div>
          </div>

          {/* Sub-Tabs: How to Use vs Jargon Explainer */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.4rem'
            }}
          >
            <button
              onClick={() => setActiveTab('steps')}
              style={{
                background: activeTab === 'steps' ? '#ea580c' : 'transparent',
                color: activeTab === 'steps' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <CheckCircle2 size={14} /> 3-Step Walkthrough
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              style={{
                background: activeTab === 'terms' ? '#ea580c' : 'transparent',
                color: activeTab === 'terms' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <HelpCircle size={14} /> Plain Language Definitions ({config.proTips.length})
            </button>
          </div>

          {/* Tab 1: 3-Step Walkthrough Cards */}
          {activeTab === 'steps' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              {config.steps.map((st) => (
                <div
                  key={st.num}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div
                      style={{
                        background: '#ea580c',
                        color: '#ffffff',
                        width: '22px',
                        height: '22px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}
                    >
                      {st.num}
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                      {st.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, paddingLeft: '1.85rem' }}>
                    {st.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Plain Language Definitions */}
          {activeTab === 'terms' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              {config.proTips.map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fed7aa',
                    borderRadius: '8px',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ea580c', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={13} color="#ea580c" /> {tip.term}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                    {tip.def}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Action Shortcuts */}
          {config.quickActions && config.quickActions.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.65rem',
                paddingTop: '0.6rem',
                borderTop: '1px dashed #fed7aa'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                ⚡ Quick Shortcuts for this Role:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {config.quickActions.map((qa, i) => {
                  const Icon = qa.icon || ArrowRight;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAction(qa.hash)}
                      style={{
                        background: qa.bg,
                        color: qa.color,
                        border: `1px solid ${qa.color}40`,
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Icon size={13} /> {qa.label} &rarr;
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
