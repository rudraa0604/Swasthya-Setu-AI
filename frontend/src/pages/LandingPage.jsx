import React from 'react';
import { 
  Activity, Shield, TrendingUp, AlertTriangle, Truck, Users, 
  Building, MapPin, Layers, Globe, Code, ArrowRight
} from 'lucide-react';
import HeroScrollCanvas from '../components/HeroScrollCanvas';
import LandingNavbar from '../components/LandingNavbar';
import { translations } from '../services/i18n';

export default function LandingPage({ onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const features = [
    {
      title: t.featStockTitle,
      icon: Activity,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.25)',
      desc: t.featStockDesc
    },
    {
      title: t.featForecastingTitle,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.25)',
      desc: t.featForecastingDesc
    },
    {
      title: t.featAlertsTitle,
      icon: AlertTriangle,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.25)',
      desc: t.featAlertsDesc
    },
    {
      title: t.featRedistributionTitle,
      icon: Truck,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.25)',
      desc: t.featRedistributionDesc
    },
    {
      title: t.featCareTitle,
      icon: Users,
      color: '#2e8b57',
      bg: 'rgba(46, 139, 87, 0.25)',
      desc: t.featCareDesc
    }
  ];

  const roleStations = [
    {
      roleId: 'phc',
      title: t.rolePhcTitle,
      subtitle: t.rolePhcSubtitle,
      icon: Building,
      color: '#0284c7',
      badge: t.rolePhcBadge,
      desc: t.rolePhcDesc
    },
    {
      roleId: 'district',
      title: t.roleDistrictTitle,
      subtitle: t.roleDistrictSubtitle,
      icon: MapPin,
      color: '#f59e0b',
      badge: t.roleDistrictBadge,
      desc: t.roleDistrictDesc
    },
    {
      roleId: 'state',
      title: t.roleStateTitle,
      subtitle: t.roleStateSubtitle,
      icon: Layers,
      color: '#8b5cf6',
      badge: t.roleStateBadge,
      desc: t.roleStateDesc
    },
    {
      roleId: 'national',
      title: t.roleNationalTitle,
      subtitle: t.roleNationalSubtitle,
      icon: Globe,
      color: '#10b981',
      badge: t.roleNationalBadge,
      desc: t.roleNationalDesc
    },
    {
      roleId: 'developer',
      title: t.roleDevTitle,
      subtitle: t.roleDevSubtitle,
      icon: Code,
      color: '#38bdf8',
      badge: t.roleDevBadge,
      desc: t.roleDevDesc
    }
  ];

  return (
    <div style={{ background: 'transparent', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Fixed Navbar */}
      <LandingNavbar onLaunchPortal={onLaunchPortal} lang={lang} setLang={setLang} />

      {/* Background Frame Sequence & Hero Section */}
      <HeroScrollCanvas onEnterPortal={onLaunchPortal} lang={lang} />

      {/* SECTION 1: 5 CORE FEATURES (Semi-transparent Glassmorphism so Background Animation Shines Through) */}
      <section 
        id="features" 
        style={{ 
          padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', 
          background: 'rgba(13, 43, 78, 0.25)', 
          backdropFilter: 'blur(4px)', 
          position: 'relative', 
          zIndex: 1, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#86efac', background: 'rgba(46, 139, 87, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', backdropFilter: 'blur(8px)' }}>
              <Shield size={14} /> {t.capabilitiesBadge}
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t.capabilitiesTitle}
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: 'clamp(0.9rem, 2vw, 1rem)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              {t.capabilitiesSubtitle}
            </p>
          </div>

          {/* 5 Feature Cards Grid (Transparent Glass Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem', width: '100%' }}>
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(19, 57, 102, 0.42)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '14px',
                    padding: '1.5rem 1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    minWidth: 0
                  }}
                  className="kpi-card-hover"
                >
                  <div>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: feat.bg, border: `1px solid ${feat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', backdropFilter: 'blur(6px)' }}>
                      <Icon size={22} color={feat.color} />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                      {feat.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.55, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                      {feat.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700 }}>
                    {t.pillar} #{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: ACCESS ROLE PORTALS (Transparent Glassmorphism) */}
      <section 
        id="portals" 
        style={{ 
          padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)', 
          background: 'rgba(10, 25, 47, 0.35)', 
          backdropFilter: 'blur(4px)', 
          position: 'relative', 
          zIndex: 1, 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t.rolesTitle}
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: 'clamp(0.9rem, 2vw, 1rem)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              {t.rolesSubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', width: '100%' }}>
            {roleStations.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.roleId}
                  onClick={() => onSelectRole(st.roleId)}
                  style={{
                    background: 'rgba(19, 57, 102, 0.42)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '12px',
                    padding: '1.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    minWidth: 0
                  }}
                  className="role-card-hover"
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ background: `${st.color}30`, border: `1px solid ${st.color}50`, padding: '0.45rem', borderRadius: '8px' }}>
                        <Icon size={18} color={st.color} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: st.color, background: `${st.color}25`, border: `1px solid ${st.color}40`, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                        {st.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{st.title}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{st.subtitle}</div>
                    <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{st.desc}</p>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
                    {t.enterStation} &rarr;
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Launch Button */}
          <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <button
              onClick={onLaunchPortal}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2e8b57 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem clamp(1.5rem, 4vw, 2.5rem)',
                borderRadius: '10px',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(2, 132, 199, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                minHeight: '44px'
              }}
            >
              {t.masterPortalBtn} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer 
        style={{ 
          background: 'rgba(7, 17, 30, 0.85)', 
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '2.5rem clamp(1rem, 4vw, 2rem)', 
          color: '#cbd5e1', 
          fontSize: '0.82rem', 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/assets/swasthyasetu_icon_only.png" alt="Icon" style={{ height: '32px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{t.appTitle}</div>
              <div>{t.footerSub}</div>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div>{t.footerBuiltFor}</div>
            <div style={{ marginTop: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
              {t.developedBy || 'Developed by:'}{' '}
              <span style={{ color: '#86efac', fontWeight: 700 }}>Rudra Pratap Chaurasiya (CSJMU KANPUR)</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
