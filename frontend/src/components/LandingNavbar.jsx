import React, { useState } from 'react';
import { LogIn, Menu, X, Sparkles, Key, Layers, Users } from 'lucide-react';
import { translations } from '../services/i18n';
import LanguageSelector from './LanguageSelector';

export default function LandingNavbar({ 
  onLaunchPortal, 
  lang, 
  setLang,
  onNavigatePage,
  activePage = 'home'
}) {
  const t = translations[lang] || translations.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId, sectionId) => {
    setMobileMenuOpen(false);
    if (pageId === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${pageId}`;
    }
    if (onNavigatePage) {
      onNavigatePage(pageId);
    }
  };

  const handleLaunchClick = () => {
    if (onLaunchPortal) {
      onLaunchPortal();
    } else {
      window.location.hash = '#/login';
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
        <a 
          href="#/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flexShrink: 0, textDecoration: 'none' }} 
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
        >
          <img
            src="/assets/swasthyasetu_icon_only.png"
            alt="SwasthyaSetu Icon"
            style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#ffffff' }}>
              SwasthyaSetu <span style={{ color: '#f97316' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#fed7aa', fontWeight: 600, letterSpacing: '0.03em' }}>
              {t.fedBadge}
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="landing-nav-links" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <a
            href="#/"
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              color: activePage === 'home' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'home' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            Home
          </a>

          <a
            href="#/features"
            onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              color: activePage === 'features' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'features' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            {t.navFeatures}
          </a>

          <a
            href="#/portals"
            onClick={(e) => { e.preventDefault(); handleNavClick('portals'); }}
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              color: activePage === 'portals' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'portals' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            {t.navPortals}
          </a>

          <a
            href="#/architecture"
            onClick={(e) => { e.preventDefault(); handleNavClick('architecture'); }}
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              color: activePage === 'architecture' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'architecture' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            Architecture
          </a>

          <a
            href="#/credits"
            onClick={(e) => { e.preventDefault(); handleNavClick('credits'); }}
            style={{
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              color: activePage === 'credits' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'credits' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            Team Credits
          </a>

          <a
            href="#/faq"
            onClick={(e) => { e.preventDefault(); handleNavClick('faq'); }}
            style={{
              textDecoration: 'none',
              background: activePage === 'faq' ? 'rgba(234, 88, 12, 0.25)' : 'none',
              border: activePage === 'faq' ? '1px solid #f97316' : '1px solid transparent',
              borderRadius: '6px',
              padding: '0.2rem 0.55rem',
              color: activePage === 'faq' ? '#f97316' : '#ffffff',
              fontSize: '0.88rem',
              fontWeight: activePage === 'faq' ? 800 : 600,
              cursor: 'pointer'
            }}
          >
            {t.navFaq || 'FAQ'}
          </a>
        </div>

        {/* Right Action Buttons with Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LanguageSelector lang={lang} setLang={setLang} isDark={true} />

          <button
            onClick={handleLaunchClick}
            className="btn-primary-action btn-pulse-glow"
            style={{
              padding: '0.5rem 1rem',
              fontSize: 'var(--text-sm, 0.875rem)',
              minHeight: '44px'
            }}
          >
            <LogIn size={15} /> <span>{t.launchPortal}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="btn-ghost-action mobile-nav-toggle"
            style={{
              display: 'none',
              minHeight: '44px',
              minWidth: '44px',
              padding: '0.45rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            gap: '0.5rem'
          }}
        >
          <button
            onClick={() => handleNavClick('home')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('features')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {t.navFeatures}
          </button>
          <button
            onClick={() => handleNavClick('portals')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {t.navPortals}
          </button>
          <button
            onClick={() => handleNavClick('architecture')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            Architecture
          </button>
          <button
            onClick={() => handleNavClick('credits')}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1rem', fontWeight: 600, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            Team Credits
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '1rem', fontWeight: 700, textAlign: 'left', padding: '0.6rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {t.navFaq || 'FAQ & Knowledge Base'}
          </button>
        </div>
      )}
    </>
  );
}
