import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NationalDashboard from './pages/NationalDashboard';
import StateDashboard from './pages/StateDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import PHCDetailView from './pages/PHCDetailView';
import PHCEdgeApp from './pages/PHCEdgeApp';
import EmergencyModeView from './pages/EmergencyModeView';
import DeveloperAdminPanel from './pages/DeveloperAdminPanel';
import AIRouteOptimizerView from './pages/AIRouteOptimizerView';
import { translations } from './services/i18n';

// Default demo profiles for direct portal URL access
const DEMO_PROFILES = {
  phc: {
    role: 'phc',
    username: 'staff.nashik01@swasthya.gov.in',
    displayName: 'Dr. Ramesh Patil (Clinic Doctor)',
    phcId: 'PHC-MH-NAS-01',
    district: 'Nashik',
    stateId: 'ST-MH'
  },
  edge: {
    role: 'phc',
    username: 'staff.nashik01@swasthya.gov.in',
    displayName: 'Dr. Ramesh Patil (Clinic Doctor)',
    phcId: 'PHC-MH-NAS-01',
    district: 'Nashik',
    stateId: 'ST-MH'
  },
  district: {
    role: 'district',
    username: 'dho.nashik@health.mh.gov.in',
    displayName: 'Dr. Suresh Kulkarni (District Health Officer)',
    district: 'Nashik',
    stateId: 'ST-MH'
  },
  state: {
    role: 'state',
    username: 'director.health@maharashtra.gov.in',
    displayName: 'State Health Admin (Maharashtra)',
    stateId: 'ST-MH'
  },
  national: {
    role: 'national',
    username: 'officer.nhm@gov.in',
    displayName: 'Executive Health Director (National Health Ministry)'
  },
  developer: {
    role: 'developer',
    username: 'dev.admin@swasthyasetu.ai',
    displayName: 'Lead Platform Admin'
  },
  dev: {
    role: 'developer',
    username: 'dev.admin@swasthyasetu.ai',
    displayName: 'Lead Platform Admin'
  },
  routes: {
    role: 'national',
    username: 'officer.nhm@gov.in',
    displayName: 'Logistics Directorate (National)'
  },
  emergency: {
    role: 'national',
    username: 'officer.nhm@gov.in',
    displayName: 'National Emergency Response Director'
  }
};

// Route parser helper
function parseHash(hashStr) {
  const clean = (hashStr || '').replace(/^#\/?/, '').trim();
  const parts = clean.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    return { type: 'landing', sub: 'home', param: null };
  }
  
  const root = parts[0].toLowerCase();
  
  if (['features', 'portals', 'architecture', 'credits'].includes(root)) {
    return { type: 'landing', sub: root, param: null };
  }
  
  if (root === 'login') {
    return { type: 'login', sub: parts[1] || 'phc', param: null };
  }
  
  if (root === 'portal') {
    const portalType = (parts[1] || 'national').toLowerCase();
    const param = parts[2] ? decodeURIComponent(parts[2]) : null;
    return { type: 'portal', sub: portalType, param };
  }
  
  return { type: 'landing', sub: 'home', param: null };
}

