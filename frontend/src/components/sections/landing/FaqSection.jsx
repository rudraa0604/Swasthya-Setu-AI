import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, Sparkles, 
  Wifi, ShieldCheck, Building2, Truck, ArrowRight, CheckCircle2,
  FileQuestion, Layers, Info
} from 'lucide-react';
import { translations } from '../../../services/i18n';

export const FAQ_DATA = [
  {
    id: 'faq-1',
    category: 'general',
    categoryLabel: 'Overview & Mission',
    badge: 'Core Mission',
    color: '#ea580c',
    question: 'What is SwasthyaSetu AI and what critical problem does it solve?',
    answer: 'SwasthyaSetu AI is an India-wide intelligent healthcare and medical supply ecosystem. It solves the chronic problem of stockouts and medicine shortages in rural Primary Health Centres (PHCs) and community clinics. By combining 14-day AI consumption forecasting, automated inter-clinic stock balancing, emergency green corridors, and offline-first mobile sync, it ensures no citizen is ever turned away without life-saving medicines.',
    portalShortcut: { label: 'Explore All Portals', hash: '#/portals' }
  },
  {
    id: 'faq-2',
    category: 'edge',
    categoryLabel: 'Offline Edge & Clinics',
    badge: 'Offline-First',
    color: '#ea580c',
    question: 'How does the local clinic app work in remote areas with zero internet?',
    answer: 'The PHC Edge Terminal runs locally on any browser or tablet using IndexedDB and client-side encryption. Healthcare workers can register patient OPD visits, log dispensed medicines, and record symptoms even with zero cell connectivity. When internet or satellite signal returns, the app automatically performs a secure two-way cryptographic sync with state health directorate servers.',
    portalShortcut: { label: 'Open Offline Clinic Terminal', hash: '#/portal/edge' }
  },
  {
    id: 'faq-3',
    category: 'ai',
    categoryLabel: 'AI & Forecasting',
    badge: 'Prophet + XGBoost',
    color: '#7c3aed',
    question: 'How does the AI predict medicine stockouts 14 days in advance?',
    answer: 'SwasthyaSetu AI uses Facebook Prophet additive time-series models combined with gradient-boosted trees (XGBoost). The model incorporates historical disease trends, day-of-week clinical footfall, seasonal weather indices (monsoon rainfall, humidity), and real-time fever cluster telemetry from nearby clinics. This projects exact depletion trajectories and alerts officers 7 to 14 days before safety stock is exhausted.',
    portalShortcut: { label: 'View AI Outbreak Predictions', hash: '#/portal/prediction' }
  },
  {
    id: 'faq-4',
    category: 'privacy',
    categoryLabel: 'Data Privacy & Security',
    badge: 'Federated Learning',
    color: '#16a34a',
    question: 'How is citizen health data protected? Does private medical data leave state borders?',
    answer: 'Zero patient health records (PHR) leave state jurisdictions. SwasthyaSetu AI uses Federated Machine Learning: local AI models train directly on decentralized state servers, and only aggregated model weight gradients are shared with the National Ministry. The system strictly complies with India’s Digital Personal Data Protection (DPDP) Act, DISHA standards, and Ayushman Bharat Digital Mission (ABDM) protocols.',
    portalShortcut: { label: 'Inspect Federated AI Weights', hash: '#/portal/national' }
  },
  {
    id: 'faq-5',
    category: 'hospitals',
    categoryLabel: 'Private Hospitals',
    badge: 'MILP & CP-SAT',
    color: '#0284c7',
    question: 'What capabilities does SwasthyaSetu provide for private super-specialty hospitals?',
    answer: 'For private and corporate hospitals, SwasthyaSetu includes a dedicated Hospital Resource Optimizer. It features: 1) Mixed-Integer Linear Programming (MILP) bed & ICU capacity optimization; 2) Constraint Programming (CP-SAT) robotic and surgical OT scheduling that eliminates turnover idle time; 3) Shift-balanced nursing and specialist rosters compliant with mandatory rest rules; and 4) Monte Carlo "what-if" disaster and epidemic surge simulators.',
    portalShortcut: { label: 'Open Private Hospital Portal', hash: '#/portal/hospital' }
  },
  {
    id: 'faq-6',
    category: 'logistics',
    categoryLabel: 'Logistics & Delivery',
    badge: 'Vehicle Routing AI',
    color: '#f97316',
    question: 'How does the 1-click medicine transfer and hazard re-routing work?',
    answer: 'When a clinic faces a projected deficit, the system automatically finds nearby health centers or district warehouses with excess stock. Once an officer clicks "Approve Transfer", the AI Route Optimizer calculates the optimal path, factoring in cold-chain reefer constraints, flooded highways, and ghat road hazards. Drivers receive instant turn-by-turn navigation passes with SMS delivery alerts.',
    portalShortcut: { label: 'Test Delivery Route Planner', hash: '#/portal/routes' }
  },
  {
    id: 'faq-7',
    category: 'emergency',
    categoryLabel: 'Emergency Mode',
    badge: 'Stage 3 Override',
    color: '#dc2626',
    question: 'What happens during a National Health Emergency override?',
    answer: 'During a major disease outbreak (e.g. severe Dengue shock clusters) or natural disaster, authorized national or district officials can activate Emergency Mode. This establishes highway police green corridors, reserves ICU surge beds across both government and private facilities, and bypasses bureaucratic purchase cycles to authorize instant medical supplies.',
    portalShortcut: { label: 'Inspect Emergency Mode View', hash: '#/portal/emergency' }
  },
  {
    id: 'faq-8',
    category: 'general',
    categoryLabel: 'Governance & Roles',
    badge: '6-Tier Hierarchy',
    color: '#0f172a',
    question: 'Who accesses which portal? How do the 6 user roles interact?',
    answer: 'The system has 6 distinct roles: 1) Local PHC Staff (Daily entry & offline logging); 2) District Health Officer (1-click transfer approvals for 10+ clinics); 3) State Directorate (inter-district stock balancing & state reserves); 4) National Health Ministry (apex nation-wide map & green corridor override); 5) Private Hospitals (inpatient beds, OT schedule & nurse rosters); and 6) Developer Console (outbreak stress testing and database sandbox).',
    portalShortcut: { label: 'Choose Your Portal Role', hash: '#/login' }
  }
];

