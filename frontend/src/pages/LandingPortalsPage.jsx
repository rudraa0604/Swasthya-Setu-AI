import React from 'react';
import { 
  Building, MapPin, Layers, Globe, Code, ArrowLeft, ArrowRight, ShieldCheck, Key
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';

export default function LandingPortalsPage({ onBackToHome, onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const roleStations = [
    {
      roleId: 'phc',
      title: t.rolePhcTitle || 'PHC / CHC Staff',
      subtitle: t.rolePhcSubtitle || 'Edge Data Entry & Stock Terminal',
      icon: Building,
      color: '#0284c7',
      badge: t.rolePhcBadge || 'Offline-First',
      desc: t.rolePhcDesc || 'Log daily medicine dispensing, received batches, and patient footfall with automatic sync on reconnect.',
      features: [
        'Local SQLite & LocalStorage offline cache',
        'Auto-reconnect conflict-free batch synchronization',
        'Daily patient footfall registration & disease symptom tagging',
        'Emergency rapid dispatch receiving dock confirmation'
      ]
    },
    {
      roleId: 'district',
      title: t.roleDistrictTitle || 'District Health Officer (DHO)',
      subtitle: t.roleDistrictSubtitle || 'District Administration & Transfer Approvals',
      icon: MapPin,
      color: '#f59e0b',
      badge: t.roleDistrictBadge || 'Authorization Gate',
      desc: t.roleDistrictDesc || 'Inspect district-wide PHC health and review, approve, or reject AI-recommended medicine redistributions.',
      features: [
        'Triage table of 10+ Primary Health Centres per district',
        'Human-in-the-Loop 1-click transfer authorization',
        'ICU & general ward acute bed occupancy heatmaps',
        'Doctor & Healthcare worker staffing strength audits'
      ]
    },
    {
      roleId: 'state',
      title: t.roleStateTitle || 'State Health Department',
      subtitle: t.roleStateSubtitle || 'State Directorate & Local AI Node',
      icon: Layers,
      color: '#8b5cf6',
      badge: t.roleStateBadge || 'State Node',
      desc: t.roleStateDesc || 'Monitor 50 PHCs across districts and train local state models without sending raw patient telemetry outside state borders.',
      features: [
        'Inter-district resource balancing (e.g. Pune surplus to Nashik deficit)',
        'State-level differential privacy model parameter training',
        'Multi-district outbreak epidemiological curve tracking',
        'State medical warehouse cold-chain reefer fleet management'
      ]
    },
    {
      roleId: 'national',
      title: t.roleNationalTitle || 'National Health Ministry',
      subtitle: t.roleNationalSubtitle || 'NHM Executive Overwatch',
      icon: Globe,
      color: '#10b981',
      badge: t.roleNationalBadge || 'National Layer',
      desc: t.roleNationalDesc || 'National roll-up analytics, emergency mode override, and federated averaging (FedAvg) over state model weights.',
      features: [
        'National Health Emergency Override Mode with instant green corridors',
        'Pan-India 150+ PHC roll-up telemetry dashboard',
        'Global Federated Averaging (FedAvg) aggregation engine',
        'ABDM & eVIN national health data interoperability layer'
      ]
    },
    {
      roleId: 'developer',
      title: t.roleDevTitle || 'Developer & Admin Console',
      subtitle: t.roleDevSubtitle || 'Live System CRUD & Stress Testing',
      icon: Code,
      color: '#38bdf8',
      badge: t.roleDevBadge || 'Root Access',
      desc: t.roleDevDesc || 'Add/Edit PHCs, tune inventory stocks, inject simulated outbreaks in any district, and re-seed the platform database.',
      features: [
        'Direct SQLite schema CRUD operations for PHCs & stocks',
        'Simulated epidemic stress-testing injection rig',
        'Dijkstra pathfinding testbed & road blockage simulators',
        'One-click pristine demonstration database re-seeder'
      ]
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

          <span style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.25)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
            🔑 Role-Based Access Gateways
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#86efac', background: 'rgba(46, 139, 87, 0.2)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Key size={14} /> Tailored for Healthcare Hierarchy
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Multi-Tier Role Access Gateways
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Select your operational role to access your dedicated command center, manage inventories, authorize life-saving emergency dispatches, or inspect system architecture.
          </p>
        </div>

        {/* 5 Full Role Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
          {roleStations.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.roleId}
                style={{
                  background: 'rgba(19, 57, 102, 0.38)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ background: `${st.color}30`, border: `1px solid ${st.color}60`, padding: '0.6rem', borderRadius: '10px' }}>
                      <Icon size={22} color={st.color} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: st.color, background: `${st.color}25`, border: `1px solid ${st.color}40`, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                      {st.badge}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {st.title}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
                    {st.subtitle}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    {st.desc}
                  </p>

                  <div style={{ background: 'rgba(7, 17, 30, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Key Capabilities:
                    </div>
                    {st.features.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: st.color }}>•</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectRole(st.roleId)}
                  style={{
                    background: `linear-gradient(135deg, ${st.color} 0%, #0369a1 100%)`,
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: `0 4px 16px ${st.color}40`,
                    transition: 'transform 0.15s ease'
                  }}
                >
                  Enter {st.title} Station <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <FooterSection lang={lang} />
    </div>
  );
}
