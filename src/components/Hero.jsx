import { useEffect, useRef } from 'react';
import HackerFigure from './HackerFigure';

/* ─── Warp star setup ──────────────────────────────────────── */
const STAR_COUNT = 160;
function makeStars() {
  return Array.from({ length: STAR_COUNT }, () => ({
    angle: Math.random() * Math.PI * 2,
    r:     Math.random() * 0.08,
    speed: 0.35 + Math.random() * 0.65,
    w:     0.4  + Math.random() * 1.3,
  }));
}

export default function Hero() {
  /* ── Refs ───────────────────────────────────────────────── */
  const heroWrapRef  = useRef(null);   // 200 vh outer
  const sceneRef     = useRef(null);   // the div that gets scaled
  const textRef      = useRef(null);   // name/bio overlay — fades fast
  const overlayRef   = useRef(null);   // black-out veil
  const scrollIndRef = useRef(null);
  const canvasRef    = useRef(null);

  const scrollProg   = useRef(0);      // shared between scroll + canvas RAF

  /* ── Warp canvas loop ───────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const stars = makeStars();
    let rafId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      const p = scrollProg.current;
      // warp kicks in after 15% scroll, full intensity at 55%
      const intensity = Math.max(0, Math.min(1, (p - 0.15) / 0.40));

      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const maxR = Math.hypot(cx, cy);

      ctx.clearRect(0, 0, W, H);

      if (intensity > 0.01) {
        stars.forEach(star => {
          star.r += (0.0025 + star.speed * 0.006) * intensity * (1 + intensity * 3);
          if (star.r > 1) star.r = Math.random() * 0.04;

          const r    = star.r * maxR;
          const tail = (8 + intensity * 60) * star.speed;
          const pr   = Math.max(0, r - tail);

          const x  = cx + Math.cos(star.angle) * r;
          const y  = cy + Math.sin(star.angle) * r;
          const px = cx + Math.cos(star.angle) * pr;
          const py = cy + Math.sin(star.angle) * pr;

          const alpha = Math.min(0.8, intensity * star.speed * 0.85);
          ctx.strokeStyle = `rgba(255,200,200,${alpha.toFixed(2)})`;
          ctx.lineWidth   = star.w * (0.5 + intensity * 0.9);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        });
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ── Scroll animation ───────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const wrapper = heroWrapRef.current;
      if (!wrapper) return;

      const p = Math.min(1, Math.max(0,
        window.scrollY / (wrapper.offsetHeight - window.innerHeight)
      ));
      scrollProg.current = p;

      /* ── Scene zoom (centered) ───────────────────────────── *
       * AISA-style: very fast zoom in first 45% of scroll,    *
       * then maintain until black-out covers it.              */
      const sc = sceneRef.current;
      if (sc) {
        // Drive the zoom with a heavy ease-in curve so it feels
        // explosive and cinematic right from the first scroll tick
        const sp   = Math.min(1, p / 0.70);          // 0-70% of scroll drives zoom
        const ease = sp * sp;                          // ease-in²  (aggressive)
        const scale = 1 + ease * 7.0;                 // 1× → 8× at 70% scroll
        sc.style.transform = `scale(${scale})`;
      }

      /* ── Text overlay fades out fast ────────────────────── */
      const t = textRef.current;
      if (t) {
        const fade = Math.max(0, 1 - p / 0.22);      // gone by 22% scroll
        t.style.opacity   = fade;
        t.style.transform = `translateY(${-p * 60}px)`;
      }

      /* ── Black veil: starts at 55%, fully black at 88% ─── *
       * This hides the "snap to next section" moment.        */
      const o = overlayRef.current;
      if (o) {
        const opa = p > 0.55 ? Math.min(1, (p - 0.55) / 0.33) : 0;
        o.style.opacity = opa;
      }

      /* ── Scroll hint ─────────────────────────────────────── */
      const si = scrollIndRef.current;
      if (si) si.style.opacity = Math.max(0, 1 - p * 8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    /* Outer 200 vh — gives the browser a full screen of scroll
       travel dedicated to the fly-through animation.         */
    <div ref={heroWrapRef} id="hero" style={{ height: '200vh' }}>

      {/* Sticky panel — always fills the viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center relative">

        {/* Background radial halo */}
        <div className="absolute inset-0 halo-bg pointer-events-none z-0" />

        {/* Warp-speed star canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} />

        {/*
         * ── Scene: figure + ambient glow ─────────────────────
         * This single div scales from the viewport centre.
         * transform-origin is default "50% 50%" (centre).
         */}
        <div
          ref={sceneRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex:          10,
            willChange:      'transform',
            transformOrigin: 'center center',
          }}
        >
          {/* Ambient glow behind the figure */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width:      '520px',
              height:     '520px',
              background: 'radial-gradient(ellipse at center, rgba(230,57,70,0.18) 0%, transparent 70%)',
              filter:     'blur(40px)',
            }}
          />

          {/* The 3D rotating hacker figure */}
          <div style={{ width: '340px', height: '460px', position: 'relative', zIndex: 2 }}>
            <HackerFigure />
          </div>
        </div>

        {/*
         * ── Text overlay — NOT inside sceneRef so it doesn't scale ──
         * Positioned at bottom-centre, fades out on first scroll.
         */}
        <div
          ref={textRef}
          className="absolute bottom-28 left-0 right-0 flex flex-col items-center gap-5 px-6 text-center"
          style={{ zIndex: 20, willChange: 'opacity, transform' }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 border border-primary-container/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Full Stack Developer
            </span>
          </div>

          {/* Name */}
          <h1 className="font-headline-xl text-4xl md:text-5xl font-bold text-on-surface leading-tight">
            Hi, I'm&nbsp;
            <span className="text-primary">Athul Titus</span>
          </h1>
          <p className="font-body-lg text-body-lg text-text-muted max-w-xl">
            I build quantum systems, AI-powered tools, and immersive web experiences.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <button
              onClick={() => {
                const el = document.getElementById('projects');
                if (!el) return;
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
              }}
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
        </div>

        {/* ── Black-out veil (smooth transition to next section) ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-dark pointer-events-none"
          style={{ zIndex: 30, opacity: 0 }}
        />

        {/* ── Scroll indicator ──────────────────────────────── */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 25, willChange: 'opacity' }}
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
