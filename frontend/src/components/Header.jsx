import React, { useState } from 'react';
import { 
  ShieldAlert, Menu, Globe, Layers, MapPin, Building, Building2, 
  AlertTriangle, Navigation, Sparkles, FileSpreadsheet, Code,
  HelpCircle, Zap, X, ChevronRight, CheckCircle2
} from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from './LanguageSelector';

export default function Header({ 
  user,
  onLogout,
  currentTab, 
  setCurrentTab, 
  emergencyMode, 
  setEmergencyMode, 
  lang, 
  setLang,
  selectedState,
  selectedDistrict,
  selectedPHC,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  showTourModal,
  setShowTourModal
}) {
  const t = translations[lang] || translations.en;
  const role = user?.role || 'national';
  const [internalTourModal, setInternalTourModal] = useState(false);

  const isTourOpen = showTourModal !== undefined ? showTourModal : internalTourModal;
  const setIsTourOpen = setShowTourModal || setInternalTourModal;

  // Breadcrumb details based on active tab
  const getTabInfo = () => {
    switch (currentTab) {
      case 'national':
        return { title: t.nationalView || 'National Ministry Overwatch', icon: Globe, color: '#dc2626', scope: 'All-India Apex Layer (150+ Clinics)' };
      case 'state':
        return { title: t.stateView || 'State Health Directorate', icon: Layers, color: '#16a34a', scope: `${selectedState ? selectedState.replace('ST-', '') : 'Maharashtra'} State Supply Node` };
      case 'district':
        return { title: t.districtView || 'District Health Officer Portal', icon: MapPin, color: '#f97316', scope: `${selectedDistrict || 'Nashik'} District Clinics` };
      case 'phc':
        return { title: t.phcDetail || 'Primary Health Centre Telemetry', icon: Building, color: '#0284c7', scope: `${selectedPHC || 'PHC-MH-NAS-01'} • 14-Day Stock Horizon` };
      case 'edge':
        return { title: t.edgeEntry || 'Clinic Offline Data Entry', icon: FileSpreadsheet, color: '#ea580c', scope: `${selectedPHC || 'PHC-MH-NAS-01'} • IndexedDB Local Buffer` };
      case 'hospital':
        return { title: t.privateHospitals || 'Private Hospitals Optimizer', icon: Building2, color: '#0284c7', scope: 'Apollo Hospital (350 Beds • 45 ICU • 4 OTs)' };
      case 'prediction':
        return { title: t.aiPrediction || 'AI Outbreak & Demand Predictions', icon: Sparkles, color: '#7c3aed', scope: 'Prophet + XGBoost Epidemic Engine' };
      case 'route':
        return { title: t.routeOptimization || 'Fast Delivery Route Planner', icon: Navigation, color: '#ea580c', scope: 'VRP Fleet & Incident Rerouting' };
      case 'dev':
        return { title: t.devConsole || 'Admin & Test Console', icon: Code, color: '#ea580c', scope: 'Stress Simulation & Database Sandbox' };
      default:
        return { title: 'Operational Portal Hub', icon: Globe, color: '#0f172a', scope: 'SwasthyaSetu AI' };
    }
  };

  const tabInfo = getTabInfo();
  const ActiveIcon = tabInfo.icon;

  const handleToggleSidebar = () => {
    // If on mobile screen, toggle mobile drawer
    if (window.innerWidth <= 768) {
      if (setMobileSidebarOpen) {
        setMobileSidebarOpen(!mobileSidebarOpen);
      }
    } else {
      // On desktop, toggle collapse
      if (setSidebarCollapsed) {
        const next = !sidebarCollapsed;
        setSidebarCollapsed(next);
        try {
          localStorage.setItem('swasthya_sidebar_collapsed', String(next));
        } catch (e) {}
      }
    }
  };

  return (
    <header className="navbar portal-header">
      {/* Left: Sidebar Toggle Button + Active View Title & Breadcrumb */}
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* Toggle Sidebar Button */}
        <button
          onClick={handleToggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '0.45rem',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
          title="Toggle Navigation Sidebar"
        >
          <Menu size={20} color="#0f172a" />
        </button>

        {/* Active Page Breadcrumb & Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              background: `${tabInfo.color}15`,
              border: `1px solid ${tabInfo.color}40`,
              color: tabInfo.color,
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ActiveIcon size={18} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.18rem)', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                {tabInfo.title}
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: tabInfo.color,
                  background: `${tabInfo.color}12`,
                  padding: '0.12rem 0.45rem',
                  borderRadius: '999px',
                  border: `1px solid ${tabInfo.color}30`
                }}
              >
                {role.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
              {tabInfo.scope}
            </div>
          </div>
        </div>
      </div>

      {/* Right: ONLY Language Changer & Emergency Button */}
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Indian Language Selector Dropdown */}
        <LanguageSelector lang={lang} setLang={setLang} isDark={false} />

        {/* Emergency Mode Toggle Button */}
        {(role === 'national' || role === 'district' || role === 'developer') && (
          <button 
            className={`btn-emergency-toggle ${emergencyMode ? 'active' : ''}`}
            onClick={() => {
              const nextMode = !emergencyMode;
              setEmergencyMode(nextMode);
              window.location.hash = nextMode ? '#/portal/emergency' : `#/portal/${currentTab}`;
            }}
            style={{
              minHeight: '36px',
              padding: '0.45rem 0.95rem',
              boxShadow: emergencyMode ? '0 4px 15px rgba(220, 38, 38, 0.4)' : 'none'
            }}
            title="Toggle National Health Emergency Mode & Corridors"
          >
            <ShieldAlert size={16} /> {t.emergencyMode || 'EMERGENCY MODE'}
          </button>
        )}
      </div>

      {/* System Tour & Architecture Guide Modal */}
      {isTourOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 17, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box'
          }}
          onClick={() => setIsTourOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ background: '#ea580c', color: '#ffffff', padding: '0.45rem', borderRadius: '10px' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    SwasthyaSetu AI: Complete System & Role Guide
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    How the 6 portals work together to eliminate rural medicine shortages
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsTourOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="#475569" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #fed7aa', borderLeft: '4px solid #ea580c', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#ea580c', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <Building size={16} /> 1. Local Clinic (PHC Staff)
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  Works 100% offline. Frontline doctors and pharmacists log daily medicine dispensing, OPD patient visits, and rapid tests. Queued records automatically sync once network returns.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #fed7aa', borderLeft: '4px solid #f97316', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#f97316', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <MapPin size={16} /> 2. District Health Officer (DHO)
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  Supervises all 10+ local health centres in the district. Inspects early warning radar for fever clusters and authorizes 1-click inter-clinic medicine sharing.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #86efac', borderLeft: '4px solid #16a34a', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#16a34a', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <Layers size={16} /> 3. State Health Directorate
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  Coordinates multi-district medicine reserves (e.g. Pune to Nashik). Trains decentralized machine learning models inside state boundaries with zero citizen data leakage.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #fca5a5', borderLeft: '4px solid #dc2626', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#dc2626', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <Globe size={16} /> 4. National Health Ministry
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  Apex All-India monitoring map across 150+ facilities. Can activate Emergency Mode to establish police green corridors for rapid inter-state supply transit.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0284c7', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <Building2 size={16} /> 5. Private Hospitals (Apollo / Civil)
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  MILP bed & ICU capacity solver, CP-SAT robotic operating theater timetable scheduler, and shift-balanced specialist nurse rostering under labor regulations.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #475569', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#475569', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                  <Code size={16} /> 6. Admin & Test Console
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                  Developer sandbox to add clinics, inject synthetic disease surges, simulate road blockages, and reset database tables to clean benchmarks.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <a
                href="#/faq"
                onClick={() => setIsTourOpen(false)}
                style={{
                  color: '#ea580c',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <HelpCircle size={15} /> Read Complete FAQ & Knowledge Base &rarr;
              </a>

              <button
                onClick={() => setIsTourOpen(false)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Got It, Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
