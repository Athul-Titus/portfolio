import { motion } from 'framer-motion';
import RobotCanvas from './RobotCanvas';

const words = "Hi, I'm Athul Titus".split(' ');
const subWords =
  'I build immersive web experiences, quantum systems, and AI-powered tools.'.split(' ');

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* ─── Text Content ─── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          {/* Tag */}
          <motion.span
            variants={wordVariants}
            className="inline-block text-primary font-heading text-sm tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-primary/30"
          >
            Full Stack Developer
          </motion.span>

          {/* Main Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <p className="text-text-secondary text-lg mb-8 max-w-lg">
            {subWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-[5px]"
              >
                {word}
              </motion.span>
            ))}
          </p>

          {/* CTA Buttons */}
          <motion.div variants={wordVariants} className="flex gap-4 flex-wrap">
            <button onClick={scrollToProjects} className="btn-primary cursor-none">
              View Projects
            </button>
            <a
              href="https://github.com/Athul-Titus"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline cursor-none inline-flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* ─── 3D Canvas (Desktop) / Gradient Orb (Mobile) ─── */}
        <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
          {/* Desktop: 3D Robot */}
          <div className="hidden lg:block w-full h-full absolute inset-0">
              <RobotCanvas />
          </div>

          {/* Mobile: Gradient Orb */}
          <div className="lg:hidden">
            <div className="gradient-orb" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-text-secondary/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
}
