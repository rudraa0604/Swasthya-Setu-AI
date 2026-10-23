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
      <div style={{ maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <div 
            className="reveal-scale"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-warm, #fed7aa)', background: 'rgba(234, 88, 12, 0.25)', border: '1px solid rgba(249, 115, 22, 0.45)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: 'var(--text-xs, 0.75rem)', fontWeight: 700, marginBottom: '0.75rem', backdropFilter: 'blur(8px)' }}
          >
            <Shield size={14} color="#f97316" /> {t.capabilitiesBadge}
          </div>
          <h2 
            className="reveal-up"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--color-text-white, #ffffff)', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {t.capabilitiesTitle}
          </h2>
          <p 
            className="reveal-subtext"
            style={{ color: 'var(--color-text-warm, #fed7aa)', maxWidth: '650px', margin: '0.75rem auto 0 auto', fontSize: 'var(--text-base, 1rem)', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
          >
            {t.capabilitiesSubtitle}
          </p>
        </div>

        {/* 5 Feature Cards Grid: 5 columns on Desktop, 3+2 Centered on Tablet, 1 on Mobile */}
        <div className="capabilities-grid-container">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const staggerDelay = (idx + 1) * 100;
            return (
              <div
                key={idx}
                className={`capabilities-card reveal-up delay-${staggerDelay}`}
                style={{
                  '--glow-color': `${feat.color}45`,
                  '--i': idx
                }}
              >
                <div>
                  <div 
                    className="capability-icon-box"
                    style={{ 
                      width: '46px', 
                      height: '46px', 
                      borderRadius: '12px', 
                      background: feat.bg, 
                      border: `1px solid ${feat.color}70`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1.25rem', 
                      backdropFilter: 'blur(6px)' 
                    }}
                  >
                    <Icon size={22} color={feat.color} />
                  </div>

                  <h3 style={{ fontSize: 'var(--text-lg, 1.125rem)', fontWeight: 700, color: 'var(--color-text-white, #ffffff)', marginBottom: '0.75rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {feat.title}
                  </h3>

                  <p style={{ fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--color-text-light, #f1f5f9)', lineHeight: 1.55, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    {feat.desc}
                  </p>
                </div>

                <div 
                  className="capabilities-pillar-label"
                  style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-brand, #f97316)', fontSize: 'var(--text-xs, 0.75rem)', fontWeight: 700 }}
                >
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
