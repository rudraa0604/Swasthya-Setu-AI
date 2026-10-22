import React from 'react';
import { ShieldAlert, Wifi, Globe, Layers, MapPin, Building, Building2, AlertTriangle, LogOut, Code, Navigation, Sparkles, FileSpreadsheet } from 'lucide-react';
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
  selectedPHC
}) {
  const t = translations[lang] || translations.en;
  const role = user?.role || 'national';

  return (
    <header className="navbar">
      <div className="nav-left">
        <a 
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#/';
          }}
          className="logo-badge" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          title="Return to Main Home Landing Page"
        >
          <img 
            src="/assets/swasthyasetu_icon_only.png" 
            alt="SwasthyaSetu Logo" 
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/assets/SwasthyaSetu AI.png';
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, lineHeight: 1.1, color: '#0f172a' }}>{t.appTitle}</h1>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
              <span className="sub-tag">{t.fedBadge}</span>
              <span className="sim-banner">
                <AlertTriangle size={12} /> {t.simulatedDataBadge}
              </span>
            </div>
          </div>
        </a>
      </div>

      <div className="nav-right">
        {/* Role-Constrained Navigation Tabs */}
        <div className="nav-tabs">
          {/* Universal AI Route Optimization Feature Button */}
          <button 
            className={`nav-tab-btn ${currentTab === 'route' ? 'active' : ''}`}
            onClick={() => { 
              setEmergencyMode(false); 
              setCurrentTab('route'); 
              window.location.hash = '#/portal/routes';
            }}
            style={{
              background: currentTab === 'route' ? '#ea580c' : '#fff7ed',
              color: currentTab === 'route' ? '#ffffff' : '#ea580c',
              borderColor: '#fed7aa',
              fontWeight: 700
            }}
            title="Fast Delivery Route Planner"
          >
            <Navigation size={15} /> {t.routeOptimization || 'Smart Delivery Routes'}
          </button>

          {/* AI Private Hospitals Resource Optimizer Feature Tab */}
          <button 
            className={`nav-tab-btn ${currentTab === 'hospital' ? 'active' : ''}`}
            onClick={() => { 
              setEmergencyMode(false); 
              setCurrentTab('hospital'); 
              window.location.hash = '#/portal/hospital';
            }}
            style={{
              background: currentTab === 'hospital' ? '#0f172a' : '#f8fafc',
              color: currentTab === 'hospital' ? '#ffffff' : '#0f172a',
              borderColor: currentTab === 'hospital' ? '#0f172a' : '#cbd5e1',
              fontWeight: 700
            }}
            title="Private Hospitals AI Resource Optimizer (Beds, ICU, OT, Staff)"
          >
            <Building2 size={15} color={currentTab === 'hospital' ? '#f97316' : '#ea580c'} /> {t.privateHospitals || 'Private Hospitals'}
          </button>

          {/* Universal AI Outbreak & Demand Predictions Tab (For All Logins) */}
          <button 
            className={`nav-tab-btn ${currentTab === 'prediction' ? 'active' : ''}`}
            onClick={() => { 
              setEmergencyMode(false); 
              setCurrentTab('prediction'); 
              window.location.hash = '#/portal/prediction';
            }}
            style={{
              background: currentTab === 'prediction' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#f5f3ff',
              color: currentTab === 'prediction' ? '#ffffff' : '#6d28d9',
              borderColor: currentTab === 'prediction' ? '#7c3aed' : '#ddd6fe',
              fontWeight: 800,
              boxShadow: currentTab === 'prediction' ? '0 2px 10px rgba(124, 58, 237, 0.35)' : 'none'
            }}
            title="Dedicated AI Outbreak & Healthcare Demand Predictions (PHC, District, State, National, Hospital)"
          >
            <Sparkles size={15} color={currentTab === 'prediction' ? '#ffffff' : '#7c3aed'} /> {t.aiPrediction || 'AI Predictions'}
          </button>

          {/* Private Hospital Staff Specific Tab */}
          {role === 'hospital' && (
            <>
              <button 
                className="nav-tab-btn"
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('hospital'); 
                  window.location.hash = '#/portal/hospital';
                  window.dispatchEvent(new CustomEvent('switch-hospital-tab', { detail: 'data_entry' }));
                }}
                style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontWeight: 800 }}
                title="Enter New Inpatient Admission, Triage or Medical Supplies"
              >
                <FileSpreadsheet size={15} color="#16a34a" /> 📝 Hospital Data Entry
              </button>
            </>
          )}

          {/* Developer / Master Admin can see everything + Developer Console */}
          {role === 'developer' && (
            <>
              <button 
                className={`nav-tab-btn ${currentTab === 'dev' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('dev'); 
                  window.location.hash = '#/portal/developer';
                }}
                style={{ background: currentTab === 'dev' ? '#ea580c' : '#fff7ed', color: currentTab === 'dev' ? '#ffffff' : '#c2410c', fontWeight: 700 }}
              >
                <Code size={15} /> {t.devConsole}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'national' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('national'); 
                  window.location.hash = '#/portal/national';
                }}
              >
                <Globe size={15} /> {t.nationalView}
              </button>
              
              <button 
                className={`nav-tab-btn ${currentTab === 'state' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('state'); 
                  window.location.hash = '#/portal/state';
                }}
              >
                <Layers size={15} /> {t.stateView}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'district' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('district'); 
                  window.location.hash = '#/portal/district';
                }}
              >
                <MapPin size={15} /> {t.districtView}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'phc' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('phc'); 
                  window.location.hash = '#/portal/phc';
                }}
              >
                <Building size={15} /> {t.phcDetail}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'edge' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('edge'); 
                  window.location.hash = '#/portal/edge';
                }}
                style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontWeight: 700 }}
              >
                <FileSpreadsheet size={15} /> 📝 {t.edgeEntry || 'Clinic Data Entry'}
              </button>
            </>
          )}

          {/* National Admin can see everything */}
          {role === 'national' && (
            <>
              <button 
                className={`nav-tab-btn ${currentTab === 'national' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('national'); 
                  window.location.hash = '#/portal/national';
                }}
              >
                <Globe size={15} /> {t.nationalView}
              </button>
              
              <button 
                className={`nav-tab-btn ${currentTab === 'state' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('state'); 
                  window.location.hash = '#/portal/state';
                }}
              >
                <Layers size={15} /> {t.stateView}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'district' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('district'); 
                  window.location.hash = '#/portal/district';
                }}
              >
                <MapPin size={15} /> {t.districtView}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'phc' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('phc'); 
                  window.location.hash = '#/portal/phc';
                }}
              >
                <Building size={15} /> {t.phcDetail}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'edge' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('edge'); 
                  window.location.hash = '#/portal/edge';
                }}
                style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontWeight: 700 }}
              >
                <FileSpreadsheet size={15} /> 📝 {t.edgeEntry || 'Clinic Data Entry'}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'dev' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('dev'); 
                  window.location.hash = '#/portal/developer';
                }}
              >
                <Code size={15} /> {t.devConsole}
              </button>
            </>
          )}

          {/* State Admin: State + District + PHC inspection */}
          {role === 'state' && (
            <>
              <button 
                className={`nav-tab-btn ${currentTab === 'state' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('state'); 
                  window.location.hash = '#/portal/state';
                }}
              >
                <Layers size={15} /> {user.stateId.replace('ST-', '')} State Directorate
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'district' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('district'); 
                  window.location.hash = '#/portal/district';
                }}
              >
                <MapPin size={15} /> District Clinics
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'phc' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('phc'); 
                  window.location.hash = '#/portal/phc';
                }}
              >
                <Building size={15} /> Clinic Inspector
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'edge' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('edge'); 
                  window.location.hash = '#/portal/edge';
                }}
                style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontWeight: 700 }}
              >
                <FileSpreadsheet size={15} /> 📝 Clinic Data Entry
              </button>
            </>
          )}

          {/* District Officer: District + PHC detail */}
          {role === 'district' && (
            <>
              <button 
                className={`nav-tab-btn ${currentTab === 'district' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('district'); 
                  window.location.hash = '#/portal/district';
                }}
              >
                <MapPin size={15} /> {user.district} District Clinics
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'phc' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('phc'); 
                  window.location.hash = '#/portal/phc';
                }}
              >
                <Building size={15} /> Clinic Details
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'edge' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('edge'); 
                  window.location.hash = '#/portal/edge';
                }}
                style={{ background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa', fontWeight: 700 }}
              >
                <FileSpreadsheet size={15} /> 📝 Enter Clinic Data
              </button>
            </>
          )}

          {/* PHC Staff: Data Entry Terminal + Local Inventory */}
          {role === 'phc' && (
            <>
              <button 
                className={`nav-tab-btn ${currentTab === 'edge' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('edge'); 
                  window.location.hash = '#/portal/edge';
                }}
                style={{ background: currentTab === 'edge' ? '#ea580c' : '#fff7ed', color: currentTab === 'edge' ? '#ffffff' : '#c2410c', fontWeight: 800 }}
              >
                <Wifi size={15} /> 📝 {t.phcDataEntry || 'PHC Data Entry Terminal'}
              </button>

              <button 
                className={`nav-tab-btn ${currentTab === 'phc' ? 'active' : ''}`}
                onClick={() => { 
                  setEmergencyMode(false); 
                  setCurrentTab('phc'); 
                  window.location.hash = '#/portal/phc';
                }}
              >
                <Building size={15} /> {t.phcDetail}
              </button>
            </>
          )}
        </div>

        {/* Secondary Action Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', width: 'auto' }}>
          {/* Back to Home / Landing Multi-pages Link */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '#/';
            }}
            style={{
              background: '#f1f5f9',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              minHeight: '36px',
              boxSizing: 'border-box'
            }}
            title="Browse Website Multi-Pages"
          >
            ← Home
          </a>

          {/* Emergency Mode Toggle */}
          {(role === 'national' || role === 'district' || role === 'developer') && (
            <button 
              className={`btn-emergency-toggle ${emergencyMode ? 'active' : ''}`}
              onClick={() => {
                const nextMode = !emergencyMode;
                setEmergencyMode(nextMode);
                window.location.hash = nextMode ? '#/portal/emergency' : `#/portal/${currentTab}`;
              }}
            >
              <ShieldAlert size={15} /> {t.emergencyMode}
            </button>
          )}

          {/* Indian Language Selector Dropdown */}
          <LanguageSelector lang={lang} setLang={setLang} isDark={false} />

          {/* User Role Badge & Switch Portal / Logout Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff7ed', padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid #fed7aa', minHeight: '36px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                {user?.displayName?.split('(')[0] || 'User'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {role.toUpperCase()} • {user?.phcId || user?.district || user?.stateId || 'Root'}
              </div>
            </div>

            <button 
              className="btn-action btn-reject" 
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', minHeight: '30px', fontWeight: 700 }}
              onClick={() => {
                window.location.hash = '#/login';
                onLogout();
              }}
              title="Logout and return to Login Station"
            >
              <LogOut size={13} /> {t.logout || 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
