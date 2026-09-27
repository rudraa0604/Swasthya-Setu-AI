import React from 'react';
import { Shield } from 'lucide-react';
import { translations } from '../../../services/i18n';

export default function FeaturesGridSection({ features, lang }) {
  const t = translations[lang] || translations.en;

  return (
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

        {/* 5 Feature Cards Grid */}
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
  );
}
