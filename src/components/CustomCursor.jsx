import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const { clientX: x, clientY: y } = e;
    if (dotRef.current) {
      dotRef.current.style.left = `${x}px`;
      dotRef.current.style.top = `${y}px`;
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${x}px`;
      ringRef.current.style.top = `${y}px`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);

    const handleHoverIn = () => ringRef.current?.classList.add('hovering');
    const handleHoverOut = () => ringRef.current?.classList.remove('hovering');

    const addListeners = () => {
      document.querySelectorAll('a, button, .cursor-hover').forEach((el) => {
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, [onMouseMove]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
