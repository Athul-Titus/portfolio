import { useState, useEffect, useRef } from 'react';
import { navLinks } from '../constants';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Delay navbar appearance for loader
    const showTimer = setTimeout(() => setVisible(true), 1800);

    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
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
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="font-heading text-xl font-bold text-white tracking-wider"
        >
          {/* empty like anjicodes — or show AT */}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center gap-8 mr-6">
            {navLinks.filter(l => l.id !== 'contact').map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-white hover:text-primary transition-colors duration-300 font-heading text-sm tracking-wide"
                >
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollTo('contact')}
            className="group relative overflow-hidden border border-primary text-primary hover:bg-primary transition-all duration-300 font-heading tracking-wide whitespace-nowrap inline-flex items-center justify-center w-[160px] h-[38px] text-sm"
          >
            <span className="transform transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
              Contact Me
            </span>
            <span className="absolute transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 text-lg">
              ✉
            </span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 w-64 h-screen bg-dark/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-6 text-white hover:text-primary text-2xl"
          onClick={() => setMobileOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col gap-6 pt-20 px-8 font-heading">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className="text-white hover:text-primary transition-colors duration-300 text-base tracking-wide"
              >
                {link.title}
              </button>
            </li>
          ))}
          <li className="pt-4">
            <button
              onClick={() => scrollTo('contact')}
              className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 transition-all duration-300 w-full text-center"
            >
              Contact Me
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
