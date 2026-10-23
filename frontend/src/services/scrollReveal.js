/**
 * SwasthyaSetu AI - Reusable Scroll Reveal Observer System
 * Uses IntersectionObserver to trigger performant GPU animations (transform & opacity)
 * Each element animates once when it enters the viewport (threshold ~0.2)
 */

export function initScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: immediately show elements if IntersectionObserver is unavailable
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-row')
      .forEach(el => el.classList.add('in-view'));
    return () => {};
  }

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-row')
      .forEach(el => el.classList.add('in-view'));
    return () => {};
  }

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Animate once: unobserve as soon as it enters
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.18,
    rootMargin: '0px 0px -30px 0px'
  });

  const targets = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-row'
  );

  targets.forEach(el => {
    if (!el.classList.contains('in-view')) {
      observer.observe(el);
    }
  });

  return () => {
    observer.disconnect();
  };
}
