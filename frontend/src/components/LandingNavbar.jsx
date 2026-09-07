import React from 'react';
import { LogIn } from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from './LanguageSelector';

export default function LandingNavbar({ onLaunchPortal, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(13, 43, 78, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff'
      }}
    >
      {/* Brand: Icon Only + Typography Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img
          src="/assets/swasthyasetu_icon_only.png"
          alt="SwasthyaSetu Icon"
          style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
        />
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#ffffff' }}>
            SwasthyaSetu <span style={{ color: '#86efac' }}>AI</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>
            {t.fedBadge}
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-only">
        <button
          onClick={() => scrollToSection('features')}
          style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {t.navFeatures}
        </button>

        <button
          onClick={() => scrollToSection('portals')}
          style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {t.navPortals}
        </button>
      </div>

      {/* Right Action Buttons with Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LanguageSelector lang={lang} setLang={setLang} isDark={true} />

        <button
          onClick={onLaunchPortal}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #2e8b57 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}
        >
          <LogIn size={15} /> {t.launchPortal}
        </button>
      </div>
    </nav>
  );
}
