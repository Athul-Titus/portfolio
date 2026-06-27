import { useEffect, useRef } from 'react';
import InteractiveAvatar from './InteractiveAvatar';

export default function Hero() {
  const areaRef = useRef(null);
  const avatarContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const particlesRef = useRef([]);

  useEffect(() => {
    const area = areaRef.current;
    const avatarContainer = avatarContainerRef.current;
    const cards = cardsRef.current;
    const particles = particlesRef.current;

    if (!area) return;

    const handleMouseMove = (e) => {
      const rect = area.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Normalized coordinates (-1 to 1)
      const x = (mouseX - centerX) / (rect.width / 2);
      const y = (mouseY - centerY) / (rect.height / 2);

      // 1. Enhanced Parallax & Tilt for Avatar
      if (avatarContainer) {
          const tiltX = -y * 20; // Max 20deg tilt
          const tiltY = x * 20;
          const transX = x * 30; // Max 30px translation
          const transY = y * 30;
          avatarContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${transX}px, ${transY}px, 0)`;
      }

      // 2. High-performance Parallax for Cards
      cards.forEach(card => {
          if (!card) return;
          const depth = parseFloat(card.getAttribute('data-depth')) || 20;
          card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });

      // 3. Interactive Particles (Repulsion)
      particles.forEach(particle => {
          if (!particle) return;
          const pRect = particle.getBoundingClientRect();
          const pCenterX = pRect.left + pRect.width / 2;
          const pCenterY = pRect.top + pRect.height / 2;
          
          const dx = mouseX - pCenterX;
          const dy = mouseY - pCenterY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          const repelRadius = 150;
          if (dist < repelRadius) {
              const force = (repelRadius - dist) / repelRadius;
              const moveX = - (dx / dist) * force * 40; // Push away
              const moveY = - (dy / dist) * force * 40;
              particle.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          } else {
              particle.style.transform = `translate3d(0, 0, 0)`;
          }
      });
    };

    const handleMouseLeave = () => {
      if (avatarContainer) {
          avatarContainer.style.transform = `rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)`;
      }
      cards.forEach(card => {
          if (card) card.style.transform = `translate3d(0, 0, 0)`;
      });
      particles.forEach(particle => {
          if (particle) particle.style.transform = `translate3d(0, 0, 0)`;
      });
    };

    area.addEventListener('mousemove', handleMouseMove);
    area.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      area.removeEventListener('mousemove', handleMouseMove);
      area.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <main id="hero" className="flex-grow relative flex items-center pt-24 pb-section-gap overflow-hidden min-h-screen">
      {/* Background Halo */}
      <div className="absolute inset-0 halo-bg pointer-events-none z-0"></div>
      
      <div className="w-full max-w-container-max mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Content */}
        <div className="flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 border border-primary-container/30 animate-entrance">
            <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-[#E63946] uppercase tracking-widest">Full Stack Developer</span>
          </div>
          
          <div className="space-y-4 animate-entrance delay-100">
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-bold text-on-surface">
                Hi, I'm <br/><span className="text-[#E63946]">Athul Titus</span>
            </h1>
            <p className="font-body-lg text-body-lg text-text-muted max-w-lg">
                I build quantum systems, AI-powered tools, and immersive web experiences.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 animate-entrance delay-200">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#E63946] text-white px-8 py-3 rounded-full font-body-md text-body-md flex items-center gap-2 red-glow red-glow-hover transition-all duration-300 hover:scale-95">
                View Projects
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button 
              onClick={() => window.open('https://github.com/Athul-Titus', '_blank')}
              className="bg-transparent border border-border-subtle hover:border-[#E63946]/50 text-white px-8 py-3 rounded-full font-body-md text-body-md flex items-center gap-2 transition-all duration-300 hover:bg-white/5 hover:scale-95 glass-card">
                <span className="material-symbols-outlined text-[18px]">code</span>
                GitHub
            </button>
          </div>
          
          {/* Stat Pills */}
          <div className="flex flex-wrap gap-4 pt-4 animate-entrance delay-300">
            <div className="glass-card px-4 py-2 rounded border-l-2 border-l-[#E63946] flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">10+ Projects</span>
            </div>
            <div className="glass-card px-4 py-2 rounded border-l-2 border-l-[#E63946] flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">IEEE Member</span>
            </div>
            <div className="glass-card px-4 py-2 rounded border-l-2 border-l-[#E63946] flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">Quantum &amp; AI</span>
            </div>
            <div className="glass-card px-4 py-2 rounded border-l-2 border-l-[#E63946] flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface">KTU University</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visual Area */}
        <div ref={areaRef} id="avatar-area" className="relative h-[500px] hidden lg:flex items-center justify-center group perspective-[1000px]">
          {/* Abstract Halo/Ring */}
          <div className="absolute w-96 h-96 rounded-full border border-[#E63946]/30 shadow-[0_0_50px_rgba(230,57,70,0.1)] group-hover:shadow-[0_0_80px_rgba(230,57,70,0.3)] transition-shadow duration-500 transform rotate-12 scale-y-50 scale-x-110 animate-[spin_20s_linear_infinite] z-0"></div>
          <div className="absolute w-80 h-80 rounded-full border border-[#E63946]/20 transform -rotate-12 scale-y-50 scale-x-110 animate-[spin_25s_linear_infinite_reverse] z-0"></div>
          
          {/* Central 3D Interactive Avatar */}
          <div ref={avatarContainerRef} id="main-avatar-container" className="relative z-10 avatar-glow transition-all duration-500 animate-float will-change-transform flex items-center justify-center">
            <InteractiveAvatar className="w-[350px] md:w-[450px] h-[500px]" />
          </div>

          {/* Floating Particles */}
          <div ref={el => particlesRef.current[0] = el} className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#E63946] rounded-full blur-[1px] animate-pulse-slow interactive-particle transition-transform duration-300 ease-out will-change-transform"></div>
          <div ref={el => particlesRef.current[1] = el} className="absolute top-3/4 left-1/3 w-1 h-1 bg-[#E63946] rounded-full blur-[1px] animate-pulse-slow delay-100 interactive-particle transition-transform duration-300 ease-out will-change-transform"></div>
          <div ref={el => particlesRef.current[2] = el} className="absolute top-1/2 right-1/4 w-3 h-3 bg-[#E63946] rounded-full blur-[2px] animate-pulse-slow delay-300 interactive-particle transition-transform duration-300 ease-out will-change-transform"></div>
          <div ref={el => particlesRef.current[3] = el} className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-pulse-slow delay-200 interactive-particle transition-transform duration-300 ease-out will-change-transform"></div>
          
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-label-sm text-label-sm text-text-muted tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-border-subtle flex justify-center p-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-bounce-scroll"></div>
        </div>
      </div>
    </main>
  );
}
