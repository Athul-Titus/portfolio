import { useEffect } from 'react';
import Tilt3D from './Tilt3D';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const skillGroups = [
  {
    category: 'Frontend Development',
    desc: 'Building responsive, interactive user interfaces and web experiences.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'Next.js', 'HTML & CSS'],
  },
  {
    category: 'Backend Architecture',
    desc: 'Developing robust APIs and scalable database architectures.',
    skills: ['Node.js', 'Flask', 'Python', 'PostgreSQL', 'REST APIs', 'SQL', 'Express.js'],
  },
  {
    category: 'AI & Quantum Computing',
    desc: 'Leveraging cutting-edge AI/ML and quantum technologies for real-world problems.',
    skills: ['Qiskit', 'scikit-learn', 'Streamlit', 'Data Science', 'Computer Vision', 'ML Models', 'BB84 QKD'],
  },
  {
    category: 'Tools & Platforms',
    desc: 'Efficient workflows with modern development tools and deployment platforms.',
    skills: ['Git', 'GitHub', 'Vercel', 'Flutter / Dart', 'ESP32 / IoT', 'Web3 / Blockchain', 'Figma'],
  },
];

export default function Skills() {
  useReveal();

  return (
    <section id="skills" className="skills-section light-section dot-grid">
      {/* Header */}
      <div className="skills-header">
        <div className="reveal-left">
          <span className="section-pill">TECHNICAL STACK</span>
          <h2 className="section-title">
            Tools of the <span className="accent">Trade.</span>
          </h2>
        </div>
        <p className="section-desc reveal-right" style={{ marginTop: '1.5rem' }}>
          A curated selection of modern technologies and frameworks I use to build
          scalable, high-performance digital solutions.
        </p>
      </div>

      {/* Skill cards grid with 3D Physics */}
      <div className="skills-grid">
        {skillGroups.map((group, i) => (
          <Tilt3D
            key={group.category}
            maxTilt={7}
            scale={1.02}
            floatAngle={i % 2 === 0 ? -1 : 1}
            glowColor="rgba(230, 57, 70, 0.18)"
            className={`reveal reveal-delay-${i + 1}`}
          >
            <div className="skill-card">
              <h3 className="skill-card-title">{group.category}</h3>
              <p className="skill-card-desc">{group.desc}</p>
              <div className="skill-tags">
                {group.skills.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          </Tilt3D>
        ))}
      </div>
    </section>
  );
}
