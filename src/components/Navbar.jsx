import { useState, useEffect, useRef } from 'react';
import { navLinks } from '../constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  const [lightMode, setLightMode] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Hide on scroll down, show on scroll up
      setHidden(currentY > lastScrollY.current && currentY > 120);
      lastScrollY.current = currentY;

      // Glassmorphism kicks in after 80px
      setScrolled(currentY > 80);

      // Detect if we're in a light section (about-wave, skills, projects)
      const lightSections = ['skills', 'projects'];
      let inLight = false;
      lightSections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom >= 0) inLight = true;
        }
      });
      setLightMode(inLight);

      // Active link detection
      const all = ['hero', ...navLinks.map(l => l.id)];
      let cur = 'hero';
      all.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) cur = id;
        }
      });
      setActiveLink(cur);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${lightMode && !scrolled ? 'navbar-light' : ''}`}
        style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 0.3s ease, background 0.3s ease' }}
      >
        <div className="navbar-inner">
          {/* Logo */}
          <button className="navbar-logo" onClick={() => scrollTo('hero')}>
            ATHUL TITUS<span>.</span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <button className={`nav-link-btn ${activeLink === 'hero' ? 'active' : ''}`} onClick={() => scrollTo('hero')}>
                Home
              </button>
            </li>
            <li>
              <button className={`nav-link-btn ${activeLink === 'about' ? 'active' : ''}`} onClick={() => scrollTo('about')}>
                About
              </button>
            </li>
            <li>
              <button className={`nav-link-btn ${activeLink === 'skills' ? 'active' : ''}`} onClick={() => scrollTo('skills')}>
                Skills
              </button>
            </li>
            <li>
              <button className={`nav-link-btn ${activeLink === 'projects' ? 'active' : ''}`} onClick={() => scrollTo('projects')}>
                Projects
              </button>
            </li>
            <li>
              <button className={`nav-link-btn ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => scrollTo('contact')}>
                Contact
              </button>
            </li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* GitHub icon */}
            <a
              href="https://github.com/Athul-Titus"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: lightMode && !scrolled ? '#111' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href={`${import.meta.env.BASE_URL}resume_Athul_09.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume"
              style={lightMode && !scrolled ? { borderColor: 'rgba(0,0,0,0.25)', color: 'rgba(0,0,0,0.7)' } : {}}
            >
              Resume
            </a>

            <button className="btn-hire" onClick={() => scrollTo('contact')}>
              Hire Me
            </button>

            {/* Mobile burger */}
            <button
              className={`burger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={() => setMobileOpen(false)}
        >✕</button>
        {['hero', 'about', 'skills', 'projects', 'contact'].map(id => (
          <button key={id} className="mobile-menu-link" onClick={() => scrollTo(id)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
        <a href={`${import.meta.env.BASE_URL}resume_Athul_09.pdf`} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--primary)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none' }}>
          Resume
        </a>
      </div>
    </>
  );
}
