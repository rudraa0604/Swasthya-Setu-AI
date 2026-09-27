import React from 'react';
import { 
  Users, Award, GraduationCap, Code, ArrowLeft, ArrowRight, Heart, Sparkles, Building2
} from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import FooterSection from '../components/sections/landing/FooterSection';
import { translations } from '../services/i18n';

export default function LandingCreditsPage({ onBackToHome, onLaunchPortal, lang, setLang }) {
  const t = translations[lang] || translations.en;

  const teamMembers = [
    {
      name: "Rudra Pratap Chaurasiya",
      role: "Lead Full-Stack AI Engineer & System Architect",
      institution: "Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur",
      contributions: "Federated Learning Core, FastAPI Backend, Dijkstra Route Optimization, Database Design"
    },
    {
      name: "Sankalp Sachan",
      role: "Frontend Architect & UI/UX Specialist",
      institution: "Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur",
      contributions: "React 18 & Vite Architecture, Multi-Language i18n Localization, Responsive Glassmorphic Layouts"
    },
    {
      name: "Mohammad Sirfan",
      role: "Machine Learning & Epidemiological Modeling Specialist",
      institution: "Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur",
      contributions: "Prophet Additive Demand Forecasting, Outbreak Spike Detection, Linear Supply Redistribution"
    }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #07111e 0%, #0c1a2d 100%)', color: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Top Navbar */}
      <LandingNavbar 
        onLaunchPortal={onLaunchPortal} 
        lang={lang} 
        setLang={setLang} 
        activePage="credits"
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
            🎓 Team Credits & Engineering
          </span>
        </div>

        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', background: 'rgba(234, 88, 12, 0.2)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <GraduationCap size={14} color="#f97316" /> Academic Innovation & Engineering
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Project Team & University Affiliation
          </h1>
          <p style={{ color: '#fed7aa', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Developed under the Department of Computer Science & Engineering at Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur.
          </p>
        </div>

        {/* Team Members Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(20, 25, 35, 0.55)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 88, 12, 0.25)', border: '1px solid rgba(249, 115, 22, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Users size={24} color="#f97316" />
                </div>

                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
                  {member.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {member.role}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fed7aa', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={13} /> {member.institution}
                </div>

                <div style={{ background: 'rgba(10, 15, 25, 0.65)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Key Contributions:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                    {member.contributions}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
