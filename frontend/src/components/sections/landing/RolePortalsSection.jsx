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
          <h2 
            className="reveal-up"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--color-text-white, #ffffff)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {t.rolesTitle}
          </h2>
          <p 
            className="reveal-subtext"
            style={{ color: 'var(--color-text-muted, #94a3b8)', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: 'var(--text-base, 1rem)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            {t.rolesSubtitle}
          </p>
        </div>

        {/* 3 Rows with 2 Cards Each (6 Roles in Pairs) */}
        <div className="role-portal-rows-container">
          {[
            [roleStations[0], roleStations[1]], // Row 1: PHC + District
            [roleStations[2], roleStations[3]], // Row 2: State + National
            [roleStations[4], roleStations[5]]  // Row 3: Hospital + Developer Console
          ].map((pair, rowIndex) => (
            <div key={rowIndex} className="role-portal-row reveal-row">
              {pair.map((st, cardIndex) => {
                if (!st) return null;
                const Icon = st.icon;
                const isLeft = cardIndex === 0;
                return (
                  <div
                    key={st.roleId}
                    onClick={() => {
                      window.location.hash = `#/login/${st.roleId}`;
                      if (onSelectRole) onSelectRole(st.roleId);
                    }}
                    className={`role-portal-card ${isLeft ? 'reveal-left' : 'reveal-right'}`}
                    style={{
                      '--role-color': st.color,
                      '--role-glow': `${st.color}45`
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ background: `${st.color}25`, border: `1px solid ${st.color}70`, padding: '0.55rem', borderRadius: '10px' }}>
                          <Icon size={20} color={st.color} />
                        </div>
                        <span style={{ fontSize: 'var(--text-xs, 0.75rem)', fontWeight: 700, color: st.color, background: `${st.color}20`, border: `1px solid ${st.color}60`, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                          {st.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: 'var(--text-lg, 1.125rem)', fontWeight: 700, color: 'var(--color-text-white, #ffffff)', textShadow: '0 1px 4px rgba(0,0,0,0.4)', marginBottom: '0.35rem' }}>
                        {st.title}
                      </h3>
                      <div style={{ fontSize: 'var(--text-xs, 0.75rem)', color: 'var(--color-text-warm, #fed7aa)', marginBottom: '0.75rem', fontWeight: 600 }}>
                        {st.subtitle}
                      </div>
                      <p style={{ fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--color-text-light, #f1f5f9)', lineHeight: 1.55, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {st.desc}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-text-brand, #f97316)', fontSize: 'var(--text-sm, 0.875rem)', fontWeight: 700 }}>
                      <span>{t.enterStation}</span>
                      <ArrowRight size={16} className="role-arrow-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Master Launch Button */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 3.75rem)' }}>
          <button
            onClick={() => {
              window.location.hash = '#/login';
              if (onLaunchPortal) onLaunchPortal();
            }}
            className="btn-primary-action btn-pulse-glow"
            style={{
              padding: '0.85rem 2.4rem',
              fontSize: 'var(--text-base, 1rem)',
              minHeight: '46px'
            }}
          >
            {t.masterPortalBtn} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
