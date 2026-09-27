import React from 'react';
import { 
  Activity, TrendingUp, AlertTriangle, Truck, Users, 
  ArrowLeft, Shield, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';

export default function LandingFeaturesPage({ onBackToHome, onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const deepFeatures = [
    {
      title: t.featStockTitle || "Real-Time Telemetry & Stock-Out Warning",
      icon: Activity,
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.25)",
      desc: t.featStockDesc || "Tracks 150+ PHC medicine stocks, daily burn rates, and provides explainable 0.8-day critical stock-out alerts.",
      details: [
        "Real-time integration with ABDM, eVIN, and HMIS health records",
        "Threshold-based multi-tier buffer alerts (Critical < 30%, Warning < 100%)",
        "Explainable AI diagnostics detailing root cause footfall surges",
        "Automated batch expiry tracking with FEFO (First-Expired, First-Out)"
      ]
    },
    {
      title: t.featForecastingTitle || "Prophet AI 14-Day Demand Forecast",
      icon: TrendingUp,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.25)",
      desc: t.featForecastingDesc || "Predicts seasonal flu, dengue surges, and epidemiological footfalls using localized additive trend time-series models.",
      details: [
        "Additive trend decomposition with weekly and annual seasonality",
        "Uncertainty intervals with 80% & 95% confidence bounds",
        "Pre-emptive shortage notification 7-14 days ahead of crisis",
        "Local node training with zero central raw data leakage"
      ]
    },
    {
      title: t.featAlertsTitle || "Automated Early Warning Signals",
      icon: AlertTriangle,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.25)",
      desc: t.featAlertsDesc || "Monitors ICU saturation, doctor absenteeism, and footfall anomalies across district triage layers.",
      details: [
        "Epidemic cluster detection when footfall exceeds 200% baseline",
        "High-acuity ICU saturation monitoring with automatic divert alerts",
        "Medical Officer & Staff Nurse absenteeism risk scoring",
        "Priority color-coded dispatch queues with one-click resolution"
      ]
    },
    {
      title: t.featRedistributionTitle || "AI Green Corridor Redistribution",
      icon: Truck,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.25)",
      desc: t.featRedistributionDesc || "Calculates optimal inter-PHC medicine transfer paths and generates automated green corridors.",
      details: [
        "Dijkstra multi-criteria shortest and fastest pathfinder",
        "Automated FastTag & RFID emergency toll clearance pass generation",
        "Dynamic real-time landslide & flood road blockage bypass engine",
        "Multi-vehicle Fleet Vehicle Routing Problem (VRP) solver"
      ]
    },
    {
      title: t.featCareTitle || "Privacy-Preserving Federated Learning",
      icon: Users,
      color: "#2e8b57",
      bg: "rgba(46, 139, 87, 0.25)",
      desc: t.featCareDesc || "Enables state health directorates to collaboratively train AI models without raw patient health telemetry leaving state borders.",
      details: [
        "FedAvg algorithm for secure gradient weight aggregation",
        "DP-SGD Differential Privacy with mathematical epsilon guarantees",
        "State data sovereignty compliance with Indian Health Data policies",
        "Robust against network dropouts and asynchronous edge nodes"
      ]
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar onLaunchPortal={onLaunchPortal} lang={lang} setLang={setLang} />

      <main style={{ paddingTop: '5.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', paddingRight: 'clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb & Navigation Header */}
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
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={15} /> Back to Main Portal
          </button>

          <span style={{ fontSize: '0.8rem', color: '#86efac', background: 'rgba(46, 139, 87, 0.25)', border: '1px solid rgba(134, 239, 172, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            ✨ SwasthyaSetu AI Core Capabilities
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.2)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Shield size={14} /> National Health Mission AI Stack
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Architectural Capabilities & Features
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Explore how SwasthyaSetu AI combines Federated Edge Learning, Time-Series Epidemiological Forecasting, and Intelligent Emergency Route Optimization for India's Primary Health Centres.
          </p>
        </div>

        {/* Deep Dive Feature Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {deepFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                style={{
                  background: 'rgba(19, 57, 102, 0.35)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                  gap: '1.5rem',
                  alignItems: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: feat.bg, border: `1px solid ${feat.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={24} color={feat.color} />
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: feat.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Pillar #{idx + 1}
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                    {feat.title}
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {feat.desc}
                  </p>

                  <button
                    onClick={onLaunchPortal}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    Open Live Module <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ background: 'rgba(7, 17, 30, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.75rem' }}>
                    Technical Specifications & Guarantees:
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {feat.details.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                        <CheckCircle2 size={16} color="#86efac" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
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
            Access Full Platform Portal <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <FooterSection lang={lang} />
    </div>
  );
}
