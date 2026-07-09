import { useEffect, useRef } from 'react';
import HackerFigure from './HackerFigure';

/* ─── warp-speed star configuration ─────────────────────────── */
const STAR_COUNT = 140;

function makeStars() {
  return Array.from({ length: STAR_COUNT }, () => ({
    angle:  Math.random() * Math.PI * 2,
    r:      Math.random() * 0.15,          // initial radius (0-1 fraction)
    speed:  0.4 + Math.random() * 0.6,
    width:  0.4 + Math.random() * 1.2,
  }));
}

export default function Hero() {
  /* ── DOM refs ───────────────────────────────────────────────── */
  const heroWrapperRef   = useRef(null);   // 200 vh outer
  const figureWrapperRef = useRef(null);   // scales + translates
  const contentRef       = useRef(null);   // left column fades
  const overlayRef       = useRef(null);   // dark vignette overlay
  const scrollIndicRef   = useRef(null);
  const areaRef          = useRef(null);   // right-column area
  const warpCanvasRef    = useRef(null);   // canvas for warp stars
  const cardsRef         = useRef([]);
  const particlesRef     = useRef([]);

  /* ── shared scroll progress (no re-renders) ─────────────────── */
  const scrollProg    = useRef(0);
  const figureOffset  = useRef({ tx: 0, ty: 0 });

  /* ── Compute translation offset to centre the figure ─────────── */
  useEffect(() => {
    const compute = () => {
      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      figureOffset.current = {
        tx: window.innerWidth  / 2 - (rect.left + rect.width  / 2),
        ty: window.innerHeight / 2 - (rect.top  + rect.height / 2),
      };
    };
    const t = setTimeout(compute, 200);
    window.addEventListener('resize', compute);
    return () => { clearTimeout(t); window.removeEventListener('resize', compute); };
  }, []);

  /* ── Scroll-driven animation ─────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const wrapper = heroWrapperRef.current;
      if (!wrapper) return;

      const p = Math.min(1, Math.max(0,
        window.scrollY / (wrapper.offsetHeight - window.innerHeight)
      ));
      scrollProg.current = p;

      /* Figure: zoom + slide to centre ─────────────────────────── */
      const fw = figureWrapperRef.current;
      if (fw) {
        const sp    = Math.min(1, p / 0.88);
        const ease  = sp * sp * (3 - 2 * sp); // smoothstep
        const scale = 1 + ease * 5.8;
        const { tx, ty } = figureOffset.current;
        fw.style.transform = `translate(${tx * ease}px, ${ty * ease}px) scale(${scale})`;
        // slight motion blur on zoom-in
        const blur = ease > 0.65 ? (ease - 0.65) / 0.35 * 6 : 0;
        fw.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : '';
      }

      /* Left column: fade + drift up ──────────────────────────── */
      const c = contentRef.current;
      if (c) {
        const fade = Math.max(0, 1 - p / 0.35);
        c.style.opacity   = fade;
        c.style.transform = `translateY(${p * -55}px)`;
      }

      /* Vignette overlay ──────────────────────────────────────── */
      const o = overlayRef.current;
      if (o) {
        const opa = p > 0.58 ? Math.min(1, (p - 0.58) / 0.42) : 0;
        o.style.opacity = opa;
      }

      /* Scroll hint ───────────────────────────────────────────── */
      const si = scrollIndicRef.current;
      if (si) si.style.opacity = Math.max(0, 1 - p * 7);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Warp-speed canvas RAF loop ──────────────────────────────── */
  useEffect(() => {
    const canvas = warpCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stars = makeStars();
    let rafId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const p         = scrollProg.current;
      const intensity = Math.max(0, Math.min(1, (p - 0.12) / 0.55));

      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy);

      ctx.clearRect(0, 0, W, H);

      if (intensity > 0) {
        stars.forEach(star => {
          /* advance each star outward */
          star.r += (0.003 + star.speed * 0.007) * intensity * (1 + intensity * 2.5);
          if (star.r > 1) star.r = Math.random() * 0.04;

          const r     = star.r * maxR;
          const tailL = (12 + intensity * 55) * star.speed;
          const prevR = Math.max(0, r - tailL);

          const x  = cx + Math.cos(star.angle) * r;
          const y  = cy + Math.sin(star.angle) * r;
          const px = cx + Math.cos(star.angle) * prevR;
          const py = cy + Math.sin(star.angle) * prevR;

          const alpha = Math.min(0.75, intensity * star.speed * 0.9);
          ctx.strokeStyle = `rgba(255, 195, 195, ${alpha.toFixed(2)})`;
          ctx.lineWidth   = star.width * (0.6 + intensity * 0.8);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        });
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── Mouse parallax for rings + particles ────────────────────── */
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const onMove = (e) => {
      const rect = area.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const y    = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

      cardsRef.current.forEach(card => {
        if (!card) return;
        const d = parseFloat(card.getAttribute('data-depth')) || 20;
        card.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
      });

      particlesRef.current.forEach(pt => {
        if (!pt) return;
        const r  = pt.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rad  = 150;
        if (dist < rad) {
          const f = (rad - dist) / rad;
          pt.style.transform = `translate3d(${-(dx / dist) * f * 40}px, ${-(dy / dist) * f * 40}px, 0)`;
        } else {
          pt.style.transform = 'translate3d(0,0,0)';
        }
      });
    };

    const onLeave = () => {
      cardsRef.current.forEach(c  => { if (c)  c.style.transform  = 'translate3d(0,0,0)'; });
      particlesRef.current.forEach(p => { if (p) p.style.transform = 'translate3d(0,0,0)'; });
    };

    area.addEventListener('mousemove', onMove);
    area.addEventListener('mouseleave', onLeave);
    return () => {
      area.removeEventListener('mousemove', onMove);
      area.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    /* 200 vh — gives a full viewport of scroll travel for the animation */
    <div ref={heroWrapperRef} id="hero" style={{ height: '200vh' }}>

      {/* Sticky panel — stays fixed during animation */}
      <div className="sticky top-0 h-screen flex items-center relative overflow-hidden">

        {/* Background halo */}
        <div className="absolute inset-0 halo-bg pointer-events-none z-0" />

        {/* ── Warp-speed star canvas (z-5, below content) ─────── */}
        <canvas
          ref={warpCanvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
        />

        {/* ── Dark tunnel overlay (appears late in scroll) ──────── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 25,
            opacity: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, var(--color-dark) 72%)',
          }}
        />

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="w-full max-w-container-max mx-auto px-gutter relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" style={{ zIndex: 10 }}>

          {/* Left column — fades on scroll */}
          <div
            ref={contentRef}
            className="flex flex-col items-start gap-8"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 border border-primary-container/30 animate-entrance">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
                Full Stack Developer
              </span>
            </div>

            <div className="space-y-4 animate-entrance delay-100">
              <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-bold text-on-surface">
                Hi, I'm <br />
                <span className="text-primary">Athul Titus</span>
              </h1>
              <p className="font-body-lg text-body-lg text-text-muted max-w-lg">
                I build quantum systems, AI-powered tools, and immersive web experiences.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 animate-entrance delay-200">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
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

            <div className="flex flex-wrap gap-4 pt-4 animate-entrance delay-300">
              {['10+ Projects', 'IEEE Member', 'Quantum & AI', 'KTU University'].map(label => (
                <div key={label} className="glass-card px-4 py-2 rounded border-l-2 border-l-primary flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: 3D hacker figure ───────────────── */}
          <div
            ref={areaRef}
            className="relative h-[500px] hidden lg:flex items-center justify-center"
            style={{ zIndex: 15 }}
          >
            {/* Orbit rings */}
            <div
              ref={el => (cardsRef.current[0] = el)}
              data-depth="15"
              className="absolute w-96 h-96 rounded-full border border-primary/30
                shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.12)]
                rotate-12 scale-y-50 scale-x-110
                animate-[spin_20s_linear_infinite] z-0
                transition-transform duration-100 ease-out will-change-transform"
            />
            <div
              ref={el => (cardsRef.current[1] = el)}
              data-depth="10"
              className="absolute w-80 h-80 rounded-full border border-primary/20
                -rotate-12 scale-y-50 scale-x-110
                animate-[spin_25s_linear_infinite_reverse] z-0
                transition-transform duration-100 ease-out will-change-transform"
            />

            {/*
             * The figure wrapper — this div is what scales + translates
             * toward the viewport centre on scroll.
             */}
            <div
              ref={figureWrapperRef}
              style={{
                width:           '380px',
                height:          '480px',
                position:        'relative',
                zIndex:          20,
                transformOrigin: 'center center',
                willChange:      'transform, filter',
              }}
            >
              <HackerFigure />
            </div>

            {/* Floating particles */}
            {[
              'top-1/4 left-1/4 w-2 h-2 bg-primary blur-[1px]',
              'top-3/4 left-1/3 w-1 h-1 bg-primary blur-[1px] delay-100',
              'top-1/2 right-1/4 w-3 h-3 bg-primary blur-[2px] delay-300',
              'bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white blur-[1px] delay-200',
            ].map((cls, i) => (
              <div
                key={i}
                ref={el => (particlesRef.current[i] = el)}
                className={`absolute ${cls} rounded-full animate-pulse-slow
                  transition-transform duration-300 ease-out will-change-transform`}
              />
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────── */}
        <div
          ref={scrollIndicRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 15, willChange: 'opacity' }}
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
