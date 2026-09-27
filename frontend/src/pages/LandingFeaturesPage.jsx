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
      title: t.featStockTitle || "Live Medicine Tracking",
      icon: Activity,
      color: "#ea580c",
      bg: "rgba(234, 88, 12, 0.22)",
      desc: t.featStockDesc || "Tracks clinic medicine stocks, daily usage, and sends instant shortage alerts.",
      details: [
        "Connects directly with Indian clinic health records (ABDM, eVIN, HMIS)",
        "Easy color-coded alerts when medicine gets low (Critical < 30%, Warning < 100%)",
        "Clear explanations showing why medicine demand increased",
        "Tracks expiry dates so older medicine batches are used first"
      ]
    },
    {
      title: t.featForecastingTitle || "14-Day AI Demand Prediction",
      icon: TrendingUp,
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.22)",
      desc: t.featForecastingDesc || "Predicts seasonal illnesses like viral fever or dengue so clinics are prepared in advance.",
      details: [
        "Learns from seasonal trends, weather patterns, and patient history",
        "High-accuracy demand forecasts for the next 7, 14, and 30 days",
        "Provides 1 to 2 weeks early warning before a clinic runs out",
        "Keeps all patient personal records 100% private and protected"
      ]
    },
    {
      title: t.featAlertsTitle || "Fast Hospital & Shortage Alerts",
      icon: AlertTriangle,
      color: "#dc2626",
      bg: "rgba(220, 38, 38, 0.22)",
      desc: t.featAlertsDesc || "Monitors hospital bed occupancy, doctor attendance, and sudden spikes in patients.",
      details: [
        "Detects viral disease outbreaks as soon as patient visits double",
        "Monitors ICU and general bed availability across clinics",
        "Alerts administrators if doctors or nurses are absent",
        "Easy 1-click action to resolve clinic shortages quickly"
      ]
    },
    {
      title: t.featRedistributionTitle || "Smart Medicine Sharing & Delivery",
      icon: Truck,
      color: "#f97316",
      bg: "rgba(249, 115, 22, 0.22)",
      desc: t.featRedistributionDesc || "Finds nearby clinics with extra medicines and arranges quick transfer orders.",
      details: [
        "Calculates the fastest and safest roads between clinics",
        "Generates emergency passes for quick highway and toll passage",
        "Automatically detects and avoids flooded or blocked roads",
        "Coordinates delivery vans for fastest emergency medicine delivery"
      ]
    },
    {
      title: t.featCareTitle || "Safe & Private Healthcare AI",
      icon: Users,
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.22)",
      desc: t.featCareDesc || "Allows health departments to train smart AI without sharing sensitive patient medical records.",
      details: [
        "Patient records never leave their local hospital or state",
        "Strictly follows Indian digital health and privacy standards",
        "Works smoothly even with slow or intermittent rural internet",
        "Guarantees that citizen health data remains confidential"
      ]
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang} 
        activePage="features"
      />

      <main style={{ paddingTop: '5.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', paddingRight: 'clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb & Navigation Header */}
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
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={15} /> Back to Main Portal
          </button>

          <span style={{ fontSize: '0.8rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            ✨ SwasthyaSetu AI Core Features
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Shield size={14} color="#f97316" /> Smart Health Supply Initiative
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Key Platform Features
          </h1>
          <p style={{ color: '#fed7aa', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            See how SwasthyaSetu AI keeps clinics stocked with essential medicines, prevents shortages with smart AI, and plans fast emergency delivery routes.
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
                  background: 'rgba(20, 25, 35, 0.55)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
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
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: feat.bg, border: `1px solid ${feat.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
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
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
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

                <div style={{ background: 'rgba(10, 15, 25, 0.65)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316', marginBottom: '0.75rem' }}>
                    How It Works & What It Solves:
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {feat.details.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#f1f5f9', lineHeight: 1.45 }}>
                        <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
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
