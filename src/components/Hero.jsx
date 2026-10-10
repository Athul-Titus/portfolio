import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* 4-pointed star spark */
function Spark({ size = 44, x, y, opacity = 0.22 }) {
  return (
    <div className="spark" style={{ position: 'absolute', top: y, left: x, pointerEvents: 'none', zIndex: 1 }}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <path
          d="M22 0C22 0 22 18 22 22C22 26 22 44 22 44C22 44 26 22 44 22C44 22 22 22 0 22C0 22 22 22 22 0Z"
          fill={`rgba(255,255,255,${opacity})`}
        />
      </svg>
    </div>
  );
}

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  const textRef = useRef(null);
  const photoRef = useRef(null);

  /* Hero entrance animation */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      textRef.current?.children,
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
    );
    tl.fromTo(
      photoRef.current,
      { x: 45, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* Sparks */}
      <Spark size={50} x="6%" y="18%" opacity={0.25} />
      <Spark size={28} x="5%" y="65%" opacity={0.2} />
      <Spark size={40} x="92%" y="20%" opacity={0.25} />
      <Spark size={24} x="88%" y="70%" opacity={0.18} />

      {/* Main grid */}
      <div className="hero-inner">
        {/* LEFT: text */}
        <div className="hero-text" ref={textRef}>
          <p className="hero-eyebrow">Available for hire · Kerala, India</p>

          <h1 className="hero-title">
            Hi, I'm a<br />
            Full Stack &amp;<br />
            AI Developer
          </h1>

          <p className="hero-sub">
            I build quantum systems, AI-powered tools, and immersive web experiences
            — turning cutting-edge ideas into real-world impact.
          </p>

          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              View My Work
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button className="btn-outline" onClick={() => scrollTo('contact')}>
              Contact Me
            </button>
          </div>
        </div>

        {/* RIGHT: photo */}
        <div className="hero-photo-wrap" ref={photoRef}>
          <img
            src={`${import.meta.env.BASE_URL}profile.jpg`}
            alt="Athul Titus"
            className="hero-photo"
            onError={e => {
              e.target.onerror = null;
              e.target.src = `${import.meta.env.BASE_URL}profilepic.png`;
            }}
          />
        </div>
      </div>
    </section>
  );
}
