import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Shield, Activity, ArrowRight } from 'lucide-react';
import { translations } from '../services/i18n';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

export default function HeroScrollCanvas({ onEnterPortal, lang }) {
  const t = translations[lang] || translations.en;
  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);

  // Preload frames progressively
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/frames/frame_${numStr}.jpg`;

      const handleImageLoadOrError = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadingProgress(progress);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onload = handleImageLoadOrError;
      img.onerror = handleImageLoadOrError;

      images.push(img);
    }

    imagesRef.current = images;
  }, []);

  // Set up Canvas and Page-wide Scroll Scrubbing
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;

    // Render a specific frame onto the canvas with cover scaling
    const renderFrame = (index) => {
      const clampedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
      currentFrameRef.current = clampedIndex;
      const img = images[clampedIndex];
      if (!img || !img.complete) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (!cw || !ch) return;

      const iw = img.naturalWidth || 800;
      const ih = img.naturalHeight || 450;

      // Cover scaling
      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) / 2;
      const cy = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    // ScrollTrigger across the entire page scroll so the background continuously scrubs
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
        );
        renderFrame(frameIndex);
      }
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      trigger.kill();
    };
  }, [isLoaded]);

  return (
    <>
      {/* Loading Progress Overlay */}
      {!isLoaded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0d2b4e',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity size={32} color="#2e8b57" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{t.appTitle}</h2>
          </div>

          <div style={{ width: '260px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7, #2e8b57)',
                transition: 'width 0.15s ease'
              }}
            />
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Preloading ({loadingProgress}%)
          </div>
        </div>
      )}

      {/* Fixed Fullscreen Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Subtle translucent gradient overlay to keep text crisp while allowing background animation to shine through */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(13, 43, 78, 0.2) 0%, rgba(10, 25, 47, 0.52) 100%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Section Content with dynamic i18n support */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(4.5rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem) 3rem clamp(1rem, 4vw, 2rem)',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '850px', width: '100%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(46, 139, 87, 0.25)',
              border: '1px solid rgba(46, 139, 87, 0.5)',
              color: '#86efac',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Shield size={14} /> {t.heroInitiativeBadge}
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)'
            }}
          >
            {t.heroHeadingPre}
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #2e8b57 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              {t.heroHeadingHuman}
            </span>
            {t.heroHeadingMid}
            <span
              style={{
                background: 'linear-gradient(135deg, #2e8b57 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              {t.heroHeadingAI}
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: '#f1f5f9',
              maxWidth: '700px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.6,
              textShadow: '0 2px 12px rgba(0,0,0,0.7)'
            }}
          >
            {t.heroSubtext}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-action"
              onClick={onEnterPortal}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2e8b57 100%)',
                color: '#ffffff',
                padding: '0.85rem 1.85rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'transform 0.15s ease'
              }}
            >
              {t.heroCTA} <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#cbd5e1',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            pointerEvents: 'none'
          }}
        >
          <span>{t.heroScrollPrompt}</span>
          <ChevronDown size={18} className="bounce-anim" />
        </div>
      </div>
    </>
  );
}
