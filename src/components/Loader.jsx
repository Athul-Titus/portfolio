import { useState, useEffect } from 'react';

export default function Loader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [lineExpand, setLineExpand] = useState(false);

  useEffect(() => {
    const lineTimer = setTimeout(() => setLineExpand(true), 200);
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400);
    const removeTimer = setTimeout(() => onComplete(), 1900);
    return () => {
      clearTimeout(lineTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <span className="loader-logo">AT</span>
      <div className={`loader-line ${lineExpand ? 'expand' : ''}`} />
      <p className="text-text-secondary/50 text-xs font-heading tracking-[0.3em] uppercase mt-4"
         style={{ opacity: lineExpand ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>
        Full Stack Developer • Quantum Systems • AI
      </p>
    </div>
  );
}
