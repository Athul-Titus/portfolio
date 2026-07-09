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
              <div className="relative group w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-border-subtle hover:border-primary/50 transition-all duration-500">
                <img 
                  src={`${import.meta.env.BASE_URL}profile.jpg`} 
                  alt="Athul Titus" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/400x600/E63946/ffffff?text=Image+Not+Found";
                  }}
                />
              </div>
            </AnimateOnScroll>

            {/* Bio + Cards */}
            <div className="flex-grow">
              <AnimateOnScroll delay={0.1} className="space-y-4 mb-4">
                <h3 className="text-primary text-xl font-semibold font-heading">
                  ATHUL TITUS
                </h3>
                <p className="text-lg text-text-primary leading-relaxed">
                  A passionate Full Stack Developer and Computer Science student from Kerala, India 🚀. Currently exploring AI, Quantum Computing, and full-stack development while building innovative projects like quantum-safe communication systems and AI-powered platforms. I enjoy creating technology that combines cutting-edge innovation with real-world impact, turning ideas into practical and meaningful solutions.
                </p>
              </AnimateOnScroll>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <AnimateOnScroll delay={0.2}>
                  <div className="bg-dark-card/50 p-4 rounded-xl h-full">
                    <h3 className="text-primary text-base font-semibold mb-3 font-heading">
                      EDUCATION
                    </h3>
                    <div className="space-y-3">
                      {education.map((edu, i) => (
                        <div key={i} className="border-l-2 border-primary pl-3">
                          <h4 className="text-text-primary text-sm font-medium">{edu.school}</h4>
                          <p className="text-primary text-xs">{edu.period}</p>
                          <p className="text-text-secondary text-xs">{edu.degree}</p>
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
                      {['Full Stack Dev', 'Quantum Computing', 'AI/ML', 'UI/UX'].map(
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