export default function App() {
  // Splash Screen State (shown on first visit in session)
  const [showSplash, setShowSplash] = useState(true);

  // Authentication & Current User Role State initialized from sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('swasthya_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current Route parsed from window.location.hash
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  // Portal State
  const [currentTab, setCurrentTab] = useState('national'); // national, state, district, phc, edge, dev, route
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Language State with persistence in localStorage
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('swasthya_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const handleSetLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('swasthya_lang', newLang);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  };
  
  // Navigation drill-down state
  const [selectedState, setSelectedState] = useState('ST-MH');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [selectedPHC, setSelectedPHC] = useState('PHC-MH-NAS-01');
  const [routeOriginPHC, setRouteOriginPHC] = useState('PHC-MH-PUN-01');
  const [routeDestPHC, setRouteDestPHC] = useState('PHC-MH-NAS-01');

  // Synchronize route changes from URL hash
  const syncRouteFromHash = useCallback(() => {
    const parsed = parseHash(window.location.hash);
    setRoute(parsed);

    if (parsed.type === 'portal') {
      if (parsed.sub === 'emergency') {
        setEmergencyMode(true);
      } else {
        setEmergencyMode(false);
        if (['national', 'state', 'district', 'phc', 'edge', 'dev', 'developer', 'routes', 'route'].includes(parsed.sub)) {
          const tab = parsed.sub === 'developer' ? 'dev' : (parsed.sub === 'routes' ? 'route' : parsed.sub);
          setCurrentTab(tab);
        }
      }

      // Handle parameters for deep-linked portals
      if (parsed.sub === 'state' && parsed.param) {
        setSelectedState(parsed.param);
      } else if (parsed.sub === 'district' && parsed.param) {
        setSelectedDistrict(parsed.param);
      } else if ((parsed.sub === 'phc' || parsed.sub === 'edge') && parsed.param) {
        setSelectedPHC(parsed.param);
      }

      // Auto-provision demo session if user is opening a direct portal link without prior login
      setCurrentUser(prevUser => {
        if (!prevUser) {
          const demoKey = parsed.sub === 'dev' ? 'developer' : (parsed.sub === 'routes' ? 'national' : parsed.sub);
          const demoProfile = DEMO_PROFILES[demoKey] || DEMO_PROFILES.national;
          try {
            sessionStorage.setItem('swasthya_user', JSON.stringify(demoProfile));
          } catch (e) {
            console.error('SessionStorage error:', e);
          }
          return demoProfile;
        }
        return prevUser;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', syncRouteFromHash);
    window.addEventListener('popstate', syncRouteFromHash);
    syncRouteFromHash();

    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      window.removeEventListener('popstate', syncRouteFromHash);
    };
  }, [syncRouteFromHash]);

  // Custom events
  useEffect(() => {
    const handleRouteOpt = (e) => {
      if (e.detail?.fromId) setRouteOriginPHC(e.detail.fromId);
      if (e.detail?.toId) setRouteDestPHC(e.detail.toId);
      setEmergencyMode(false);
      setCurrentTab('route');
      window.location.hash = '#/portal/routes';
    };
    const handleSelectStateEvt = (e) => {
      if (e.detail) {
        setSelectedState(e.detail);
        setCurrentTab('state');
        window.location.hash = `#/portal/state/${encodeURIComponent(e.detail)}`;
      }
    };
    window.addEventListener('view-route-optimizer', handleRouteOpt);
    window.addEventListener('select-state', handleSelectStateEvt);
    return () => {
      window.removeEventListener('view-route-optimizer', handleRouteOpt);
      window.removeEventListener('select-state', handleSelectStateEvt);
    };
  }, []);

  const t = translations[lang] || translations.en;

  // Handle Login event
  const handleLogin = (userProfile) => {
    setCurrentUser(userProfile);
    try {
      sessionStorage.setItem('swasthya_user', JSON.stringify(userProfile));
    } catch (e) {
      console.error('Session storage error:', e);
    }
    
    if (userProfile.role === 'phc') {
      const phc = userProfile.phcId || 'PHC-MH-NAS-01';
      setSelectedPHC(phc);
      setSelectedDistrict(userProfile.district || 'Nashik');
      setSelectedState(userProfile.stateId || 'ST-MH');
      setCurrentTab('edge');
      window.location.hash = `#/portal/edge/${phc}`;
    } else if (userProfile.role === 'district') {
      const dist = userProfile.district || 'Nashik';
      setSelectedDistrict(dist);
      setSelectedState(userProfile.stateId || 'ST-MH');
      setCurrentTab('district');
      window.location.hash = `#/portal/district/${encodeURIComponent(dist)}`;
    } else if (userProfile.role === 'state') {
      const st = userProfile.stateId || 'ST-MH';
      setSelectedState(st);
      setCurrentTab('state');
      window.location.hash = `#/portal/state/${encodeURIComponent(st)}`;
    } else if (userProfile.role === 'developer') {
      setCurrentTab('dev');
      window.location.hash = '#/portal/developer';
    } else {
      setCurrentTab('national');
      window.location.hash = '#/portal/national';
    }
  };

  // Fixed Logout: clears session and lands on Login Page directly
  const handleLogout = () => {
    try {
      sessionStorage.removeItem('swasthya_user');
    } catch (e) {
      console.error('Session storage remove error:', e);
    }
    setCurrentUser(null);
    setEmergencyMode(false);
    window.location.hash = '#/login';
  };

  const handleLaunchPortal = (roleId = null) => {
    if (roleId) {
      window.location.hash = `#/login/${roleId}`;
    } else {
      window.location.hash = '#/login';
    }
  };

  // Handle drill down events with URL routing
  const handleSelectState = (stateId) => {
    setSelectedState(stateId);
    setCurrentTab('state');
    window.location.hash = `#/portal/state/${encodeURIComponent(stateId)}`;
  };

  const handleSelectDistrict = (districtName) => {
    setSelectedDistrict(districtName);
    setCurrentTab('district');
    window.location.hash = `#/portal/district/${encodeURIComponent(districtName)}`;
  };

  const handleSelectPHC = (phcId) => {
    setSelectedPHC(phcId);
    setCurrentTab('phc');
    window.location.hash = `#/portal/phc/${encodeURIComponent(phcId)}`;
  };

  return (
    <div>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Multi-page Router View 1: Login Gateway Page */}
      {route.type === 'login' && (
        <div style={{ position: 'relative' }}>
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#/';
            }}
            style={{
              position: 'fixed',
              top: '16px',
              right: '20px',
              zIndex: 1000,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              minHeight: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              textDecoration: 'none',
              transition: 'transform 0.15s ease, background 0.15s ease'
            }}
            title="Return to Main Home Portal"
          >
            ← {t.backToDashboard || 'Back to Home'}
          </a>
          <LoginPage 
            onLogin={handleLogin} 
            lang={lang} 
            setLang={handleSetLang} 
            initialRole={route.sub || 'phc'} 
          />
        </div>
      )}

      {/* Multi-page Router View 2: Landing Multi-Pages (Home, Features, Portals, Architecture, Credits) */}
      {route.type === 'landing' && (
        <LandingPage
          onLaunchPortal={() => handleLaunchPortal()}
          onSelectRole={(roleId) => handleLaunchPortal(roleId)}
          lang={lang}
          setLang={handleSetLang}
          initialLandingPage={route.sub || 'home'}
        />
      )}

      {/* Multi-page Router View 3: Operational Portal Hub */}
      {route.type === 'portal' && (
        <div className="app-container">
          <Header
            user={currentUser || DEMO_PROFILES.national}
            onLogout={handleLogout}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            emergencyMode={emergencyMode}
            setEmergencyMode={setEmergencyMode}
            lang={lang}
            setLang={handleSetLang}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedPHC={selectedPHC}
          />

          <main className="main-content">
            {emergencyMode ? (
              <EmergencyModeView 
                onClose={() => {
                  setEmergencyMode(false);
                  window.location.hash = `#/portal/${currentTab}`;
                }} 
                lang={lang} 
              />
            ) : (
              <>
                {currentTab === 'national' && (
                  <NationalDashboard
                    onSelectState={handleSelectState}
                    onSelectPHC={handleSelectPHC}
                    lang={lang}
                  />
                )}

                {currentTab === 'state' && (
                  <StateDashboard
                    stateId={selectedState}
                    onSelectDistrict={handleSelectDistrict}
                    onSelectPHC={handleSelectPHC}
                    onBackToNational={() => {
                      setCurrentTab('national');
                      window.location.hash = '#/portal/national';
                    }}
                    lang={lang}
                  />
                )}

                {currentTab === 'district' && (
                  <DistrictDashboard
                    districtName={selectedDistrict}
                    onSelectPHC={handleSelectPHC}
                    onBackToState={() => {
                      setCurrentTab('state');
                      window.location.hash = `#/portal/state/${encodeURIComponent(selectedState)}`;
                    }}
                    lang={lang}
                  />
                )}

                {currentTab === 'phc' && (
                  <PHCDetailView
                    phcId={selectedPHC}
                    onBack={() => {
                      if (currentUser?.role === 'phc') {
                        setCurrentTab('edge');
                        window.location.hash = `#/portal/edge/${encodeURIComponent(selectedPHC)}`;
                      } else {
                        setCurrentTab('district');
                        window.location.hash = `#/portal/district/${encodeURIComponent(selectedDistrict)}`;
                      }
                    }}
                    lang={lang}
                  />
                )}

                {currentTab === 'edge' && (
                  <PHCEdgeApp
                    phcId={selectedPHC}
                    lang={lang}
                  />
                )}

                {currentTab === 'dev' && (
                  <DeveloperAdminPanel
                    lang={lang}
                  />
                )}

                {currentTab === 'route' && (
                  <AIRouteOptimizerView
                    lang={lang}
                    initialOrigin={routeOriginPHC || "PHC-MH-PUN-01"}
                    initialDest={routeDestPHC || "PHC-MH-NAS-01"}
                    onSelectPHC={handleSelectPHC}
                  />
                )}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
