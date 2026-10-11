import { useEffect } from 'react';
import { projects } from '../constants';
import Tilt3D from './Tilt3D';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* Browser-mockup frame with 3D tilt & parallax */
function BrowserFrame({ project, isReverse }) {
  return (
    <Tilt3D
      maxTilt={8}
      scale={1.025}
      glowColor={`${project.color}35`}
      floatAngle={isReverse ? -1.5 : 1.5}
      className="project-browser-tilt-wrap"
    >
      <div className="project-browser">
        {/* Browser chrome bar */}
        <div className="project-browser-bar">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
          <div className="browser-url">
            {project.liveUrl
              ? project.liveUrl.replace('https://', '').split('/')[0]
              : `github.com/Athul-Titus/${project.title.replace(/\s+/g, '-').toLowerCase()}`}
          </div>
        </div>

        {/* Project preview area */}
        <div
          className="project-preview"
          style={{ background: `linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, ${project.color}33 100%)` }}
        >
          {/* Decorative glow orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '220px', height: '220px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${project.color}45 0%, transparent 70%)`,
            filter: 'blur(35px)',
          }} />
          <div className="project-preview-inner">
            <div
              style={{
                width: 60, height: 60, borderRadius: '16px',
                background: project.color, margin: '0 auto 1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', boxShadow: `0 10px 32px ${project.color}70`,
                transform: 'translateZ(30px)',
              }}
            >
              {project.tags[0]?.charAt(0) || '💡'}
            </div>
            <div className="project-preview-title" style={{ transform: 'translateZ(25px)' }}>
              {project.title}
            </div>
            <div className="project-preview-sub" style={{ transform: 'translateZ(20px)' }}>
              {project.tags.slice(0, 2).join(' · ')}
            </div>
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}

/* Featured project card (full width alternating layout) */
function FeaturedProject({ project, index }) {
  const isReverse = index % 2 === 1;
  return (
    <div className={`project-item ${isReverse ? 'reverse' : ''} reveal`}>
      {/* 3D Browser mockup */}
      <div className={isReverse ? 'reveal-right' : 'reveal-left'}>
        <BrowserFrame project={project} isReverse={isReverse} />
      </div>

      {/* Info */}
      <div className={`project-info ${isReverse ? 'reveal-left' : 'reveal-right'}`}>
        <div className="project-number">#{String(index + 1).padStart(2, '0')}</div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-subtitle">{project.tags.slice(0, 3).join(' · ')}</p>
        <p className="project-desc">{project.description}</p>

        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-explore">
              Explore Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-github">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          {!project.liveUrl && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-explore">
              Explore Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* Small card for non-featured projects with 3D Tilt */
function OtherProjectCard({ project, index }) {
  const floatAngle = (index % 3 - 1) * 1.5; // -1.5deg, 0deg, 1.5deg staggered
  return (
    <Tilt3D
      maxTilt={10}
      scale={1.03}
      glowColor={`${project.color}25`}
      floatAngle={floatAngle}
      className="reveal"
    >
      <div className="other-project-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '10px', background: project.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', flexShrink: 0, color: '#fff', fontWeight: 800,
            boxShadow: `0 4px 14px ${project.color}50`,
          }}>
            {project.tags[0]?.charAt(0)}
          </div>
          <h3 className="other-project-title">{project.title}</h3>
        </div>
        <p className="other-project-desc">{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.1rem' }}>
          {project.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontSize: '0.72rem', padding: '0.22rem 0.68rem', borderRadius: '100px',
              border: '1px solid rgba(0,0,0,0.1)', color: '#6b7280', background: 'white'
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: 'auto' }}>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View Code
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live
            </a>
          )}
        </div>
      </div>
    </Tilt3D>
  );
}

export default function Projects() {
  useReveal();

  const featured = projects.filter(p => p.featured);
  const others = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="projects-section light-section dot-grid">
      {/* Header */}
      <div className="projects-header">
        <div className="reveal-left">
          <span className="section-pill">SELECTED WORKS</span>
          <h2 className="section-title">
            Featured <span className="accent">Projects.</span>
          </h2>
        </div>
        <p className="section-desc reveal-right" style={{ marginTop: '1.5rem' }}>
          A showcase of my recent applications, highlighting performance, design,
          and complex integrations across web, AI, and quantum domains.
        </p>
      </div>

      {/* Featured projects (browser mockup alternating layout with 3D tilt) */}
      {featured.map((project, i) => (
        <FeaturedProject key={project.title} project={project} index={i} />
      ))}

      {/* Other projects grid with 3D physics */}
      {others.length > 0 && (
        <>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--gutter) 2rem' }}>
            <h3 className="reveal" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              More Projects
            </h3>
          </div>
          <div className="other-projects-grid">
            {others.map((p, idx) => (
              <OtherProjectCard key={p.title} project={p} index={idx} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
