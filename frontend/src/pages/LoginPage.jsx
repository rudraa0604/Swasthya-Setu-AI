import React, { useState } from 'react';
import { 
  Shield, Building, MapPin, Layers, Globe, LogIn, 
  CheckCircle2, Lock, ArrowRight, User, Code, Search, 
  Zap, Sparkles, HelpCircle, Check, Info
} from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from '../components/LanguageSelector';

export default function LoginPage({ onLogin, lang, setLang, initialRole = 'phc' }) {
  const t = translations[lang] || translations.en;
  
  const [selectedRole, setSelectedRole] = useState(initialRole || 'phc');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'public', 'hospital', 'admin'
  const [searchQuery, setSearchQuery] = useState('');

  const [username, setUsername] = useState(
    initialRole === 'district' ? 'dho.nashik@health.mh.gov.in' :
    initialRole === 'state' ? 'director.health@maharashtra.gov.in' :
    initialRole === 'national' ? 'officer.nhm@gov.in' :
    initialRole === 'hospital' ? 'admin@apollohospitals.com' :
    initialRole === 'developer' ? 'dev.admin@swasthyasetu.ai' :
    'staff.nashik01@swasthya.gov.in'
  );
  const [password, setPassword] = useState('••••••••');
  
  // Specific scope selections
  const [phcId, setPhcId] = useState('PHC-MH-NAS-01');
  const [district, setDistrict] = useState('Nashik');
  const [stateId, setStateId] = useState('ST-MH');

  React.useEffect(() => {
    if (initialRole && initialRole !== selectedRole) {
      setSelectedRole(initialRole);
      if (initialRole === 'district') setUsername('dho.nashik@health.mh.gov.in');
      else if (initialRole === 'state') setUsername('director.health@maharashtra.gov.in');
      else if (initialRole === 'national') setUsername('officer.nhm@gov.in');
      else if (initialRole === 'hospital') setUsername('admin@apollohospitals.com');
      else if (initialRole === 'developer') setUsername('dev.admin@swasthyasetu.ai');
      else setUsername('staff.nashik01@swasthya.gov.in');
    }
  }, [initialRole]);

  const presetRoles = [
    {
      id: 'phc',
      category: 'public',
      tier: 'Tier 1 • Grassroots Clinic',
      title: t.rolePhcTitle || 'Local Clinic / PHC Staff',
      subtitle: t.rolePhcSubtitle || 'Daily Medicine & Patient Entry',
      icon: Building,
      badge: t.rolePhcBadge || 'Works Offline',
      color: '#ea580c',
      defaultUsername: 'staff.nashik01@swasthya.gov.in',
      scope: 'Nashik Clinic #1 (Rural Center)',
      description: t.rolePhcDesc || 'Enter daily medicine usage, patient visits, and new stock. Automatically saves and syncs when internet connects.',
      pills: ['📶 Works Offline', '📋 OPD Patient Log', '⚡ Auto-Cloud Sync'],
      stats: '1 Rural Clinic • 12 Beds • Nashik Focus',
      whatYouCanDo: [
        'Log individual patient consultations with rapid test results and symptoms',
        'Record dispensed medicine batches with automatic offline IndexedDB saving',
        'Auto-sync safely with state servers the moment network is restored'
      ]
    },
    {
      id: 'district',
      category: 'public',
      tier: 'Tier 2 • District Jurisdiction',
      title: t.roleDistrictTitle || 'District Health Officer',
      subtitle: t.roleDistrictSubtitle || 'District Oversight & Approvals',
      icon: MapPin,
      badge: t.roleDistrictBadge || 'District Leader',
      color: '#f97316',
      defaultUsername: 'dho.nashik@health.mh.gov.in',
      scope: 'Nashik District (10 Clinics)',
      description: t.roleDistrictDesc || 'Monitor all local clinics in the district, view shortage alerts, and approve medicine transfers with 1 click.',
      pills: ['🏥 10+ Clinics Monitored', '✅ 1-Click Approvals', '🚨 Outbreak Radar'],
      stats: '10 Clinics • 1 Active Outbreak • Surplus Linked',
      whatYouCanDo: [
        'Inspect early warning proximity radar for Dengue and viral clusters',
        'Review and authorize pending emergency inter-clinic medicine transfers',
        'View live doctor attendance and inpatient bed occupancy across district'
      ]
    },
    {
      id: 'state',
      category: 'public',
      tier: 'Tier 3 • State Directorate',
      title: t.roleStateTitle || 'State Health Directorate',
      subtitle: t.roleStateSubtitle || 'State Supply & Analytics',
      icon: Layers,
      badge: t.roleStateBadge || 'State Node',
      color: '#16a34a',
      defaultUsername: 'director.health@maharashtra.gov.in',
      scope: 'Maharashtra State (5 Districts • 50 Clinics)',
      description: t.roleStateDesc || 'Monitor clinics across all districts, manage state medicine reserves, and keep patient data private inside state borders.',
      pills: ['🚚 Inter-District Transfers', '🔒 Zero Data Leakage', '📈 Viral Curves'],
      stats: '5 Districts • 50 Clinics • State Depots',
      whatYouCanDo: [
        'Balance surplus inventory from depots (e.g. Pune) to deficit clinics (e.g. Nashik)',
        'Train local AI models on state servers without transferring citizen records',
        'Inspect state-wide viral outbreak curves and cold-chain reefer van routes'
      ]
    },
    {
      id: 'national',
      category: 'public',
      tier: 'Tier 4 • Apex National Hub',
      title: t.roleNationalTitle || 'National Health Ministry',
      subtitle: t.roleNationalSubtitle || 'All-India Health Overwatch',
      icon: Globe,
      badge: t.roleNationalBadge || 'National Layer',
      color: '#dc2626',
      defaultUsername: 'officer.nhm@gov.in',
      scope: 'All-India Overview (3 States • 150 Clinics)',
      description: t.roleNationalDesc || 'See nation-wide health analytics, activate emergency delivery mode, and coordinate national medical supplies.',
      pills: ['🇮🇳 150+ Clinics Map', '🚦 Green Corridor Override', '🌐 ABDM & eVIN'],
      stats: '150 Clinics • 3 States • 60 ICU Beds',
      whatYouCanDo: [
        'View nationwide real-time map with telemetry rollups across all states',
        'Activate Emergency Mode with police-escorted highway green corridors',
        'Combine federated AI weight updates to improve nationwide forecasting accuracy'
      ]
    },
    {
      id: 'hospital',
      category: 'hospital',
      tier: 'Tier 5 • Tertiary Super-Specialty',
      title: t.rolePrivateHospitalTitle || 'Private Hospitals',
      subtitle: t.rolePrivateHospitalSubtitle || 'Medical Director & Administrator',
      icon: Building,
      badge: 'Private Hospital AI',
      color: '#0284c7',
      defaultUsername: 'admin@apollohospitals.com',
      scope: 'Apollo Super Speciality Hospital (350 Beds • 45 ICU • 4 OTs)',
      description: 'Demand forecast, bed & ICU allocation, robotic OT scheduler, staff roster, emergency planner, what-if simulator.',
      pills: ['🛏️ MILP Bed Optimizer', '🤖 Robotic OT Solver', '👥 Nurse Rostering'],
      stats: '350 Beds • 45 ICU • 4 Operating Suites',
      whatYouCanDo: [
        'Run Mixed-Integer Linear Programming (MILP) bed & private suite optimizer',
        'Execute CP-SAT constraint solver for robotic, laparoscopic, and general surgeries',
        'Register live inpatient admissions and run Monte Carlo epidemic surge stress tests'
      ]
    },
    {
      id: 'developer',
      category: 'admin',
      tier: 'Tier 6 • Admin & Sandbox',
      title: t.roleDevTitle || 'Admin & Test Console',
      subtitle: t.roleDevSubtitle || 'System Testing & Simulation',
      icon: Code,
      badge: t.roleDevBadge || 'Full Control',
      color: '#ea580c',
      defaultUsername: 'dev.admin@swasthyasetu.ai',
      scope: 'Admin Console (All Clinics & Settings)',
      description: t.roleDevDesc || 'Add clinics, adjust medicine quantities, test disease outbreaks, and reset demo data.',
      pills: ['💉 Outbreak Stress Test', '📦 Modify Stock Levels', '🔄 1-Click DB Reset'],
      stats: 'Full Database CRUD • Synthetic Outbreaks',
      whatYouCanDo: [
        'Add, edit, or adjust clinic geolocation and sanctioned staff parameters',
        'Inject sudden 3.5x disease outbreaks in any district to test system resilience',
        'Perform a 1-click clean reset of all demo databases to pristine benchmarks'
      ]
    }
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setUsername(role.defaultUsername);
    window.location.hash = `#/login/${role.id}`;
    if (role.id === 'phc') {
      setPhcId('PHC-MH-NAS-01');
      setDistrict('Nashik');
      setStateId('ST-MH');
    } else if (role.id === 'district') {
      setDistrict('Nashik');
      setStateId('ST-MH');
    } else if (role.id === 'state') {
      setStateId('ST-MH');
    }
  };

  // Instant 1-click Login directly from card
  const handleInstantLaunch = (role, e) => {
    if (e) e.stopPropagation();
    handleSelectRole(role);
    const userProfile = {
      role: role.id,
      username: role.defaultUsername,
      displayName: role.id === 'phc' ? 'Dr. Ramesh Patil (Clinic Doctor)' : 
                   role.id === 'district' ? 'Dr. Suresh Kulkarni (District Health Officer)' :
                   role.id === 'state' ? 'State Health Admin (Maharashtra)' :
                   role.id === 'hospital' ? 'Dr. Anita Joshi (Medical Director - Apollo)' :
                   role.id === 'developer' ? 'Lead Platform Admin' :
                   'Executive Health Director (National Health Ministry)',
      phcId: role.id === 'phc' ? 'PHC-MH-NAS-01' : phcId,
      district: role.id === 'phc' || role.id === 'district' ? 'Nashik' : district,
      stateId: 'ST-MH',
      hospitalId: role.id === 'hospital' ? 'HOSP-PVT-APOLLO' : undefined,
      loginTime: new Date().toLocaleTimeString()
    };
    onLogin(userProfile);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const current = presetRoles.find(r => r.id === selectedRole) || presetRoles[0];
    const userProfile = {
      role: selectedRole,
      username: username,
      displayName: selectedRole === 'phc' ? 'Dr. Ramesh Patil (Clinic Doctor)' : 
                   selectedRole === 'district' ? 'Dr. Suresh Kulkarni (District Health Officer)' :
                   selectedRole === 'state' ? 'State Health Admin (Maharashtra)' :
                   selectedRole === 'hospital' ? 'Dr. Anita Joshi (Medical Director - Apollo)' :
                   selectedRole === 'developer' ? 'Lead Platform Admin' :
                   'Executive Health Director (National Health Ministry)',
      phcId: phcId,
      district: district,
      stateId: stateId,
      hospitalId: selectedRole === 'hospital' ? 'HOSP-PVT-APOLLO' : undefined,
      loginTime: new Date().toLocaleTimeString()
    };
    onLogin(userProfile);
  };

  const activeRoleObj = presetRoles.find(r => r.id === selectedRole) || presetRoles[0];

  // Filtered roles by category & search
  const filteredRoles = presetRoles.filter((r) => {
    const matchesCategory = roleFilter === 'all' || 
      (roleFilter === 'public' && r.category === 'public') ||
      (roleFilter === 'hospital' && r.category === 'hospital') ||
      (roleFilter === 'admin' && r.category === 'admin');

    const matchesSearch = searchQuery.trim() === '' || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pills.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #07111e 0%, #0c1a2d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(0.75rem, 2vw, 1.5rem)', width: '100%', boxSizing: 'border-box' }}>
      <div className="login-card-container" style={{ maxWidth: '1180px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Left Side: Role Selector */}
        <div style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', background: '#f8fafc', borderRight: '1px solid #e2e8f0', boxSizing: 'border-box', overflowY: 'auto', maxHeight: '92vh' }}>
          
          {/* Header row with logo & language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src="/assets/swasthyasetu_icon_only.png" 
                alt="SwasthyaSetu Logo" 
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/SwasthyaSetu AI.png';
                }}
              />
              <div>
                <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{t.appTitle}</h2>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ea580c' }}>{t.subTitle}</div>
              </div>
            </div>

            {setLang && <LanguageSelector lang={lang} setLang={setLang} isDark={false} />}
          </div>

          {/* User-friendly Help Explainer */}
          <div
            style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>
              <Zap size={15} color="#ea580c" />
              <span>Select any station below to inspect, or click <strong>⚡ Instant Launch</strong> to enter directly.</span>
            </div>
            <a
              href="#/faq"
              style={{
                fontSize: '0.75rem',
                color: '#ea580c',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              Need help? View FAQ &rarr;
            </a>
          </div>

          {/* Category Filter Pills & Search */}
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                style={{
                  background: roleFilter === 'all' ? '#0f172a' : '#ffffff',
                  color: roleFilter === 'all' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: roleFilter === 'all' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                All Roles (6)
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('public')}
                style={{
                  background: roleFilter === 'public' ? '#ea580c' : '#ffffff',
                  color: roleFilter === 'public' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: roleFilter === 'public' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                🏛️ Public Health (4)
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('hospital')}
                style={{
                  background: roleFilter === 'hospital' ? '#0284c7' : '#ffffff',
                  color: roleFilter === 'hospital' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: roleFilter === 'hospital' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                🏥 Private Hospital (1)
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('admin')}
                style={{
                  background: roleFilter === 'admin' ? '#475569' : '#ffffff',
                  color: roleFilter === 'admin' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: roleFilter === 'admin' ? 800 : 600,
                  cursor: 'pointer'
                }}
              >
                ⚙️ Admin Sandbox (1)
              </button>
            </div>

            {/* Quick Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Filter roles (e.g. 'offline', 'ICU', 'Nashik', 'transfer')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Role Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? role.color : '#e2e8f0'}`,
                    background: isSelected ? '#ffffff' : '#ffffff',
                    boxShadow: isSelected 
                      ? `0 6px 18px ${role.color}25, 0 2px 6px rgba(0,0,0,0.06)` 
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    minWidth: 0,
                    position: 'relative'
                  }}
                >
                  {/* Top Tier Badge & Checkmark */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: role.color,
                        background: `${role.color}15`,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {role.tier}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                        {role.stats}
                      </span>
                      {isSelected && <CheckCircle2 size={18} color={role.color} />}
                    </div>
                  </div>

                  {/* Main Role Title & Icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          background: `${role.color}18`,
                          border: `1px solid ${role.color}40`,
                          padding: '0.5rem',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={20} color={role.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                          {role.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                          {role.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Direct 1-Click Launch Button */}
                    <button
                      type="button"
                      onClick={(e) => handleInstantLaunch(role, e)}
                      style={{
                        background: `linear-gradient(135deg, ${role.color} 0%, #0f172a 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: `0 2px 8px ${role.color}40`,
                        transition: 'transform 0.15s ease'
                      }}
                      title="Directly launch this dashboard using verified demo credentials"
                    >
                      <Zap size={12} /> ⚡ Instant Launch
                    </button>
                  </div>

                  {/* Description */}
                  <div style={{ marginTop: '0.55rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                    {role.description}
                  </div>

                  {/* Capability Highlight Pills */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.55rem' }}>
                    {role.pills.map((pill, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Authentication & Custom Scope Configuration */}
        <div style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', background: '#ffffff' }}>
          
          {/* Header of Active Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-purple" style={{ whiteSpace: 'normal', textAlign: 'left' }}>
                <Shield size={12} /> ABDM & HMIS Pre-Verified Credentials
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <CheckCircle2 size={13} /> Demo Ready
              </span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0 0.2rem 0' }}>
              Sign In to {activeRoleObj.title}
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Assigned Scope: <strong>{activeRoleObj.scope}</strong>
            </div>
          </div>

          {/* "What You Can Test Inside" Feature Checklist Box */}
          <div
            style={{
              background: '#f8fafc',
              border: `1px solid ${activeRoleObj.color}35`,
              borderLeft: `4px solid ${activeRoleObj.color}`,
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeRoleObj.color, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.03em' }}>
              🎯 What You Can Test In This Station:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {activeRoleObj.whatYouCanDo.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Context Scope Selectors */}
            {selectedRole === 'phc' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  🏥 Select Test Primary Health Centre (PHC)
                </label>
                <select
                  value={phcId}
                  onChange={(e) => setPhcId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option value="PHC-MH-NAS-01">Nashik PHC #1 (Nashik, Maharashtra) — [Outbreak Focus & Low Stock]</option>
                  <option value="PHC-MH-NAS-02">Nashik PHC #2 (Nashik, Maharashtra)</option>
                  <option value="PHC-MH-PUN-01">Pune PHC #1 (Pune, Maharashtra) — [Surplus Depot Hub]</option>
                  <option value="PHC-UP-LUC-01">Lucknow PHC #1 (Lucknow, Uttar Pradesh)</option>
                  <option value="PHC-KA-BEN-01">Bengaluru Rural PHC #1 (Karnataka)</option>
                </select>
              </div>
            )}

            {selectedRole === 'district' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  📍 Assigned District Jurisdiction
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option value="Nashik">Nashik District (Maharashtra) — [Active Dengue Cluster & Approvals]</option>
                  <option value="Pune">Pune District (Maharashtra) — [Surplus Supply Depot]</option>
                  <option value="Lucknow">Lucknow District (Uttar Pradesh)</option>
                  <option value="Bengaluru Rural">Bengaluru Rural District (Karnataka)</option>
                </select>
              </div>
            )}

            {selectedRole === 'state' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  🏛️ State Health Directorate Node
                </label>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option value="ST-MH">Maharashtra State Health Directorate (5 Districts)</option>
                  <option value="ST-KA">Karnataka State Health Directorate</option>
                  <option value="ST-UP">Uttar Pradesh State Health Directorate</option>
                </select>
              </div>
            )}

            {/* Email / Username */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                {t.username} (Demo Pre-filled)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.55rem 0.6rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                />
                <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                {t.password}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.55rem 0.6rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                />
                <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Big Launch Button */}
            <button
              type="submit"
              className="btn-action btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 800,
                justifyContent: 'center',
                boxShadow: `0 6px 20px ${activeRoleObj.color}45`,
                background: `linear-gradient(135deg, ${activeRoleObj.color} 0%, #0f172a 100%)`
              }}
            >
              <LogIn size={18} /> Enter {activeRoleObj.title} &rarr;
            </button>
          </form>

          {/* Privacy Note */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
            🔒 {t.privacyBadge || 'ABDM Compliant • Zero Citizen PII Exported Outside State Borders'}
          </div>
        </div>

      </div>
    </div>
  );
}