export default function FaqSection({ lang, onLaunchPortal, onSelectRole }) {
  const t = translations[lang] || translations.en;
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState('faq-1'); // Default first item open

  const categories = [
    { id: 'all', label: 'All Questions (8)' },
    { id: 'general', label: '🏥 Overview & Mission' },
    { id: 'edge', label: '📶 Offline Clinic Edge' },
    { id: 'ai', label: '🧠 AI Forecasting & Privacy' },
    { id: 'hospitals', label: '🏢 Private Hospitals' },
    { id: 'logistics', label: '🚚 Logistics & Corridors' }
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
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
    <section
      id="faq"
      style={{
        padding: 'clamp(3.5rem, 6vw, 6rem) clamp(1rem, 4vw, 2rem)',
        background: 'rgba(7, 17, 30, 0.75)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            className="reveal-scale"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(234, 88, 12, 0.18)',
              border: '1px solid rgba(249, 115, 22, 0.45)',
              color: 'var(--color-text-warm, #fed7aa)',
              padding: '0.35rem 0.95rem',
              borderRadius: '999px',
              fontSize: 'var(--text-xs, 0.75rem)',
              fontWeight: 700,
              marginBottom: '0.85rem'
            }}
          >
            <HelpCircle size={15} color="#f97316" /> Frequently Asked Questions
          </div>
          <h2
            className="reveal-up"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 900,
              color: 'var(--color-text-white, #ffffff)',
              letterSpacing: '-0.02em',
              margin: '0 0 0.75rem 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Everything You Need to Know About SwasthyaSetu AI
          </h2>
          <p
            className="reveal-subtext"
            style={{
              color: 'var(--color-text-muted, #94a3b8)',
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: 'var(--text-base, 1rem)',
              lineHeight: 1.6
            }}
          >
            Clear, transparent answers on offline edge sync, predictive AI algorithms, patient data privacy, and hospital resource scheduling.
          </p>
        </div>

        {/* Live Search Bar */}
        <div
          className="reveal-up"
          style={{
            maxWidth: '640px',
            margin: '0 auto 1.75rem auto',
            position: 'relative'
          }}
        >
          <Search
            size={18}
            color="#94a3b8"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search questions (e.g. 'offline', 'privacy', 'hospital', 'ICU', 'forecast')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.6rem',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn-ghost-action"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '999px',
                padding: '0.2rem 0.55rem',
                fontSize: 'var(--text-xs, 0.75rem)'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Filter (Horizontally scrollable on mobile) */}
        <div
          className="faq-category-chips"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn-pill-action ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions List with Staggered Fade Up */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredFaqs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                border: '1px dashed rgba(255,255,255,0.2)'
              }}
            >
              <FileQuestion size={40} color="#f97316" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                No questions found matching "{searchQuery}"
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Try searching for broader keywords like "offline", "medicine", "hospital", or "model".
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, faqIdx) => {
              const isOpen = openFaqId === faq.id;
              const delayClass = `delay-${Math.min((faqIdx + 1) * 80, 500)}`;
              return (
                <div
                  key={faq.id}
                  className={`reveal-up ${delayClass}`}
                  style={{
                    background: isOpen ? 'rgba(23, 37, 58, 0.95)' : 'rgba(15, 23, 42, 0.7)',
                    border: isOpen 
                      ? `2px solid ${faq.color}` 
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isOpen 
                      ? `0 8px 24px ${faq.color}25` 
                      : '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Clickable Question Header */}
                  <div
                    onClick={() => toggleFaq(faq.id)}
                    style={{
                      padding: '1.1rem 1.35rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '1rem',
                      userSelect: 'none',
                      minHeight: '44px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: 'var(--text-xs, 0.75rem)',
                          fontWeight: 800,
                          color: faq.color,
                          background: `${faq.color}20`,
                          border: `1px solid ${faq.color}50`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {faq.badge}
                      </span>
                      <h3
                        style={{
                          fontSize: 'var(--text-base, 1rem)',
                          fontWeight: 700,
                          color: 'var(--color-text-white, #ffffff)',
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
                        padding: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.25s ease'
                      }}
                    >
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Smooth Expandable Answer Content via CSS Grid 0fr -> 1fr */}
                  <div className={`faq-accordion-body ${isOpen ? 'open' : ''}`}>
                    <div className="faq-accordion-inner">
                      <div
                        style={{
                          padding: '0 1.35rem 1.25rem 1.35rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingTop: '0.85rem'
                        }}
                      >
                        <p
                          style={{
                            color: 'var(--color-text-light, #f1f5f9)',
                            fontSize: 'var(--text-sm, 0.875rem)',
                            lineHeight: 1.65,
                            margin: '0 0 1rem 0'
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
                              className="btn-secondary-action"
                              style={{
                                padding: '0.4rem 0.9rem',
                                fontSize: 'var(--text-xs, 0.75rem)',
                                minHeight: '38px'
                              }}
                            >
                              {faq.portalShortcut.label} <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Callout Banner: Link to Dedicated FAQ Page & Portal */}
        <div
          className="reveal-up"
          style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(22, 163, 74, 0.15) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <h3 style={{ fontSize: 'var(--text-lg, 1.125rem)', fontWeight: 800, color: 'var(--color-text-white, #ffffff)', margin: '0 0 0.3rem 0' }}>
              Want to read the full architectural FAQ & deployment manual?
            </h3>
            <p style={{ margin: 0, fontSize: 'var(--text-sm, 0.875rem)', color: 'var(--color-text-muted, #94a3b8)' }}>
              Explore deep dives into mathematical formulations, federated gradient exchange, and clinical integration workflows.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="#/faq"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/faq';
              }}
              className="btn-secondary-action"
              style={{
                fontSize: 'var(--text-sm, 0.875rem)',
                padding: '0.55rem 1.15rem'
              }}
            >
              <Info size={15} color="#f97316" /> Open Complete FAQ Page &rarr;
            </a>

            <button
              onClick={() => {
                window.location.hash = '#/login';
                if (onLaunchPortal) onLaunchPortal();
              }}
              className="btn-primary-action"
              style={{
                fontSize: 'var(--text-sm, 0.875rem)',
                padding: '0.55rem 1.15rem'
              }}
            >
              <Sparkles size={15} /> Launch Live Demo
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
