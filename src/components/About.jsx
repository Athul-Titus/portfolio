import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { education, skills } from '../constants';

function SectionHeading({ children, bracketLeft = '<>', bracketRight = '</>' }) {
  return (
    <div className="flex justify-center mb-16">
      <h2 className="section-heading">
        <span className="bracket bracket-left">{bracketLeft}</span>
        {children}
        <span className="bracket bracket-right">{bracketRight}</span>
      </h2>
    </div>
  );
}

function AnimateOnScroll({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-20 bg-dark">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading>About Me</SectionHeading>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Photo */}
            <AnimateOnScroll className="w-64 h-[26rem] flex-shrink-0 mx-auto md:mx-0">
              <div className="relative group w-full h-full">
                <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-dark-card flex items-center justify-center">
                  <span className="text-7xl font-heading font-bold text-primary/30">AT</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </AnimateOnScroll>

            {/* Bio + Cards */}
            <div className="flex-grow">
              <AnimateOnScroll delay={0.1} className="space-y-4 mb-4">
                <h3 className="text-primary text-xl font-semibold font-heading">
                  ATHUL TITUS
                </h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  A passionate Full Stack Developer and Computer Science student from Kerala, India.
                  Currently exploring Quantum Computing (BB84 QKD protocols), building AI-powered tools,
                  and developing full-stack platforms. I love building products that sit at the intersection
                  of cutting-edge tech and real-world impact — from quantum-safe key distribution systems
                  to talent discovery platforms powered by intelligent matching.
                </p>
              </AnimateOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Education */}
                <AnimateOnScroll delay={0.2}>
                  <div className="bg-dark-card/50 p-4 rounded-xl h-full">
                    <h3 className="text-primary text-base font-semibold mb-3 font-heading">
                      EDUCATION
                    </h3>
                    <div className="space-y-3">
                      {education.map((edu, i) => (
                        <div key={i} className="border-l-2 border-primary pl-3">
                          <h4 className="text-white text-sm font-medium">{edu.school}</h4>
                          <p className="text-primary text-xs">{edu.period}</p>
                          <p className="text-gray-400 text-xs">{edu.degree}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Skills */}
                <AnimateOnScroll delay={0.4}>
                  <div className="bg-dark-card/50 p-4 rounded-xl h-full">
                    <h3 className="text-primary text-base font-semibold mb-3 font-heading">
                      SKILLS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Full Stack Dev', 'Quantum Computing', 'AI/ML', 'IoT Systems', 'System Design', 'UI/UX'].map(
                        (skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Tech Stack */}
                <AnimateOnScroll delay={0.6}>
                  <div className="bg-dark-card/50 p-4 rounded-xl h-full">
                    <h3 className="text-primary text-base font-semibold mb-3 font-heading">
                      TECH STACK
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {skills.slice(0, 6).map((tech) => (
                        <div key={tech.name} className="tech-icon-card">
                          <span className="text-sm">{tech.icon}</span>
                          <p className="text-white text-[10px] mt-1">{tech.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
