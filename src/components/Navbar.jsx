import { useState, useEffect, useRef } from 'react';
import { navLinks } from '../constants';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  const lastScrollY = useRef(0);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Delay navbar appearance for loader
    const showTimer = setTimeout(() => setVisible(true), 500);

    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
      
      // Determine active link based on scroll position
      const sections = ['hero', ...navLinks.map(link => link.id)];
      let currentActive = 'hero';
      sections.forEach(sec => {
          const element = document.getElementById(sec);
          if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 100 && rect.bottom >= 100) {
                  currentActive = sec;
              }
          }
      });
      setActiveLink(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(showTimer);
    };
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveLink(id);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md shadow-none border-b border-border-subtle transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <button
          onClick={() => scrollTo('hero')}
          className="font-headline-md text-headline-md font-bold text-primary tracking-tighter hover:scale-95 duration-100 ease-in-out cursor-pointer bg-transparent border-none p-0 m-0"
        >
          AT
        </button>

        <ul className="hidden md:flex items-center gap-8 font-body-md text-body-md m-0 p-0">
          <li>
            <button onClick={() => scrollTo('hero')} className={`${activeLink === 'hero' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface transition-colors duration-300 nav-link'} bg-transparent border-none`}>
                Home
            </button>
          </li>
          {navLinks.filter(l => l.id !== 'contact' && l.id !== 'hero').map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className={`${activeLink === link.id ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface transition-colors duration-300 nav-link'} bg-transparent border-none`}
              >
                {link.title}
              </button>
            </li>
          ))}
          <li>
            <button onClick={() => scrollTo('contact')} className={`${activeLink === 'contact' ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-on-surface transition-colors duration-300 nav-link'} bg-transparent border-none`}>
                Contact
            </button>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border-subtle bg-transparent text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-all duration-300 flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-[20px] flex items-center justify-center">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          <button
            onClick={() => scrollTo('contact')}
            className="hidden md:inline-flex bg-primary text-white dark:text-dark px-6 py-2 rounded-full font-label-sm text-label-sm red-glow red-glow-hover transition-all duration-300 hover:scale-95 ease-in-out border-none cursor-pointer"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 w-64 h-screen bg-dark/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out md:hidden border-l border-border-subtle ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-6 text-on-surface hover:text-primary text-2xl bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col gap-6 pt-20 px-8 font-heading m-0 list-none">
          <li>
            <button onClick={() => scrollTo('hero')} className="text-on-surface hover:text-primary transition-colors duration-300 text-base tracking-wide bg-transparent border-none">Home</button>
          </li>
          {navLinks.filter(l => l.id !== 'hero').map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className="text-on-surface hover:text-primary transition-colors duration-300 text-base tracking-wide bg-transparent border-none"
              >
                {link.title}
              </button>
            </li>
          ))}
          <li className="pt-4">
            <button
              onClick={() => scrollTo('contact')}
              className="border border-primary text-primary hover:bg-primary hover:text-white dark:hover:text-dark px-4 py-2 transition-all duration-300 w-full text-center rounded bg-transparent cursor-pointer"
            >
              Hire Me
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
