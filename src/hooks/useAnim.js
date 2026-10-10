import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate all [data-anim] elements in a container on scroll.
 * Call this once per section that has scroll-triggered content.
 */
export function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const elems = containerRef.current.querySelectorAll('[data-anim]');
      elems.forEach((el) => {
        const type = el.dataset.anim || '';
        const delay = parseFloat(el.dataset.delay || 0);
        const from = type === 'left'
          ? { x: -40, opacity: 0 }
          : type === 'right'
          ? { x: 40, opacity: 0 }
          : type === 'scale'
          ? { scale: 0.92, opacity: 0 }
          : { y: 36, opacity: 0 };

        gsap.fromTo(el, from, {
          x: 0, y: 0, scale: 1, opacity: 1,
          duration: 0.75,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Staggered children animation for lists/grids.
 */
export function useStagger(containerRef, selector = '[data-stagger]', deps = []) {
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const items = containerRef.current.querySelectorAll(selector);
      if (!items.length) return;
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
