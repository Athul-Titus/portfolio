import { useEffect } from 'react';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const techStack = [
  { name: 'React', emoji: '⚛️' },
  { name: 'Python', emoji: '🐍' },
  { name: 'Node.js', emoji: '🟢' },
  { name: 'TypeScript', emoji: '📘' },
  { name: 'Qiskit', emoji: '⚛️' },
  { name: 'Flutter', emoji: '🐦' },
  { name: 'Three.js', emoji: '🎮' },
  { name: 'PostgreSQL', emoji: '🐘' },
];

function Spark4({ size = 40, style = {}, opacity = 0.25 }) {
  return (
    <div className="spark" style={style}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
          d="M20 0 C20 0 20 16 20 20 C20 24 20 40 20 40 C20 40 24 20 40 20 C40 20 20 20 0 20 C0 20 20 20 20 0Z"
          fill={`rgba(255,255,255,${opacity})`}
        />
      </svg>
    </div>
  );
}

export default function About() {
  useReveal();

  return (
    <section id="about" className="about-section">
      <div style={{ position: 'relative' }}>
        {/* Decorative sparks */}
        <Spark4 size={48} style={{ top: '8%', left: '3%' }} opacity={0.2} />
        <Spark4 size={28} style={{ bottom: '25%', right: '4%' }} opacity={0.2} />

        <div className="about-inner">
          {/* LEFT: Photo in clipboard frame */}
          <div className="about-photo-wrap reveal-left">
            <div className="about-photo-frame">
              <div className="about-photo-clip" />
              <img
                src={`${import.meta.env.BASE_URL}profilepic.png`}
                alt="Athul Titus"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `${import.meta.env.BASE_URL}profile.jpg`;
                }}
              />
            </div>
          </div>

          {/* RIGHT: Bio + Tech */}
          <div className="about-text">
            <h2 className="about-hello reveal">Hello!</h2>
            <p className="about-bio reveal reveal-delay-1">
              Hi, my name is <strong>ATHUL TITUS</strong>, a passionate Full Stack Developer
              and Computer Science student from Kerala, India 🚀. Currently exploring
              AI, Quantum Computing, and full-stack development while building innovative
              projects — from quantum-safe communication systems to AI-powered platforms.
              I enjoy creating technology that turns cutting-edge ideas into practical,
              meaningful solutions.
            </p>

            {/* Education badge */}
            <div className="reveal reveal-delay-2" style={{ marginBottom: '1.75rem' }}>
              <div className="edu-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.15rem' }}>Currently Studying</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>B.Tech CSE (Data Science) · KTU · 2022–Present</div>
                </div>
              </div>
            </div>

            {/* Tech stack pills */}
            <div className="tech-logos reveal reveal-delay-3">
              {techStack.map(t => (
                <span key={t.name} className="tech-logo-item">
                  <span>{t.emoji}</span>
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition: Red -> Off-white light section */}
      <div className="about-wave">
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0,45 C360,90 720,0 1080,45 C1260,67.5 1380,22.5 1440,45 L1440,90 L0,90 Z"
            fill="var(--light-bg)"
          />
        </svg>
      </div>
    </section>
  );
}
