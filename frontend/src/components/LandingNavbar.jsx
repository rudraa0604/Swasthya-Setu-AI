import React, { useState } from 'react';
import { LogIn, Menu, X } from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from './LanguageSelector';

export default function LandingNavbar({ onLaunchPortal, lang, setLang }) {
  const t = translations[lang] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(13, 43, 78, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.65rem clamp(0.75rem, 3vw, 2rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand: Icon + Typography Wordmark */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flexShrink: 0 }} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/assets/swasthyasetu_icon_only.png"
            alt="SwasthyaSetu Icon"
            style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#ffffff' }}>
              SwasthyaSetu <span style={{ color: '#86efac' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.03em' }}>
              {t.fedBadge}
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="landing-nav-links">
          <button
            onClick={() => scrollToSection('features')}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {t.navFeatures}
          </button>

          <button
            onClick={() => scrollToSection('portals')}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {t.navPortals}
          </button>
        </div>

        {/* Right Action Buttons with Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSelector lang={lang} setLang={setLang} isDark={true} />

          <button
            onClick={onLaunchPortal}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2e8b57 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              whiteSpace: 'nowrap',
              minHeight: '36px'
            }}
          >
            <LogIn size={14} /> {t.launchPortal}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.35rem',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '55px',
            left: 0,
            right: 0,
            background: 'rgba(13, 43, 78, 0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '1.25rem 1.5rem',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <button
            onClick={() => scrollToSection('features')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.5rem 0', cursor: 'pointer' }}
          >
            {t.navFeatures}
          </button>
          <button
            onClick={() => scrollToSection('portals')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.5rem 0', cursor: 'pointer' }}
          >
            {t.navPortals}
          </button>
        </div>
      )}
    </>
  );
}
