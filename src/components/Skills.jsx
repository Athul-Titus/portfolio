import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../constants';

const BallCanvas = lazy(() => import('./BallCanvas'));

export default function Skills() {
  return (
    <section id="skills" className="py-24">
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
            Technologies I Work With
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

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center"
            >
              <Suspense
                fallback={
                  <div className="ball-canvas flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full"
                      style={{ background: skill.color, opacity: 0.5 }}
                    />
                  </div>
                }
              >
                <BallCanvas color={skill.color} />
              </Suspense>
              <span className="text-text-secondary text-sm font-body mt-2 text-center">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
