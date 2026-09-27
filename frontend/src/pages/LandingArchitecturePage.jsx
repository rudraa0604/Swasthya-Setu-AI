import React from 'react';
import { 
  Layers, Shield, Cpu, Database, Wifi, Network, ArrowLeft, ArrowRight, CheckCircle2, Zap
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';

export default function LandingArchitecturePage({ onBackToHome, onLaunchPortal, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const stackLayers = [
    {
      title: "1. Local Clinic Data & Offline Storage",
      icon: Wifi,
      color: "#ea580c",
      tech: "Vite + React, Offline Local Storage, Auto-Sync Engine",
      desc: "Designed for rural areas with weak or intermittent internet. Clinic staff can record medicine use anytime, and data syncs automatically as soon as internet connects."
    },
    {
      title: "2. Privacy-Protected AI Network",
      icon: Cpu,
      color: "#16a34a",
      tech: "Privacy-Preserving Federated AI, State Health Nodes",
      desc: "Smart AI models learn patterns inside state health directorates. Zero personal patient records leave their local region or state, ensuring complete citizen privacy."
    },
    {
      title: "3. 14-Day Medicine Demand & Outbreak Predictor",
      icon: Database,
      color: "#f97316",
      tech: "Predictive Seasonal AI Models, Historical Health Curves",
      desc: "Analyzes seasonal illness trends and daily medicine usage to give health officers 14-day advance notice before any clinic runs low on vital medicines."
    },
    {
      title: "4. Emergency Delivery & Fast Route Planner",
      icon: Zap,
      color: "#dc2626",
      tech: "Smart Route Optimization, Road Hazard Bypass, Digital Pass",
      desc: "Calculates the fastest delivery routes between clinics, automatically navigates around road blockages or flooded areas, and generates express toll passes."
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang} 
        activePage="architecture"
      />

      <main style={{ paddingTop: '5.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', paddingRight: 'clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            onClick={() => {
              window.location.hash = '#/';
              if (onBackToHome) onBackToHome();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#f97316',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '999px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft size={15} /> Back to Main Portal
          </button>

          <span style={{ fontSize: '0.8rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            📐 System Architecture & Flow
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Network size={14} color="#f97316" /> Designed for Indian Healthcare Scale
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            How SwasthyaSetu AI Works
          </h1>
          <p style={{ color: '#fed7aa', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            A lightweight, reliable architecture designed for clinics across India with full support for offline operation and seamless connection with ABDM, eVIN, and HMIS.
          </p>
        </div>

        {/* 4 Architectural Tier Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {stackLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div 
                key={idx}
                style={{
                  background: 'rgba(20, 25, 35, 0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${layer.color}25`, border: `1px solid ${layer.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={layer.color} />
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {layer.title}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#f97316', fontWeight: 700, marginBottom: '0.6rem' }}>
                    🔧 {layer.tech}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.6, margin: 0 }}>
                    {layer.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onLaunchPortal}
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #16a34a 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 2.5rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(234, 88, 12, 0.45)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            Open SwasthyaSetu AI Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <FooterSection lang={lang} />
    </div>
  );
}
