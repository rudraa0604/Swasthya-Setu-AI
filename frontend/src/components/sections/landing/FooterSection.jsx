import React from 'react';
import { translations } from '../../../services/i18n';

export default function FooterSection({ lang }) {
  const t = translations[lang] || translations.en;

  return (
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
            <div>{t.developedBy || 'Developed by:'}</div>
            <div style={{ color: '#86efac', fontWeight: 700, marginTop: '0.2rem', lineHeight: 1.4 }}>
              Rudra Pratap Chaurasiya (CSJMU KANPUR)<br />
              Sankalp Sachan (CSJMU KANPUR)<br />
              Mohammad Sirfan (CSJMU KANPUR)
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
