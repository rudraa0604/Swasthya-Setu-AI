import React from 'react';
import { 
  Building, MapPin, Layers, Globe, Code, ArrowLeft, ArrowRight, ShieldCheck, Key
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';

export default function LandingPortalsPage({ onBackToHome, onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const roleStations = [
    {
      roleId: 'phc',
      title: t.rolePhcTitle || 'Local Clinic / PHC Staff',
      subtitle: t.rolePhcSubtitle || 'Daily Medicine & Patient Entry',
      icon: Building,
      color: '#ea580c',
      badge: t.rolePhcBadge || 'Works Offline',
      desc: t.rolePhcDesc || 'Log daily medicine usage, received batches, and patient visits with automatic offline saving.',
      features: [
        'Works completely offline without active internet',
        'Automatic cloud sync once network is restored',
        'Daily patient registration and illness symptom logging',
        'Receive emergency medicine batches with 1 click'
      ]
    },
    {
      roleId: 'district',
      title: t.roleDistrictTitle || 'District Health Officer',
      subtitle: t.roleDistrictSubtitle || 'District Oversight & Approvals',
      icon: MapPin,
      color: '#f97316',
      badge: t.roleDistrictBadge || 'District Leader',
      desc: t.roleDistrictDesc || 'Monitor all clinics in the district, view shortage warnings, and approve medicine transfers.',
      features: [
        'Real-time overview of all 10+ district health clinics',
        'Fast 1-click approval for emergency medicine sharing',
        'Live hospital bed and ICU availability indicators',
        'Doctor and nursing staff attendance monitoring'
      ]
    },
    {
      roleId: 'state',
      title: t.roleStateTitle || 'State Health Directorate',
      subtitle: t.roleStateSubtitle || 'State Supply & Analytics',
      icon: Layers,
      color: '#16a34a',
      badge: t.roleStateBadge || 'State Node',
      desc: t.roleStateDesc || 'Monitor clinics across all districts and manage state-wide medical supplies safely.',
      features: [
        'Move surplus medicines between districts (e.g. Pune to Nashik)',
        'Train AI models locally without sharing patient names or records',
        'Monitor state-wide viral outbreak curves and patient trends',
        'Manage cold-chain medicine delivery vehicles'
      ]
    },
    {
      roleId: 'national',
      title: t.roleNationalTitle || 'National Health Ministry',
      subtitle: t.roleNationalSubtitle || 'All-India Health Overwatch',
      icon: Globe,
      color: '#dc2626',
      badge: t.roleNationalBadge || 'National Layer',
      desc: t.roleNationalDesc || 'National health analytics, emergency mode override, and nationwide medical coordination.',
      features: [
        'National Emergency Mode with instant highway green corridors',
        'All-India 150+ clinic real-time monitoring map',
        'Combines state AI predictions to improve national forecasting',
        'Works seamlessly with ABDM, eVIN, and HMIS databases'
      ]
    },
    {
      roleId: 'developer',
      title: t.roleDevTitle || 'Admin & Test Console',
      subtitle: t.roleDevSubtitle || 'System Testing & Simulation',
      icon: Code,
      color: '#ea580c',
      badge: t.roleDevBadge || 'Full Control',
      desc: t.roleDevDesc || 'Add clinics, tune medicine quantities, test disease outbreaks, and reset demo data.',
      features: [
        'Easily add, edit, or delete clinics and medicine stocks',
        'Simulate sudden disease surges in any district to test readiness',
        'Test route planning and road blockages in real-time',
        '1-click clean demo database re-seed button'
      ]
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang} 
        activePage="portals"
      />

      <main style={{ paddingTop: '5.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', paddingRight: 'clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            onClick={() => {
              window.location.hash = '#/';
              if (onBackToHome) onBackToHome();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f97316',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '999px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={15} /> Back to Main Portal
          </button>

          <span style={{ fontSize: '0.8rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            🔑 User Role Gateways
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Key size={14} color="#f97316" /> Designed for Every Health Worker & Official
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            User Role Portals
          </h1>
          <p style={{ color: '#fed7aa', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Select your role to access your personalized dashboard, manage local medicine supplies, approve emergency deliveries, or test the platform.
          </p>
        </div>

        {/* 5 Full Role Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
          {roleStations.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.roleId}
                style={{
                  background: 'rgba(20, 25, 35, 0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ background: `${st.color}25`, border: `1px solid ${st.color}60`, padding: '0.6rem', borderRadius: '10px' }}>
                      <Icon size={22} color={st.color} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: st.color, background: `${st.color}20`, border: `1px solid ${st.color}45`, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                      {st.badge}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {st.title}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#fed7aa', marginBottom: '0.85rem' }}>
                    {st.subtitle}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {st.desc}
                  </p>

                  <div style={{ background: 'rgba(10, 15, 25, 0.65)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Key Capabilities:
                    </div>
                    {st.features.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#f1f5f9', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: st.color, fontWeight: 700 }}>•</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    window.location.hash = `#/login/${st.roleId}`;
                    if (onSelectRole) onSelectRole(st.roleId);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${st.color} 0%, #16a34a 100%)`,
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: `0 4px 16px ${st.color}40`,
                    transition: 'transform 0.15s ease'
                  }}
                >
                  Enter {st.title} Station <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <FooterSection lang={lang} />
    </div>
  );
}
