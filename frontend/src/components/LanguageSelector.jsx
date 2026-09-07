import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { supportedLanguages } from '../services/i18n';

export default function LanguageSelector({ lang, setLang, isDark = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: isDark ? 'rgba(255, 255, 255, 0.12)' : '#f1f5f9',
          color: isDark ? '#ffffff' : '#0f172a',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid #cbd5e1',
          padding: '0.45rem 0.85rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.15s ease'
        }}
        title="Select Language / भाषा चुनें"
      >
        <span style={{ fontSize: '1rem' }}>{currentLangObj.flag}</span>
        <span>{currentLangObj.native}</span>
        <ChevronDown size={14} style={{ opacity: 0.8, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 9999,
            minWidth: '210px',
            maxHeight: '340px',
            overflowY: 'auto',
            background: '#0d2b4e',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
            padding: '0.4rem',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Official Language
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {supportedLanguages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'rgba(2, 132, 199, 0.35)' : 'transparent',
                    color: isSelected ? '#38bdf8' : '#e2e8f0',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{l.flag}</span>
                    <span>{l.native}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '0.2rem' }}>({l.name})</span>
                  </div>
                  {isSelected && <Check size={14} color="#38bdf8" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
