import React, { useState } from 'react';
import { 
  HelpCircle, Search, ArrowLeft, ArrowRight, Sparkles, 
  Wifi, ShieldCheck, Building2, Truck, CheckCircle2, 
  FileQuestion, Layers, Info, Globe, Code, ShieldAlert,
  ChevronDown, ChevronUp, Lock, RefreshCw, Activity, HeartPulse
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';
import { FAQ_DATA } from '../components/sections/landing/FaqSection';

// Extra in-depth questions for the full dedicated FAQ page
const EXTENDED_FAQS = [
  ...FAQ_DATA,
  {
    id: 'faq-9',
    category: 'ai',
    categoryLabel: 'AI & Forecasting',
    badge: 'XGBoost & Prophet',
    color: '#7c3aed',
    question: 'How does the model differentiate between seasonal baseline illnesses and sudden epidemic outbreaks?',
    answer: 'The system runs a dual-layer anomaly detection pipeline. The first layer (Prophet) fits annual seasonality, holiday effects, and weekly OPD consultation cycles. The second layer (XGBoost + CUSUM statistical change-point detection) scans for rapid residuals: if 3 or more clinics in a 25km radius report a >40% surge in fever or low platelet counts within 48 hours, it automatically flags an active disease cluster and upgrades the district threat level.',
    portalShortcut: { label: 'Inspect Outbreak Radar', hash: '#/portal/prediction' }
  },
  {
    id: 'faq-10',
    category: 'hospitals',
    categoryLabel: 'Private Hospitals',
    badge: 'OR Optimization',
    color: '#0284c7',
    question: 'How does the Operating Theater (OT) scheduler handle robotic vs. general surgical suites?',
    answer: 'The OT Scheduler utilizes Google OR-Tools CP-SAT (Constraint Programming Satisfiability) solver. It treats robotic consoles (e.g. Da Vinci), laparoscopic towers, and sterile laminar airflow suites as hard equipment constraints. It schedules surgeries while respecting mandatory 30-minute terminal cleaning turnaround times, surgeon availability, and priority classifications (Emergency Stat vs. Urgent vs. Elective), boosting suite utilization by up to 34%.',
    portalShortcut: { label: 'Explore OT Scheduler', hash: '#/portal/hospital' }
  },
  {
    id: 'faq-11',
    category: 'privacy',
    categoryLabel: 'Data Privacy & Security',
    badge: 'ABDM & DISHA',
    color: '#16a34a',
    question: 'Does SwasthyaSetu AI comply with India\'s National Digital Health Mission (ABDM)?',
    answer: 'Yes. SwasthyaSetu AI is engineered to integrate natively with ABDM (Ayushman Bharat Digital Mission) M1/M2/M3 milestone APIs, eVIN (electronic Vaccine Intelligence Network), and HMIS. Facilities are identified by their official ABDM Health Facility Registry (HFR) IDs, and health workers are mapped through Health Professional Registry (HPR) credentials. No unencrypted patient personally identifiable information (PII) is ever cached.',
    portalShortcut: { label: 'View ABDM Integration', hash: '#/portal/national' }
  },
  {
    id: 'faq-12',
    category: 'dev',
    categoryLabel: 'Simulation & Testing',
    badge: 'Admin Sandbox',
    color: '#ea580c',
    question: 'Can disaster management teams simulate sudden earthquakes or flood supply cuts?',
    answer: 'Yes. The Developer & System Simulation Console allows administrators to inject synthetic stress tests. You can simulate road blockages on major state highways (e.g., NH-60 landslide), wipe out 85% of regional IV fluid inventory, or inflate clinical demand by 3.5x. This enables health ministries and NDRF to test response times and supply resilience before disasters happen in real life.',
    portalShortcut: { label: 'Open Dev & Stress Console', hash: '#/portal/developer' }
  }
];

export default function LandingFaqPage({ onBackToHome, onLaunchPortal, onSelectRole, lang, setLang }) {
  const t = translations[lang] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState('faq-1');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: '🏥 Overview & Mission' },
    { id: 'edge', label: '📶 Rural Offline Edge' },
    { id: 'ai', label: '🧠 AI Forecasting & Prophet' },
    { id: 'privacy', label: '🔒 Data Privacy & ABDM' },
    { id: 'hospitals', label: '🏢 Private Hospitals & ORs' },
    { id: 'logistics', label: '🚚 Logistics & Green Corridors' },
    { id: 'dev', label: '⚙️ Simulation & Sandbox' }
  ];

  const filteredFaqs = EXTENDED_FAQS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang} 
        activePage="faq"
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
              gap: '0.4rem',
              transition: 'background 0.15s ease'
            }}
          >
            <ArrowLeft size={15} /> Back to Main Portal
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Documentation & FAQ Hub</span>
            <span style={{ background: 'rgba(234, 88, 12, 0.2)', color: '#f97316', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
              v2.4 Production Ready
            </span>
          </div>
        </div>

        {/* Hero Title & Intro Banner */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(22, 163, 74, 0.15) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: '16px',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(234, 88, 12, 0.25)', border: '1px solid #f97316', color: '#fed7aa', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.85rem' }}>
              <HelpCircle size={14} color="#f97316" /> SWASTHYASETU AI KNOWLEDGE BASE & FAQ
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 0.75rem 0', lineHeight: 1.15 }}>
              Frequently Asked Questions & Operations Manual
            </h1>
            <p style={{ fontSize: '1rem', color: '#e2e8f0', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Comprehensive technical, operational, and clinical answers covering decentralized edge synchronization, 14-day Prophet forecasting, private hospital MILP solvers, and citizen data confidentiality.
            </p>

            {/* Quick Feature Stats */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#16a34a" /> 100% Offline Edge Sync
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#16a34a" /> Zero Patient Data Leakage
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#16a34a" /> 14-Day Advance Warnings
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '700px', margin: '0 auto 1.75rem auto', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Type any question or keyword (e.g. 'offline', 'MILP', 'privacy', 'dengue', 'CP-SAT')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.75rem',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Categories */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id 
                  ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' 
                  : 'rgba(30, 41, 59, 0.7)',
                color: selectedCategory === cat.id ? '#ffffff' : '#cbd5e1',
                border: selectedCategory === cat.id 
                  ? '1px solid #f97316' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Questions Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3.5rem' }}>
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: isOpen ? 'rgba(23, 37, 58, 0.95)' : 'rgba(15, 23, 42, 0.75)',
                  border: isOpen 
                    ? `2px solid ${faq.color}` 
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen 
                    ? `0 8px 26px ${faq.color}25` 
                    : '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                {/* Header */}
                <div
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '1rem',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: faq.color,
                        background: `${faq.color}20`,
                        border: `1px solid ${faq.color}50`,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {faq.badge}
                    </span>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.35
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    style={{
                      background: isOpen ? `${faq.color}30` : 'rgba(255, 255, 255, 0.08)',
                      color: isOpen ? faq.color : '#cbd5e1',
                      borderRadius: '999px',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Answer */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.35rem 1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '1rem'
                    }}
                  >
                    <p
                      style={{
                        color: '#e2e8f0',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        margin: '0 0 1.25rem 0'
                      }}
                    >
                      {faq.answer}
                    </p>

                    {faq.portalShortcut && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            window.location.hash = faq.portalShortcut.hash;
                            if (onLaunchPortal) onLaunchPortal();
                          }}
                          style={{
                            background: `${faq.color}20`,
                            color: faq.color,
                            border: `1px solid ${faq.color}60`,
                            borderRadius: '8px',
                            padding: '0.45rem 1rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {faq.portalShortcut.label} <ArrowRight size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Callout Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          <Sparkles size={32} color="#f97316" style={{ margin: '0 auto 0.75rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Ready to test SwasthyaSetu AI in your jurisdiction?
          </h2>
          <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Access pre-configured demo stations for local clinics, district health offices, state directorates, or private tertiary hospitals.
          </p>

          <button
            onClick={() => {
              window.location.hash = '#/login';
              if (onLaunchPortal) onLaunchPortal();
            }}
            style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #16a34a 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 6px 20px rgba(234, 88, 12, 0.45)'
            }}
          >
            Launch SwasthyaSetu Portal Hub <ArrowRight size={16} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <FooterSection lang={lang} />
    </div>
  );
}
