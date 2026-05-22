export const navLinks = [
  { id: 'hero', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'projects', title: 'Projects' },
  { id: 'skills', title: 'Skills' },
  { id: 'contact', title: 'Contact' },
];

export const projects = [
  {
    title: 'Talent Search (Cymonic)',
    description:
      'AI-powered talent discovery platform that connects recruiters with candidates using intelligent matching algorithms.',
    tags: ['React', 'Node.js', 'AI', 'Full Stack'],
    github: 'https://github.com/Athul-Titus/Talent-Search',
    featured: true,
  },
  {
    title: 'QSafe (BB84 QKD)',
    description:
      'End-to-end BB84 Quantum Key Distribution simulator with Recursive BB84, Cascade error reconciliation, and smart abort classification. Built with Qiskit, Flask, and React for secure P2P messaging using dynamically generated quantum keys.',
    tags: ['Qiskit', 'Flask', 'React', 'Quantum Computing', 'Python'],
    github: 'https://github.com/Athul-Titus/bb84_new',
    featured: true,
  },
  {
    title: 'Fixmate Web',
    description:
      'A web platform connecting users with local repair and maintenance service providers — your go-to fix for home services.',
    tags: ['React', 'Web App', 'Service Platform'],
    github: 'https://github.com/Athul-Titus/Fixmate-Web',
    featured: true,
  },
  {
    title: 'Microplastic Detection',
    description:
      'Research project for detecting and analyzing microplastic presence using data science and image processing.',
    tags: ['Python', 'Data Science', 'Research'],
    github: 'https://github.com/Athul-Titus/microplastic_project',
    featured: false,
  },
  {
    title: 'DBMS Project',
    description:
      'A database management system project demonstrating relational schema design, SQL queries, and backend integration.',
    tags: ['SQL', 'DBMS', 'Backend'],
    github: 'https://github.com/Athul-Titus/DBMS_project',
    featured: false,
  },
  {
    title: 'Vajra 2.0',
    description:
      'An upgraded version of the Vajra system — a robust application built for performance and reliability.',
    tags: ['Full Stack', 'System Design'],
    github: 'https://github.com/Athul-Titus/Vajra2.0',
    featured: false,
  },
];

export const skills = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Flask', color: '#FFFFFF' },
  { name: 'Qiskit', color: '#6929C4' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Three.js', color: '#FFFFFF' },
  { name: 'Git', color: '#F05032' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'ESP32', color: '#E7352C' },
];

export const stats = [
  { label: 'Projects Built', value: 6, suffix: '+' },
  { label: 'IEEE Publication', value: 1, suffix: ' (In Progress)' },
  { label: 'Team Members Led', value: 40, suffix: '+' },
  { label: 'Years of Experience', value: 3, suffix: '' },
];

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/Athul-Titus',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: '#', // TODO: Add your LinkedIn URL
    icon: 'linkedin',
  },
  {
    name: 'Email',
    url: 'mailto:hello@athultitus.com', // TODO: Replace with your email
    icon: 'email',
  },
];
