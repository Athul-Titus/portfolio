import { useEffect, useRef } from 'react';
import HackerFigure from './HackerFigure';

export default function Hero() {
  /* ── Refs for scroll-driven animation ──────────────────────── */
  const heroWrapperRef   = useRef(null); // 200 vh scroll container
  const figureWrapperRef = useRef(null); // the div that scales up
  const contentRef       = useRef(null); // left column
  const overlayRef       = useRef(null); // full-screen dark veil
  const scrollIndicRef   = useRef(null); // scroll hint
  const areaRef          = useRef(null); // avatar column (for mouse parallax)
  const cardsRef         = useRef([]);
  const particlesRef     = useRef([]);

  // Cache viewport-center offset so we can move the figure to center as it zooms
  const figureOffsetRef = useRef({ tx: 0, ty: 0 });

  /* ── Compute offset once after mount (and on resize) ────────── */
  useEffect(() => {
    const compute = () => {
      const areaEl = areaRef.current;
      if (!areaEl) return;
      const rect = areaEl.getBoundingClientRect();
      figureOffsetRef.current = {
        tx: window.innerWidth  / 2 - (rect.left + rect.width  / 2),
        ty: window.innerHeight / 2 - (rect.top  + rect.height / 2),
      };
    };
    // small delay so layout is settled
    const timer = setTimeout(compute, 150);
    window.addEventListener('resize', compute);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', compute);
    };
  }, []);

  /* ── Scroll-driven zoom / fly-through ───────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const wrapper = heroWrapperRef.current;
      if (!wrapper) return;

      const scrollY    = window.scrollY;
      const scrollable = wrapper.offsetHeight - window.innerHeight; // = 1 × vh
      const p          = Math.min(1, Math.max(0, scrollY / scrollable));

      /* Figure: translate to viewport center + scale up ───────── */
      const fw = figureWrapperRef.current;
      if (fw) {
        // 0 → 0.85 drives the scale; ease-in curve for cinematic feel
        const sp     = Math.min(1, p / 0.85);
        const eased  = sp * sp * (3 - 2 * sp); // smoothstep
        const scale  = 1 + eased * 5.5;        // 1× → 6.5×
        const { tx, ty } = figureOffsetRef.current;
        // Also add a tiny blur as it fills the screen (lens-zoom feel)
        const blur = eased > 0.7 ? (eased - 0.7) / 0.3 * 5 : 0;

        fw.style.transform = `translate(${tx * eased}px, ${ty * eased}px) scale(${scale})`;
        fw.style.filter    = blur > 0 ? `blur(${blur}px)` : '';
      }

      /* Left column: fade + drift up ─────────────────────────── */
      const c = contentRef.current;
      if (c) {
        const fade = Math.max(0, 1 - p / 0.38);
        c.style.opacity   = fade;
        c.style.transform = `translateY(${p * -50}px)`;
      }

      /* Dark tunnel overlay ───────────────────────────────────── */
      const o = overlayRef.current;
      if (o) {
        // Starts appearing at 55% scroll, fully opaque at 100%
        const opa = p > 0.55 ? Math.min(1, (p - 0.55) / 0.45) : 0;
        o.style.opacity = opa;
      }

      /* Scroll indicator fades instantly ─────────────────────── */
      const si = scrollIndicRef.current;
      if (si) si.style.opacity = Math.max(0, 1 - p * 6);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Mouse parallax for rings + particles ───────────────────── */
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const onMouseMove = (e) => {
      const rect = area.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const y    = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

      cardsRef.current.forEach((card) => {
        if (!card) return;
        const depth = parseFloat(card.getAttribute('data-depth')) || 20;
        card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });

      particlesRef.current.forEach((particle) => {
        if (!particle) return;
        const pRect  = particle.getBoundingClientRect();
        const pCX    = pRect.left + pRect.width  / 2;
        const pCY    = pRect.top  + pRect.height / 2;
        const dx     = e.clientX - pCX;
        const dy     = e.clientY - pCY;
        const dist   = Math.sqrt(dx * dx + dy * dy);
        const radius = 150;
        if (dist < radius) {
          const force = (radius - dist) / radius;
          particle.style.transform =
            `translate3d(${-(dx / dist) * force * 40}px, ${-(dy / dist) * force * 40}px, 0)`;
        } else {
          particle.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    };

    const onMouseLeave = () => {
      cardsRef.current.forEach((c) => { if (c) c.style.transform = 'translate3d(0, 0, 0)'; });
      particlesRef.current.forEach((p) => { if (p) p.style.transform = 'translate3d(0, 0, 0)'; });
    };

    area.addEventListener('mousemove', onMouseMove);
    area.addEventListener('mouseleave', onMouseLeave);
    return () => {
      area.removeEventListener('mousemove', onMouseMove);
      area.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    /*
     * 200 vh outer — gives the browser a full viewport-height of scroll
     * travel dedicated to the fly-through animation before About appears.
     */
    <div ref={heroWrapperRef} id="hero" style={{ height: '200vh' }}>

      {/* ── Sticky frame: stays fixed while 200 vh scrolls past ── */}
      <div className="sticky top-0 h-screen flex items-center relative">

        {/* Background halo */}
        <div className="absolute inset-0 halo-bg pointer-events-none z-0" />

        {/* ── Dark tunnel overlay (z-30 so it covers everything) ─ */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            opacity: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, var(--color-dark) 70%)',
          }}
        />

        {/* ── Main two-column layout ──────────────────────────── */}
        <div className="w-full max-w-container-max mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left column — fades out on scroll */}
          <div
            ref={contentRef}
            className="flex flex-col items-start gap-8"
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 border border-primary-container/30 animate-entrance">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
                Full Stack Developer
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4 animate-entrance delay-100">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-bold text-on-surface">
                Hi, I'm <br />
                <span className="text-primary">Athul Titus</span>
              </h1>
              <p className="font-body-lg text-body-lg text-text-muted max-w-lg">
                I build quantum systems, AI-powered tools, and immersive web experiences.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 animate-entrance delay-200">
              <button
                onClick={() =>
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-primary text-white dark:text-dark px-8 py-3 rounded-full font-body-md text-body-md flex items-center gap-2 red-glow red-glow-hover transition-all duration-300 hover:scale-95"
              >
                Projects
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                onClick={() => window.open('https://github.com/Athul-Titus', '_blank')}
                className="bg-transparent border border-border-subtle hover:border-primary/50 text-on-surface px-8 py-3 rounded-full font-body-md text-body-md flex items-center gap-2 transition-all duration-300 hover:bg-on-surface/5 hover:scale-95 glass-card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-4 pt-4 animate-entrance delay-300">
              {['10+ Projects', 'IEEE Member', 'Quantum & AI', 'KTU University'].map((label) => (
                <div key={label} className="glass-card px-4 py-2 rounded border-l-2 border-l-primary flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: 3D avatar area ─────────────────── */}
          <div
            ref={areaRef}
            className="relative h-[500px] hidden lg:flex items-center justify-center"
          >
            {/* Orbit rings (parallax-driven by mouse) */}
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              data-depth="15"
              className="absolute w-96 h-96 rounded-full border border-primary/30
                shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.12)]
                transform rotate-12 scale-y-50 scale-x-110
                animate-[spin_20s_linear_infinite] z-0
                transition-transform duration-100 ease-out will-change-transform"
            />
            <div
              ref={(el) => (cardsRef.current[1] = el)}
              data-depth="10"
              className="absolute w-80 h-80 rounded-full border border-primary/20
                transform -rotate-12 scale-y-50 scale-x-110
                animate-[spin_25s_linear_infinite_reverse] z-0
                transition-transform duration-100 ease-out will-change-transform"
            />

            {/*
             * Figure wrapper — this is the element that scales up and
             * translates to the viewport centre on scroll.
             */}
            <div
              ref={figureWrapperRef}
              className="relative z-10 will-change-transform"
              style={{
                width:           '380px',
                height:          '480px',
                transformOrigin: 'center center',
              }}
            >
              <HackerFigure />
            </div>

            {/* Interactive floating particles */}
            {[
              { cls: 'top-1/4 left-1/4 w-2 h-2 bg-primary blur-[1px]',           delay: '' },
              { cls: 'top-3/4 left-1/3 w-1 h-1 bg-primary blur-[1px]',           delay: 'delay-100' },
              { cls: 'top-1/2 right-1/4 w-3 h-3 bg-primary blur-[2px]',          delay: 'delay-300' },
              { cls: 'bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white blur-[1px]',     delay: 'delay-200' },
            ].map(({ cls, delay }, i) => (
              <div
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                className={`absolute ${cls} rounded-full animate-pulse-slow ${delay}
                  transition-transform duration-300 ease-out will-change-transform`}
              />
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────── */}
        <div
          ref={scrollIndicRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ willChange: 'opacity' }}
        >
          <span className="font-label-sm text-label-sm text-text-muted tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border border-border-subtle flex justify-center p-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce-scroll" />
          </div>
        </div>
      </div>
    </div>
  );
}
