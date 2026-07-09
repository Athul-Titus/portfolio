import { useRef, useEffect, useState, useCallback } from 'react';

const FRAME_COUNT = 240;
const ROTATION_SPEED = 36; // image-frames per second → full spin in ~6.7s

export default function HackerFigure() {
  const imgRef       = useRef(null);
  const imagesRef    = useRef([]);
  const containerRef = useRef(null);

  const [loaded,       setLoaded]       = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Mutable state kept in refs to avoid re-render pressure
  const frameRef        = useRef(0);
  const autoRotate      = useRef(true);
  const isDragging      = useRef(false);
  const dragStartX      = useRef(0);
  const dragStartFrame  = useRef(0);
  const rafId           = useRef(null);
  const lastTs          = useRef(null);
  const accum           = useRef(0);
  const resumeTimer     = useRef(null);

  /* ── Preload all frames ─────────────────────────────────────── */
  useEffect(() => {
    let done = 0;
    const base = import.meta.env.BASE_URL;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${base}3d_frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      const onDone = () => {
        done++;
        setLoadProgress(Math.round((done / FRAME_COUNT) * 100));
        if (done === FRAME_COUNT) setLoaded(true);
      };
      img.onload  = onDone;
      img.onerror = onDone;
      imagesRef.current[i] = img;
    }

    return () => {
      if (rafId.current)     cancelAnimationFrame(rafId.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  /* ── Frame renderer ─────────────────────────────────────────── */
  const showFrame = useCallback((rawIndex) => {
    const idx = ((rawIndex % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    frameRef.current = idx;
    const img = imagesRef.current[idx];
    if (imgRef.current && img?.complete) imgRef.current.src = img.src;
  }, []);

  /* ── RAF auto-rotation loop ─────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;

    const loop = (ts) => {
      if (autoRotate.current && !isDragging.current) {
        const delta = lastTs.current !== null ? ts - lastTs.current : 0;
        lastTs.current = ts;
        accum.current += (delta / 1000) * ROTATION_SPEED;
        if (accum.current >= 1) {
          const steps = Math.floor(accum.current);
          accum.current -= steps;
          showFrame(frameRef.current + steps);
        }
      } else {
        lastTs.current = ts;
        accum.current  = 0;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [loaded, showFrame]);

  /* ── Pointer drag handlers ──────────────────────────────────── */
  const onPointerDown = (e) => {
    isDragging.current  = true;
    autoRotate.current  = false;
    dragStartX.current  = e.clientX;
    dragStartFrame.current = frameRef.current;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    // Remove tilt while dragging
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
      containerRef.current.style.transform  = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    // ~3 px per image frame for natural drag feel
    showFrame(dragStartFrame.current + Math.round(delta / 3));
  };

  const onPointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.4s ease-out';
    }
    // Resume auto-rotation after 1.5 s of inactivity
    resumeTimer.current = setTimeout(() => {
      autoRotate.current = true;
      lastTs.current     = null;
    }, 1500);
  };

  /* ── Mouse tilt (parallax depth) ───────────────────────────── */
  const onMouseMove = (e) => {
    if (!containerRef.current || isDragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    containerRef.current.style.transform =
      `perspective(1200px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg)`;
  };

  const onMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{
        transition:     'transform 0.4s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* ── Loading shimmer ─────────────────────────────────── */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4">
          {/* Animated silhouette placeholder */}
          <div className="w-40 h-64 rounded-2xl bg-primary/5 animate-pulse" />
          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="font-label-sm text-xs text-primary uppercase tracking-widest animate-pulse">
              Initializing 3D
            </span>
            <div className="w-36 h-[2px] bg-on-surface/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-text-muted text-xs font-label-sm">{loadProgress}%</span>
          </div>
        </div>
      )}

      {/* ── Frame image ─────────────────────────────────────── */}
      <img
        ref={imgRef}
        src={`${import.meta.env.BASE_URL}3d_frames/ezgif-frame-001.jpg`}
        alt="3D Hacker Figure — rotating"
        className={`
          w-full h-full object-contain mix-blend-lighten pointer-events-none
          drop-shadow-[0_0_40px_rgba(230,57,70,0.55)]
          transition-opacity duration-700
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
        draggable="false"
      />

      {/* ── Drag hint ───────────────────────────────────────── */}
      {loaded && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
          <span className="font-label-sm text-text-muted text-xs tracking-widest uppercase animate-pulse">
            drag to rotate
          </span>
        </div>
      )}
    </div>
  );
}
