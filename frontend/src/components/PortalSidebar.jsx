import React, { useState } from 'react';
import { 
  Globe, Layers, MapPin, Building, Building2, 
  FileSpreadsheet, Navigation, Sparkles, Code, 
  ChevronLeft, ChevronRight, Menu, X, LogOut, 
  HelpCircle, Lightbulb, Home, ShieldAlert, CheckCircle2, 
  UserCheck, ArrowRight, Zap, Shield, Stethoscope
} from 'lucide-react';
import { translations } from '../services/i18n';

export default function PortalSidebar({
  user,
  currentTab,
  setCurrentTab,
  emergencyMode,
  setEmergencyMode,
  lang,
  onLogout,
  selectedState,
  selectedDistrict,
  selectedPHC,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  onOpenGuide
}) {
  const t = translations[lang] || translations.en;
  const role = user?.role || 'national';
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleNavClick = (tabKey, hashPath, customAction) => {
    if (mobileSidebarOpen && setMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
    if (setEmergencyMode) {
      setEmergencyMode(false);
    }
    if (customAction) {
      customAction();
      return;
    }
    if (setCurrentTab) {
      setCurrentTab(tabKey);
    }
    if (hashPath) {
      window.location.hash = hashPath;
    }
  };

  const handleQuickSwitchRole = (newRoleKey) => {
    setShowRoleSwitcher(false);
    const profiles = {
      phc: { role: 'phc', username: 'staff.nashik01@swasthya.gov.in', displayName: 'Dr. Ramesh Patil (Clinic Doctor)', phcId: 'PHC-MH-NAS-01', district: 'Nashik', stateId: 'ST-MH' },
      district: { role: 'district', username: 'dho.nashik@health.mh.gov.in', displayName: 'Dr. Suresh Kulkarni (District Health Officer)', district: 'Nashik', stateId: 'ST-MH' },
      state: { role: 'state', username: 'director.health@maharashtra.gov.in', displayName: 'State Health Admin (Maharashtra)', stateId: 'ST-MH' },
      national: { role: 'national', username: 'officer.nhm@gov.in', displayName: 'Executive Health Director (National Health Ministry)' },
      hospital: { role: 'hospital', username: 'admin@apollohospitals.com', displayName: 'Dr. Anita Joshi (Medical Director - Apollo)', hospitalId: 'HOSP-PVT-APOLLO', district: 'Nashik', stateId: 'ST-MH' },
      developer: { role: 'developer', username: 'dev.admin@swasthyasetu.ai', displayName: 'Lead Platform Admin' }
    };
    const profile = profiles[newRoleKey] || profiles.national;
    try {
      sessionStorage.setItem('swasthya_user', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
    
    if (newRoleKey === 'phc') {
      window.location.hash = '#/portal/edge/PHC-MH-NAS-01';
    } else if (newRoleKey === 'district') {
      window.location.hash = '#/portal/district/Nashik';
    } else if (newRoleKey === 'state') {
      window.location.hash = '#/portal/state/ST-MH';
    } else if (newRoleKey === 'hospital') {
      window.location.hash = '#/portal/hospital';
    } else if (newRoleKey === 'developer') {
      window.location.hash = '#/portal/developer';
    } else {
      window.location.hash = '#/portal/national';
    }
    window.location.reload();
  };

  const toggleCollapse = () => {
    const next = !sidebarCollapsed;
    if (setSidebarCollapsed) {
      setSidebarCollapsed(next);
      try {
        localStorage.setItem('swasthya_sidebar_collapsed', String(next));
      } catch (e) {}
    }
  };

  // Determine visibility of tabs based on role
  const isNational = role === 'national';
  const isState = role === 'state';
  const isDistrict = role === 'district';
  const isPHC = role === 'phc';
  const isHospital = role === 'hospital';
  const isDeveloper = role === 'developer';

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 17, 30, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
          className="portal-mobile-backdrop"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`portal-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: sidebarCollapsed ? '76px' : '270px',
          minWidth: sidebarCollapsed ? '76px' : '270px',
          background: 'linear-gradient(180deg, #091322 0%, #0c1a2e 100%)',
          color: '#f8fafc',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 999,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Sidebar Brand Header */}
        <div
          style={{
            padding: sidebarCollapsed ? '1rem 0.5rem' : '1.1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            gap: '0.5rem',
            position: 'relative'
          }}
        >
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#/';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: 'inherit',
              overflow: 'hidden'
            }}
            title="Return to Main Portal Home"
          >
            <img
              src="/assets/swasthyasetu_icon_only.png"
              alt="Logo"
              style={{ height: '34px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/SwasthyaSetu AI.png';
              }}
            />
            {!sidebarCollapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  SwasthyaSetu <span style={{ color: '#f97316' }}>AI</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#fed7aa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  Safe Health Network
                </div>
              </div>
            )}
          </a>

          {/* Collapse/Expand Toggle Button (Desktop) */}
          <button
            onClick={toggleCollapse}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '0.35rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: sidebarCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            className="sidebar-collapse-btn"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Close button for mobile drawer */}
          {mobileSidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'none'
              }}
              className="sidebar-mobile-close-btn"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* 2. Active User Profile & Role Switcher Card */}
        <div
          style={{
            padding: sidebarCollapsed ? '0.75rem 0.4rem' : '0.85rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(234, 88, 12, 0.06)'
          }}
        >
          {sidebarCollapsed ? (
            <div
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
              title={`${user?.displayName || 'User'} (${role.toUpperCase()}) - Click to Switch`}
            >
              {role.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                title="Click to Switch Portal Role / Station"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: '#f97316',
                      background: 'rgba(249, 115, 22, 0.15)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {role.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#fed7aa', fontWeight: 600 }}>
                    Switch ▼
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.displayName?.split('(')[0] || 'User'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.phcId || user?.district || user?.stateId || 'All-India Overwatch'}
                </div>
              </div>

              {/* Quick Switch Dropdown Popover */}
              {showRoleSwitcher && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '6px',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                    padding: '0.4rem',
                    zIndex: 9999
                  }}
                >
                  <div style={{ padding: '0.3rem 0.5rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', marginBottom: '0.25rem' }}>
                    ⚡ 1-Click Switch Station:
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('phc')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'phc' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem' }}
                  >
                    <Building size={14} color="#ea580c" />
                    <div>
                      <div style={{ fontWeight: 700 }}>Local Clinic (PHC)</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Offline OPD & Stock Entry</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('district')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'district' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem' }}
                  >
                    <MapPin size={14} color="#f97316" />
                    <div>
                      <div style={{ fontWeight: 700 }}>District Health Officer</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Nashik 10+ Clinics & Approvals</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('state')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'state' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem' }}
                  >
                    <Layers size={14} color="#16a34a" />
                    <div>
                      <div style={{ fontWeight: 700 }}>State Directorate</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Maharashtra Supply & Privacy</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('national')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'national' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem' }}
                  >
                    <Globe size={14} color="#dc2626" />
                    <div>
                      <div style={{ fontWeight: 700 }}>National Ministry</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>All-India Health Overwatch</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('hospital')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'hospital' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem' }}
                  >
                    <Building2 size={14} color="#0284c7" />
                    <div>
                      <div style={{ fontWeight: 700 }}>Private Hospitals</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>MILP Beds & Robotic OT</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleQuickSwitchRole('developer')}
                    style={{ padding: '0.4rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: role === 'developer' ? 'rgba(234, 88, 12, 0.2)' : 'transparent', color: '#f8fafc', fontSize: '0.78rem', borderTop: '1px solid #1e293b' }}
                  >
                    <Code size={14} color="#ea580c" />
                    <div>
                      <div style={{ fontWeight: 700 }}>Admin & Test Console</div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Stress Outbreak Sandbox</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Navigation Links List */}
        <div style={{ padding: '0.85rem 0.6rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Section A: AI ENGINES & OPTIMIZERS (Universal) */}
          <div>
            {!sidebarCollapsed && (
              <div style={{ padding: '0.2rem 0.6rem 0.4rem 0.6rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Engines & Logistics
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {/* 1. AI Predictions */}
              <button
                onClick={() => handleNavClick('prediction', '#/portal/prediction')}
                className={`sidebar-nav-item ${currentTab === 'prediction' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: currentTab === 'prediction' ? '1px solid #7c3aed' : '1px solid transparent',
                  background: currentTab === 'prediction' ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%)' : 'transparent',
                  color: currentTab === 'prediction' ? '#c084fc' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: currentTab === 'prediction' ? 800 : 600,
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
                title="AI Epidemic Outbreak & Healthcare Demand Predictions"
              >
                <Sparkles size={18} color={currentTab === 'prediction' ? '#c084fc' : '#a855f7'} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{t.aiPrediction || 'AI Predictions'}</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(168, 85, 247, 0.25)', color: '#e9d5ff', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 800 }}>
                      PROPHET
                    </span>
                  </div>
                )}
              </button>

              {/* 2. Smart Delivery Routes */}
              <button
                onClick={() => handleNavClick('route', '#/portal/routes')}
                className={`sidebar-nav-item ${currentTab === 'route' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: currentTab === 'route' ? '1px solid #ea580c' : '1px solid transparent',
                  background: currentTab === 'route' ? 'rgba(234, 88, 12, 0.25)' : 'transparent',
                  color: currentTab === 'route' ? '#fed7aa' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: currentTab === 'route' ? 800 : 600,
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
                title="Smart Medicine Delivery Route Planner & Fleet Dispatch"
              >
                <Navigation size={18} color={currentTab === 'route' ? '#f97316' : '#ea580c'} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{t.routeOptimization || 'Delivery Routes'}</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(234, 88, 12, 0.2)', color: '#fed7aa', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>
                      VRP
                    </span>
                  </div>
                )}
              </button>

              {/* 3. Private Hospitals Resource Optimizer */}
              <button
                onClick={() => handleNavClick('hospital', '#/portal/hospital')}
                className={`sidebar-nav-item ${currentTab === 'hospital' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: currentTab === 'hospital' ? '1px solid #0284c7' : '1px solid transparent',
                  background: currentTab === 'hospital' ? 'rgba(2, 132, 199, 0.25)' : 'transparent',
                  color: currentTab === 'hospital' ? '#bae6fd' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: currentTab === 'hospital' ? 800 : 600,
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
                title="Private Hospitals AI Resource Optimizer (Beds, ICU, Robotic OT, Staff)"
              >
                <Building2 size={18} color={currentTab === 'hospital' ? '#38bdf8' : '#0284c7'} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{t.privateHospitals || 'Private Hospitals'}</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(2, 132, 199, 0.2)', color: '#bae6fd', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 700 }}>
                      MILP
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Section B: CORE JURISDICTIONS (Role Constrained) */}
          <div>
            {!sidebarCollapsed && (
              <div style={{ padding: '0.2rem 0.6rem 0.4rem 0.6rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Health Jurisdictions
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              
              {/* National View */}
              {(isNational || isDeveloper) && (
                <button
                  onClick={() => handleNavClick('national', '#/portal/national')}
                  className={`sidebar-nav-item ${currentTab === 'national' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: currentTab === 'national' ? '1px solid #dc2626' : '1px solid transparent',
                    background: currentTab === 'national' ? 'rgba(220, 38, 38, 0.22)' : 'transparent',
                    color: currentTab === 'national' ? '#fca5a5' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: currentTab === 'national' ? 800 : 600,
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="National Health Ministry Overwatch (All-India Layer)"
                >
                  <Globe size={18} color={currentTab === 'national' ? '#ef4444' : '#94a3b8'} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{t.nationalView || 'National Overwatch'}</span>}
                </button>
              )}

              {/* State View */}
              {(isNational || isState || isDeveloper) && (
                <button
                  onClick={() => handleNavClick('state', '#/portal/state')}
                  className={`sidebar-nav-item ${currentTab === 'state' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: currentTab === 'state' ? '1px solid #16a34a' : '1px solid transparent',
                    background: currentTab === 'state' ? 'rgba(22, 163, 74, 0.22)' : 'transparent',
                    color: currentTab === 'state' ? '#86efac' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: currentTab === 'state' ? 800 : 600,
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="State Health Directorate (Maharashtra, Karnataka, UP)"
                >
                  <Layers size={18} color={currentTab === 'state' ? '#22c55e' : '#94a3b8'} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{t.stateView || 'State Directorate'}</span>}
                </button>
              )}

              {/* District View */}
              {(isNational || isState || isDistrict || isDeveloper) && (
                <button
                  onClick={() => handleNavClick('district', '#/portal/district')}
                  className={`sidebar-nav-item ${currentTab === 'district' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: currentTab === 'district' ? '1px solid #f97316' : '1px solid transparent',
                    background: currentTab === 'district' ? 'rgba(249, 115, 22, 0.22)' : 'transparent',
                    color: currentTab === 'district' ? '#fed7aa' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: currentTab === 'district' ? 800 : 600,
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="District Health Officer (Nashik District Clinics & Transfers)"
                >
                  <MapPin size={18} color={currentTab === 'district' ? '#f97316' : '#94a3b8'} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{t.districtView || 'District Clinics'}</span>}
                </button>
              )}

              {/* PHC Details / Telemetry */}
              {(isNational || isState || isDistrict || isPHC || isDeveloper) && (
                <button
                  onClick={() => handleNavClick('phc', '#/portal/phc')}
                  className={`sidebar-nav-item ${currentTab === 'phc' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: currentTab === 'phc' ? '1px solid #0284c7' : '1px solid transparent',
                    background: currentTab === 'phc' ? 'rgba(2, 132, 199, 0.22)' : 'transparent',
                    color: currentTab === 'phc' ? '#bae6fd' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: currentTab === 'phc' ? 800 : 600,
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="Primary Health Centre (PHC) Telemetry & Stock Depletion Curve"
                >
                  <Building size={18} color={currentTab === 'phc' ? '#38bdf8' : '#94a3b8'} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{t.phcDetail || 'Clinic Telemetry'}</span>}
                </button>
              )}
            </div>
          </div>

          {/* Section C: DATA ENTRY TERMINALS */}
          <div>
            {!sidebarCollapsed && (
              <div style={{ padding: '0.2rem 0.6rem 0.4rem 0.6rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Data Entry & Surveillance
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {/* PHC Offline Edge Terminal */}
              <button
                onClick={() => handleNavClick('edge', '#/portal/edge')}
                className={`sidebar-nav-item ${currentTab === 'edge' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: currentTab === 'edge' ? '1px solid #ea580c' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: currentTab === 'edge' ? 'rgba(234, 88, 12, 0.3)' : 'rgba(255, 255, 255, 0.03)',
                  color: currentTab === 'edge' ? '#fed7aa' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: currentTab === 'edge' ? 800 : 600,
                  transition: 'all 0.15s ease',
                  width: '100%',
                  textAlign: 'left'
                }}
                title="PHC Data Entry Terminal (Works 100% Offline with Auto-Sync)"
              >
                <FileSpreadsheet size={18} color={currentTab === 'edge' ? '#f97316' : '#ea580c'} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{t.edgeEntry || 'Clinic Data Entry'}</span>
                    <span style={{ fontSize: '0.62rem', background: '#16a34a', color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 800 }}>
                      OFFLINE
                    </span>
                  </div>
                )}
              </button>

              {/* Hospital Data Entry (when role is hospital) */}
              {isHospital && (
                <button
                  onClick={() => {
                    handleNavClick('hospital', '#/portal/hospital');
                    window.dispatchEvent(new CustomEvent('switch-hospital-tab', { detail: 'data_entry' }));
                  }}
                  className="sidebar-nav-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    background: 'rgba(22, 163, 74, 0.15)',
                    color: '#86efac',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="Hospital Inpatient Admissions & Medical Triage"
                >
                  <Stethoscope size={18} color="#22c55e" style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>Hospital Triage Entry</span>}
                </button>
              )}
            </div>
          </div>

          {/* Section D: ADMINISTRATION & SANDBOX */}
          {(isDeveloper || isNational) && (
            <div>
              {!sidebarCollapsed && (
                <div style={{ padding: '0.2rem 0.6rem 0.4rem 0.6rem', fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Platform Admin
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <button
                  onClick={() => handleNavClick('dev', '#/portal/developer')}
                  className={`sidebar-nav-item ${currentTab === 'dev' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed ? '0.65rem 0' : '0.65rem 0.85rem',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '8px',
                    border: currentTab === 'dev' ? '1px solid #ea580c' : '1px solid transparent',
                    background: currentTab === 'dev' ? 'rgba(234, 88, 12, 0.25)' : 'transparent',
                    color: currentTab === 'dev' ? '#fed7aa' : '#cbd5e1',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    fontWeight: currentTab === 'dev' ? 800 : 600,
                    transition: 'all 0.15s ease',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  title="Developer Console & Disease Outbreak Stress Simulator"
                >
                  <Code size={18} color={currentTab === 'dev' ? '#f97316' : '#94a3b8'} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{t.devConsole || 'Admin & Test Console'}</span>}
                </button>
              </div>
            </div>
          )}

          {/* Section E: QUICK LINKS & DOCS */}
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              
              {/* System Guide Modal Trigger */}
              <button
                onClick={() => {
                  if (onOpenGuide) onOpenGuide();
                  if (mobileSidebarOpen && setMobileSidebarOpen) setMobileSidebarOpen(false);
                }}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.55rem 0' : '0.55rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  width: '100%',
                  textAlign: 'left'
                }}
                title="System Tour & Architecture Guide"
              >
                <Lightbulb size={16} color="#f97316" style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>System Guide & Tour</span>}
              </button>

              {/* FAQ Link */}
              <a
                href="#/faq"
                onClick={() => {
                  if (mobileSidebarOpen && setMobileSidebarOpen) setMobileSidebarOpen(false);
                }}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.55rem 0' : '0.55rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                title="Frequently Asked Questions & Docs"
              >
                <HelpCircle size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>FAQ & Knowledge Base</span>}
              </a>

              {/* Home Link */}
              <a
                href="#/"
                onClick={() => {
                  if (mobileSidebarOpen && setMobileSidebarOpen) setMobileSidebarOpen(false);
                }}
                className="sidebar-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.55rem 0' : '0.55rem 0.85rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                title="Return to Main Portal Landing Page"
              >
                <Home size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>Back to Home</span>}
              </a>
            </div>
          </div>

        </div>

        {/* 4. Sidebar Footer with Logout */}
        <div
          style={{
            padding: sidebarCollapsed ? '0.75rem 0.4rem' : '0.85rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <button
            onClick={() => {
              window.location.hash = '#/login';
              if (onLogout) onLogout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '0.55rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
              width: '100%',
              transition: 'background 0.15s ease'
            }}
            title="Logout and return to Login Gateway"
          >
            <LogOut size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>{t.logout || 'Logout'}</span>}
          </button>

          {!sidebarCollapsed && (
            <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
              SwasthyaSetu AI • Production v2.4
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
