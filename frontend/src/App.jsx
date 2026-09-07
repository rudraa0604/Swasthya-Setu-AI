import React, { useState } from 'react';
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

export default function App() {
  // Splash Screen State (shown on first visit in session)
  const [showSplash, setShowSplash] = useState(true);

  // Authentication & Current User Role State
  const [currentUser, setCurrentUser] = useState(null); // null when logged out
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [preselectedRole, setPreselectedRole] = useState(null);

  const [currentTab, setCurrentTab] = useState('national'); // national, state, district, phc, edge, dev
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [lang, setLang] = useState('en'); // en, hi
  
  // Navigation drill-down state
  const [selectedState, setSelectedState] = useState('ST-MH');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');
  const [selectedPHC, setSelectedPHC] = useState('PHC-MH-NAS-01');

  // Handle Login event
  const handleLogin = (userProfile) => {
    setCurrentUser(userProfile);
    setShowLoginModal(false);
    if (userProfile.role === 'phc') {
      setSelectedPHC(userProfile.phcId || 'PHC-MH-NAS-01');
      setSelectedDistrict(userProfile.district || 'Nashik');
      setSelectedState(userProfile.stateId || 'ST-MH');
      setCurrentTab('edge');
    } else if (userProfile.role === 'district') {
      setSelectedDistrict(userProfile.district || 'Nashik');
      setSelectedState(userProfile.stateId || 'ST-MH');
      setCurrentTab('district');
    } else if (userProfile.role === 'state') {
      setSelectedState(userProfile.stateId || 'ST-MH');
      setCurrentTab('state');
    } else if (userProfile.role === 'developer') {
      setCurrentTab('dev');
    } else {
      setCurrentTab('national');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLoginModal(false);
    setEmergencyMode(false);
  };

  const handleLaunchPortal = (roleId = null) => {
    if (roleId) {
      setPreselectedRole(roleId);
    }
    setShowLoginModal(true);
  };

  // Handle drill down events
  const handleSelectState = (stateId) => {
    setSelectedState(stateId);
    setCurrentTab('state');
  };

  const handleSelectDistrict = (districtName) => {
    setSelectedDistrict(districtName);
    setCurrentTab('district');
  };

  const handleSelectPHC = (phcId) => {
    setSelectedPHC(phcId);
    setCurrentTab('phc');
  };

  return (
    <div>
      {/* Task 2: Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* If not logged in and login portal requested */}
      {!currentUser && showLoginModal && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLoginModal(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '25px',
              zIndex: 1000,
              background: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.4rem 0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            ✕ Back to Landing Page
          </button>
          <LoginPage onLogin={handleLogin} lang={lang} setLang={setLang} initialRole={preselectedRole} />
        </div>
      )}

      {/* If not logged in and on landing page */}
      {!currentUser && !showLoginModal && (
        <LandingPage
          onLaunchPortal={() => handleLaunchPortal()}
          onSelectRole={(roleId) => handleLaunchPortal(roleId)}
          lang={lang}
          setLang={setLang}
        />
      )}

      {/* Authenticated Application Shell */}
      {currentUser && (
        <div className="app-container">
          <Header
            user={currentUser}
            onLogout={handleLogout}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            emergencyMode={emergencyMode}
            setEmergencyMode={setEmergencyMode}
            lang={lang}
            setLang={setLang}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedPHC={selectedPHC}
          />

          <main className="main-content">
            {emergencyMode ? (
              <EmergencyModeView onClose={() => setEmergencyMode(false)} lang={lang} />
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
                    lang={lang}
                  />
                )}

                {currentTab === 'district' && (
                  <DistrictDashboard
                    districtName={selectedDistrict}
                    onSelectPHC={handleSelectPHC}
                    onBackToState={() => setCurrentTab('state')}
                    lang={lang}
                  />
                )}

                {currentTab === 'phc' && (
                  <PHCDetailView
                    phcId={selectedPHC}
                    onBack={() => setCurrentTab(currentUser.role === 'phc' ? 'edge' : 'district')}
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
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
