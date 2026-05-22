import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RobotCanvas from './RobotCanvas';
import { socialLinks } from '../constants';

const name = 'ATHUL TITUS';

export default function Hero() {
  const [showContent, setShowContent] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 1600);
    const t2 = setTimeout(() => setShowSubtitle(true), 2800);
    const t3 = setTimeout(() => setShowButton(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center pt-16 px-4 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <RobotCanvas />
      </div>

      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(230,57,70,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <div className="w-full max-w-4xl text-center px-4 md:px-8">
          {/* Big name */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-[0.08em] intro-letter-glow leading-none">
            {name.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block intro-letter"
                style={{
                  animationDelay: `${1.8 + i * 0.12}s`,
                  marginRight: char === ' ' ? '0.3em' : '0.02em',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-primary/70 text-sm md:text-base tracking-[0.25em] uppercase font-heading mt-6"
            initial={{ opacity: 0, y: 16 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Full Stack Developer • Quantum Systems • AI Tools
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={showButton ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative overflow-hidden border border-primary text-primary hover:bg-primary transition-all duration-300 font-heading tracking-wide whitespace-nowrap inline-flex items-center justify-center w-[180px] h-[42px] text-sm"
            >
              <span className="transform transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
                View Projects
              </span>
              <span className="absolute transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300 text-lg">
                →
              </span>
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline text-sm h-[42px] px-6"
            >
              Get In Touch
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile social links */}
      <div className="flex md:hidden justify-center gap-6 mt-8 z-10">
        {socialLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-primary transition-colors"
            aria-label={link.name}
          >
            <span className="text-xl">
              {link.icon === 'github' ? '⌂' : link.icon === 'linkedin' ? 'in' : '✉'}
            </span>
          </a>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent" />
      </motion.div>
    </section>
  );
}
