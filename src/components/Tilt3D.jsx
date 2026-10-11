import { useRef, useState, useEffect } from 'react';

/**
 * Tilt3D - High-performance 3D card physics wrapper
 * Supports:
 * - Dynamic mouse tilt in 3D perspective
 * - Radial cursor light/reflection sheen
 * - Scroll parallax floating drift
 * - Smooth spring physics on leave
 */
export default function Tilt3D({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1100,
  scale = 1.02,
  glowColor = 'rgba(230, 57, 70, 0.25)',
  floatAngle = 0,
  style = {},
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);

  // Scroll parallax drift calculation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const viewportH = window.innerHeight;
            // Only calculate when near viewport
            if (rect.top < viewportH + 200 && rect.bottom > -200) {
              const centerDiff = (rect.top + rect.height / 2) - (viewportH / 2);
              // Subtle parallax float (-12px to +12px)
              setScrollYOffset(centerDiff * -0.025);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: rotX, y: rotY });
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  // Base float rotation angle when not hovered
  const currentRotZ = isHovered ? 0 : floatAngle;
  const currentRotX = isHovered ? tilt.x : 0;
  const currentRotY = isHovered ? tilt.y : 0;
  const currentScale = isHovered ? scale : 1;

  return (
    <div
      ref={cardRef}
      className={`tilt-3d-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      <div
        className="tilt-3d-inner"
        style={{
          transform: `translateY(${scrollYOffset}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`,
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease-out'
            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Dynamic Specular Sheen Glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 10,
            opacity: glow.opacity,
            transition: 'opacity 0.3s ease',
            background: `radial-gradient(circle 320px at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}
