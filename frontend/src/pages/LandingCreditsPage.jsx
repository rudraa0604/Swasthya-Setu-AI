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
      contributions: "Federated Learning Core, FastAPI Backend Services, Dijkstra & VRP Route Optimization, Prophet Demand Forecasting & Real-Time Telemetry Layer"
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
            Project Engineering & University Affiliation
          </h1>
          <p style={{ color: '#fed7aa', maxWidth: '720px', margin: '0.85rem auto 0 auto', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.6 }}>
            Developed under the Department of Computer Science & Engineering at Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur.
          </p>
        </div>

        {/* Team Member Card */}
        <div style={{ maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              style={{
                background: 'linear-gradient(135deg, rgba(20, 25, 35, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                borderRadius: '20px',
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(234, 88, 12, 0.15)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(234, 88, 12, 0.25)', border: '1px solid rgba(249, 115, 22, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={28} color="#f97316" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                      {member.name}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#86efac', fontWeight: 700, marginTop: '0.2rem' }}>
                      {member.role}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#fed7aa', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.85rem', borderRadius: '8px' }}>
                  <Building2 size={15} color="#f97316" /> {member.institution}
                </div>

                <div style={{ background: 'rgba(10, 15, 25, 0.75)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '1.15rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.05em' }}>
                    Key Engineering Contributions:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#f1f5f9', lineHeight: 1.6 }}>
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
