import { useState, useEffect } from 'react';

export default function Loader({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1200);
    const removeTimer = setTimeout(() => onComplete(), 1700);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <span className="loader-logo">AT</span>
    </div>
  );
}
