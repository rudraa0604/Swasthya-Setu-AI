import React from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '../../../services/i18n';

export default function RolePortalsSection({ roleStations, onSelectRole, onLaunchPortal, lang }) {
  const t = translations[lang] || translations.en;

  return (
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
                onClick={() => {
                  window.location.hash = `#/login/${st.roleId}`;
                  if (onSelectRole) onSelectRole(st.roleId);
                }}
                style={{
                  background: 'rgba(20, 25, 35, 0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
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
                    <div style={{ background: `${st.color}25`, border: `1px solid ${st.color}60`, padding: '0.45rem', borderRadius: '8px' }}>
                      <Icon size={18} color={st.color} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: st.color, background: `${st.color}20`, border: `1px solid ${st.color}50`, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                      {st.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{st.title}</h3>
                  <div style={{ fontSize: '0.75rem', color: '#fed7aa', marginBottom: '0.75rem' }}>{st.subtitle}</div>
                  <p style={{ fontSize: '0.82rem', color: '#f1f5f9', lineHeight: 1.5, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{st.desc}</p>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontSize: '0.82rem', fontWeight: 700 }}>
                  {t.enterStation} &rarr;
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Launch Button */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <button
            onClick={() => {
              window.location.hash = '#/login';
              if (onLaunchPortal) onLaunchPortal();
            }}
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #16a34a 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem clamp(1.5rem, 4vw, 2.5rem)',
              borderRadius: '10px',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(234, 88, 12, 0.45)',
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
  );
}
