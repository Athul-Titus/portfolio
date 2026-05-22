import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../constants';

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 text-center"
    >
      <span className="font-heading text-3xl font-bold text-primary">
        {count}
        {suffix}
      </span>
      <p className="text-text-secondary text-sm mt-2 font-body">{label}</p>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="section-heading">
            About Me
            <motion.span
              className="animated-underline absolute bottom-[-8px] left-0 h-[3px] bg-primary block w-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Bio Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-secondary text-base leading-relaxed font-body mb-6">
              I&apos;m a 3rd-year B.Tech Computer Science (Data Science) student at APJ
              Abdul Kalam Technological University (KTU), Kerala. I build full-stack
              platforms, quantum simulation tools, and AI-powered systems.
            </p>
            <p className="text-text-secondary text-base leading-relaxed font-body">
              Beyond code, I&apos;ve produced an award-winning short film{' '}
              <span className="text-primary font-medium">IRAVAN</span> and led a 40+
              member production team on{' '}
              <span className="text-primary font-medium">TRILOKH</span>.
            </p>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <StatCounter
                key={i}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
