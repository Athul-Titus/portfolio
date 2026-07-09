import { useRef, useEffect } from 'react';

const BASE_URL = import.meta.env.BASE_URL;

// Degrees per second for the idle auto-rotation
const AUTO_ROT_SPEED = 22;

export default function HackerFigure() {
  const boxRef      = useRef(null);
  const wrapRef     = useRef(null); // outer div — handles mouse tilt
  const rotY        = useRef(0);    // current Y rotation in degrees
  const isDragging  = useRef(false);
  const autoRotate  = useRef(true);
  const dragStartX  = useRef(0);
  const dragStartRotY = useRef(0);
  const rafId       = useRef(null);
  const lastTs      = useRef(null);
  const resumeTimer = useRef(null);

  /* ── RAF auto-rotation loop ─────────────────────────────── */
  useEffect(() => {
    const loop = (ts) => {
      if (autoRotate.current && !isDragging.current) {
        const delta = lastTs.current !== null ? ts - lastTs.current : 0;
        lastTs.current = ts;
        rotY.current   += (delta / 1000) * AUTO_ROT_SPEED;
        apply();
      } else {
        lastTs.current = ts;
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(resumeTimer.current);
    };
  }, []);

  const apply = () => {
    if (boxRef.current) {
      boxRef.current.style.transform = `rotateY(${rotY.current}deg)`;
    }
  };

  /* ── Drag handlers ──────────────────────────────────────── */
  const onPointerDown = (e) => {
    isDragging.current    = true;
    autoRotate.current    = false;
    dragStartX.current    = e.clientX;
    dragStartRotY.current = rotY.current;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const delta      = e.clientX - dragStartX.current;
    rotY.current     = dragStartRotY.current + delta * 0.45;
    apply();
  };

  const onPointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    // Resume auto-rotation after 1.5 s of inactivity
    resumeTimer.current = setTimeout(() => {
      autoRotate.current = true;
      lastTs.current     = null;
    }, 1500);
  };

  /* ── Mouse tilt — adds subtle perspective parallax ─────── */
  const onMouseMove = (e) => {
    const wrap = wrapRef.current;
    if (!wrap || isDragging.current) return;
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    wrap.style.transform = `perspective(1400px) rotateX(${-y * 10}deg)`;
  };

  const onMouseLeave = () => {
    if (wrapRef.current) {
      wrapRef.current.style.transform = 'perspective(1400px) rotateX(0deg)';
    }
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{ transition: 'transform 0.5s ease-out' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/*
       * CSS 3D box — perspective set on parent, this div only rotates.
       * preserve-3d lets front/back faces live in 3D space.
       */}
      <div
        ref={boxRef}
        style={{
          width:          '100%',
          height:         '100%',
          position:       'relative',
          transformStyle: 'preserve-3d',
          transform:      'rotateY(0deg)',
          willChange:     'transform',
          perspective:    '1000px',
        }}
      >
        {/* ── Front face ─── */}
        <img
          src={`${BASE_URL}avatar-front.png`}
          alt="Hacker figure — front"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-lighten"
          style={{
            transform:           'translateZ(28px)',
            backfaceVisibility:  'hidden',
            filter:              'drop-shadow(0 0 36px rgba(230,57,70,0.65))',
          }}
        />

        {/* ── Back face ─── */}
        <img
          src={`${BASE_URL}avatar-back.png`}
          alt="Hacker figure — back"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-lighten"
          style={{
            transform:           'rotateY(180deg) translateZ(28px)',
            backfaceVisibility:  'hidden',
            filter:              'drop-shadow(0 0 24px rgba(230,57,70,0.4))',
          }}
        />

        {/*
         * ── Left depth edge ──────────────────────────────────
         * A thin strip pinned to the left edge, folded 90° inward.
         * transform-origin: left center keeps it flush with the left edge.
         */}
        <div
          style={{
            position:        'absolute',
            top:             '8%',
            bottom:          '8%',
            left:            0,
            width:           '56px',
            transformOrigin: 'left center',
            transform:       'rotateY(-90deg)',
            background:      'linear-gradient(to right, rgba(230,57,70,0.45) 0%, rgba(10,2,2,0.92) 100%)',
            borderRadius:    '2px 0 0 2px',
          }}
        />

        {/* ── Right depth edge ─────────────────────────────── */}
        <div
          style={{
            position:        'absolute',
            top:             '8%',
            bottom:          '8%',
            right:           0,
            width:           '56px',
            transformOrigin: 'right center',
            transform:       'rotateY(90deg)',
            background:      'linear-gradient(to left, rgba(230,57,70,0.45) 0%, rgba(10,2,2,0.92) 100%)',
            borderRadius:    '0 2px 2px 0',
          }}
        />
      </div>

      {/* ── Drag hint ─────────────────────────────────────── */}
      <div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
      >
        <span className="font-label-sm text-text-muted text-xs tracking-widest uppercase animate-pulse">
          drag to rotate
        </span>
      </div>
    </div>
  );
}
