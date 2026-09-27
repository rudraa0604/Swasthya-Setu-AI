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
      title: "1. Edge PHC Telemetry & Offline Cache",
      icon: Wifi,
      color: "#0284c7",
      tech: "Vite + React 18, LocalStorage Queue, SQLite Edge Node",
      desc: "Handles intermittent rural network connectivity with conflict-free offline FIFO transaction batching and automatic cloud reconnection synchronization."
    },
    {
      title: "2. Privacy-Preserving Federated Aggregation",
      icon: Cpu,
      color: "#10b981",
      tech: "FedAvg Algorithm, Differential Privacy DP-SGD, State Model Shards",
      desc: "Distributes model training across State Health Directorate nodes. Only mathematical gradient updates are aggregated globally; patient telemetry never leaves state boundaries."
    },
    {
      title: "3. Time-Series Epidemic Demand Engine",
      icon: Database,
      color: "#f59e0b",
      tech: "Prophet Additive Trend Regression, Scikit-Learn, Seasonality Regressors",
      desc: "Processes 45-day historical footfall curves and daily medicine consumption to forecast 14-day stock depletion horizons with upper and lower confidence intervals."
    },
    {
      title: "4. Emergency Route Pathfinder & Green Corridors",
      icon: Zap,
      color: "#8b5cf6",
      tech: "Dijkstra Multi-Criteria Cost Optimization, Haversine Matrix, GeoJSON Corridors",
      desc: "Calculates inter-facility redistribution paths balancing distance, transit time, carbon emissions, and cold-chain integrity with real-time hazard bypass rerouting."
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar onLaunchPortal={onLaunchPortal} lang={lang} setLang={setLang} />

      <main style={{ paddingTop: '5.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', paddingRight: 'clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            onClick={onBackToHome}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#38bdf8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
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

          <span style={{ fontSize: '0.8rem', color: '#818cf8', background: 'rgba(129, 140, 248, 0.25)', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            📐 Federated System Architecture
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', background: 'rgba(129, 140, 248, 0.2)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Network size={14} /> National-Scale Health Resilience Pipeline
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Technical Architecture & System Flow
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Designed for low-bandwidth, high-scale public health facilities across India. Seamless interoperability with ABDM, eVIN, and HMIS protocols.
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
                  background: 'rgba(19, 57, 102, 0.35)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${layer.color}30`, border: `1px solid ${layer.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={layer.color} />
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {layer.title}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.6rem' }}>
                    🔧 {layer.tech}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
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
              background: 'linear-gradient(135deg, #0284c7 0%, #2e8b57 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem 2.5rem',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(2, 132, 199, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            Launch Command Center <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <FooterSection lang={lang} />
    </div>
  );
}
