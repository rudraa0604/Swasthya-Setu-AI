import React, { useState } from 'react';
import { Shield, Building, MapPin, Layers, Globe, LogIn, CheckCircle2, Lock, ArrowRight, User, Code } from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from '../components/LanguageSelector';

export default function LoginPage({ onLogin, lang, setLang, initialRole = 'phc' }) {
  const t = translations[lang] || translations.en;
  
  const [selectedRole, setSelectedRole] = useState(initialRole || 'phc'); // phc, district, state, national, developer
  const [username, setUsername] = useState(
    initialRole === 'district' ? 'dho.nashik@health.mh.gov.in' :
    initialRole === 'state' ? 'director.health@maharashtra.gov.in' :
    initialRole === 'national' ? 'officer.nhm@gov.in' :
    initialRole === 'developer' ? 'dev.admin@swasthyasetu.ai' :
    'staff.nashik01@swasthya.gov.in'
  );
  const [password, setPassword] = useState('••••••••');
  
  // Specific scope selections
  const [phcId, setPhcId] = useState('PHC-MH-NAS-01');
  const [district, setDistrict] = useState('Nashik');
  const [stateId, setStateId] = useState('ST-MH');

  const presetRoles = [
    {
      id: 'phc',
      title: t.rolePhcTitle,
      subtitle: t.rolePhcSubtitle,
      icon: Building,
      badge: t.rolePhcBadge,
      color: '#0284c7',
      defaultUsername: 'staff.nashik01@swasthya.gov.in',
      scope: 'Nashik PHC #1 (Rural Sub-center)',
      description: t.rolePhcDesc
    },
    {
      id: 'district',
      title: t.roleDistrictTitle,
      subtitle: t.roleDistrictSubtitle,
      icon: MapPin,
      badge: t.roleDistrictBadge,
      color: '#f59e0b',
      defaultUsername: 'dho.nashik@health.mh.gov.in',
      scope: 'Nashik District (10 PHCs)',
      description: t.roleDistrictDesc
    },
    {
      id: 'state',
      title: t.roleStateTitle,
      subtitle: t.roleStateSubtitle,
      icon: Layers,
      badge: t.roleStateBadge,
      color: '#8b5cf6',
      defaultUsername: 'director.health@maharashtra.gov.in',
      scope: 'Maharashtra State (5 Districts • 50 PHCs)',
      description: t.roleStateDesc
    },
    {
      id: 'national',
      title: t.roleNationalTitle,
      subtitle: t.roleNationalSubtitle,
      icon: Globe,
      badge: t.roleNationalBadge,
      color: '#10b981',
      defaultUsername: 'officer.nhm@gov.in',
      scope: 'National Overview (3 States • 150 PHCs)',
      description: t.roleNationalDesc
    },
    {
      id: 'developer',
      title: t.roleDevTitle,
      subtitle: t.roleDevSubtitle,
      icon: Code,
      badge: t.roleDevBadge,
      color: '#0284c7',
      defaultUsername: 'dev.admin@swasthyasetu.ai',
      scope: 'Root Console (All Entities & ML Engines)',
      description: t.roleDevDesc
    }
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setUsername(role.defaultUsername);
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userProfile = {
      role: selectedRole,
      username: username,
      displayName: selectedRole === 'phc' ? 'Dr. Ramesh Patil (PHC In-Charge)' : 
                   selectedRole === 'district' ? 'Dr. Suresh Kulkarni (District Health Officer)' :
                   selectedRole === 'state' ? 'State Directorate Admin (Maharashtra)' :
                   selectedRole === 'developer' ? 'Lead Platform Developer (Master Root)' :
                   'Executive Health Director (NHM Central Ministry)',
      phcId: phcId,
      district: district,
      stateId: stateId,
      loginTime: new Date().toLocaleTimeString()
    };
    onLogin(userProfile);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1000px', width: '100%', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
        
        {/* Left Side: Role Selector */}
        <div style={{ padding: '2.5rem', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
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
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{t.appTitle}</h2>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>{t.subTitle}</div>
              </div>
            </div>

            {/* Language Selector on Login Modal */}
            {setLang && <LanguageSelector lang={lang} setLang={setLang} isDark={false} />}
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            {t.selectRole}:
          </p>

          {/* Role Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {presetRoles.map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: `2px solid ${isSelected ? role.color : '#e2e8f0'}`,
                    background: isSelected ? '#ffffff' : '#ffffff',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ background: `${role.color}15`, padding: '0.45rem', borderRadius: '8px' }}>
                        <Icon size={18} color={role.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{role.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{role.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} color={role.color} />}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                    {role.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
              <Shield size={12} /> Secure ABDM / HMIS Credential Gateway
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
              {t.signInStation}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Role: <strong>{presetRoles.find(r => r.id === selectedRole)?.title}</strong>
            </div>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Context Scope Selectors */}
            {selectedRole === 'phc' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Assigned PHC Facility
                </label>
                <select
                  value={phcId}
                  onChange={(e) => setPhcId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="PHC-MH-NAS-01">Nashik PHC #1 (Nashik, Maharashtra) — [Outbreak Focus]</option>
                  <option value="PHC-MH-NAS-02">Nashik PHC #2 (Nashik, Maharashtra)</option>
                  <option value="PHC-MH-PUN-01">Pune PHC #1 (Pune, Maharashtra) — [Surplus Hub]</option>
                  <option value="PHC-UP-LUC-01">Lucknow PHC #1 (Lucknow, Uttar Pradesh)</option>
                  <option value="PHC-KA-BEN-01">Bengaluru Rural PHC #1 (Karnataka)</option>
                </select>
              </div>
            )}

            {selectedRole === 'district' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Assigned District Jurisdiction
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Nashik">Nashik District (Maharashtra) — [Active Outbreak & Transfer Demands]</option>
                  <option value="Pune">Pune District (Maharashtra) — [Surplus Depot]</option>
                  <option value="Lucknow">Lucknow District (Uttar Pradesh)</option>
                  <option value="Bengaluru Rural">Bengaluru Rural District (Karnataka)</option>
                </select>
              </div>
            )}

            {selectedRole === 'state' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Assigned State Node
                </label>
                <select
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="ST-MH">Maharashtra State Health Directorate</option>
                  <option value="ST-KA">Karnataka State Health Directorate</option>
                  <option value="ST-UP">Uttar Pradesh State Health Directorate</option>
                </select>
              </div>
            )}

            {/* Email / Username */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                {t.username}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                {t.password}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-action btn-primary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, justifyContent: 'center' }}
            >
              <LogIn size={18} /> {t.enterPortal} ({presetRoles.find(r => r.id === selectedRole)?.title.split(' ')[0]})
            </button>
          </form>

          {/* Privacy Note */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
            🔒 {t.privacyBadge}
          </div>
        </div>

      </div>
    </div>
  );
}
