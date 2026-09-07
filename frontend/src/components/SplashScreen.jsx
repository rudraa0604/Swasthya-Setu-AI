import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [stage, setStage] = useState('entering'); // 'entering', 'tagline', 'fading_out', 'done'

  useEffect(() => {
    // Check sessionStorage
    const splashShown = sessionStorage.getItem('swasthya_splash_shown');
    if (splashShown) {
      onComplete();
      return;
    }

    // Extended timeline (+3.5s for rich intro experience):
    // 0s: Logo fades in & scales up
    // 1.2s: Tagline appears
    // 4.8s: Begin 0.8s crossfade out
    // 5.6s: Done
    const t1 = setTimeout(() => setStage('tagline'), 1200);
    const t2 = setTimeout(() => setStage('fading_out'), 4800);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('swasthya_splash_shown', 'true');
      setStage('done');
      onComplete();
    }, 5600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem('swasthya_splash_shown', 'true');
    setStage('done');
    onComplete();
  };

  if (stage === 'done') return null;

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d2b4e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: stage === 'fading_out' ? 0 : 1,
        transition: 'opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 139, 87, 0.2) 0%, rgba(2, 132, 199, 0.1) 40%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Full Logo Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '2rem',
          transform: stage === 'entering' ? 'scale(0.88)' : 'scale(1)',
          opacity: stage === 'entering' ? 0.2 : 1,
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <img
          src="/assets/SwasthyaSetu AI.png"
          alt="SwasthyaSetu AI Full Logo"
          style={{
            maxWidth: '480px',
            width: '90vw',
            height: 'auto',
            filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.5))',
            borderRadius: '12px'
          }}
        />

        {/* Animated Subtitle / Tagline */}
        <div
          style={{
            marginTop: '1.5rem',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 600,
            color: '#86efac',
            letterSpacing: '0.04em',
            opacity: stage === 'entering' ? 0 : 1,
            transform: stage === 'entering' ? 'translateY(15px)' : 'translateY(0)',
            transition: 'all 0.8s ease'
          }}
        >
          राष्ट्रीय स्वास्थ्य आपूर्ति श्रृंखला लचीलापन मंच
        </div>
      </div>

      {/* Click anywhere to skip hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}
