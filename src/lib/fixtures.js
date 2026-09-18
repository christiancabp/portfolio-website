// Dev-only fallback content (used by useContent when Sanity is empty in dev).
// Project cards use screenshots in /public/images/projects; skill icons are
// rendered from react-icons in the Skills component (no image files needed).
const faceSculptingBar = '/images/projects/face-sculpting-bar.png'
const spaceAssault = '/images/projects/space-assault.png'
const hangman3d = '/images/projects/hangman-3d.png'
const ragingSea = '/images/projects/raging-sea.png'
const charli = '/images/projects/charli.png'

export const profileFixture = {
  name: 'Christian Bermeo',
  title: 'Software Engineer / Creative Developer',
  tagline: 'I build fast, production-ready web and mobile apps — end to end.',
  bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.',
  email: 'hello@cbermeo.com',
  resumeUrl: '',
  socials: [
    { platform: 'github', url: 'https://github.com/christiancabp' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/christian-bermeo-679023185/' },
  ],
}

export const aboutsFixture = [
  { title: 'Front-end', description: 'React, Next.js, TailwindCSS, TypeScript, component systems, and accessible, responsive UI.' },
  { title: 'Back-end', description: 'Node.js, Django, Python, SQL databases, caching, data modeling, and microservices.' },
  { title: 'Tools', description: 'Git, Docker, OpenClaw, Claude Code, and AWS cloud services.' },
]

export const experiencesFixture = [
  {
    role: 'Software Developer', company: 'PCI', companyUrl: 'https://www.pci.us',
    location: 'Remote', startDate: '2022-09-01', endDate: null, current: true,
    highlights: [
      'Design and implement end-to-end features used by real production users of an ERP system.',
      'Improved user experience and accessibility across the app.',
    ],
    logo: null,
  },
  {
    role: 'Service Member', company: 'United States Army', companyUrl: '',
    location: 'Long Island, NY', startDate: '2020-12-01', endDate: '2021-08-01', current: false,
    highlights: [
      'Supported the New York Joint Task Force COVID-19 response at a vaccination pop-up clinic.',
      'Provided operational support at the Jones Beach vaccination site and alternate care facility.',
    ],
    logo: null,
  },
]

export const projectsFixture = [
  {
    title: 'Face Sculpting Bar',
    description: 'Freelance production website for a skincare studio — branding, SEO-optimized, services menu, and booking link.',
    image: faceSculptingBar, projectLink: 'https://facesculptingbar.com', codeLink: '',
    tags: ['Next.js', 'TailwindCSS', 'TypeScript'],
  },
  {
    title: 'Space Assault',
    description: 'A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.',
    image: spaceAssault, projectLink: 'https://space-assault.vercel.app', codeLink: 'https://github.com/christiancabp/space-assault',
    tags: ['Three.js', 'React', 'TypeScript', 'Shaders', 'Game'],
  },
  {
    title: 'Hangman 3D',
    description: 'A playful 3D take on the classic Hangman word game.',
    image: hangman3d, projectLink: 'https://hangman-3d.vercel.app', codeLink: 'https://github.com/christiancabp/Hangman-3D',
    tags: ['Three.js', 'React', 'TypeScript', 'Game'],
  },
  {
    title: 'Raging Sea',
    description: 'A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.',
    image: ragingSea, projectLink: 'https://raging-sea-snowy.vercel.app', codeLink: 'https://github.com/christiancabp/RagingSea-threeJS',
    tags: ['Three.js', 'JavaScript', 'Shaders'],
  },
  {
    title: 'C.H.A.R.L.I.',
    description: 'A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW with Gemini as the brain.',
    image: charli, projectLink: '', codeLink: 'https://github.com/christiancabp/CHARLI',
    tags: ['Python', 'OpenClaw', 'TypeScript'],
  },
]

const skill = (name, category) => ({ name, category })
export const skillsFixture = [
  skill('React', 'Frontend'), skill('Next.js', 'Frontend'), skill('TailwindCSS', 'Frontend'), skill('TypeScript', 'Frontend'),
  skill('JavaScript', 'Frontend'), skill('HTML', 'Frontend'), skill('CSS', 'Frontend'), skill('Three.js', 'Frontend'),
  skill('Node.js', 'Backend'), skill('Python', 'Backend'), skill('Django', 'Backend'), skill('SQL', 'Backend'),
  skill('MongoDB', 'Backend'), skill('PostgreSQL', 'Backend'),
  skill('Git', 'Tools'), skill('Docker', 'Tools'), skill('OpenClaw', 'Tools'), skill('Claude Code', 'Tools'),
]

export const educationFixture = [
  {
    school: 'New Jersey Institute of Technology (NJIT)', degree: 'B.S.', field: 'Computer Science', location: '',
    startDate: '2026-09-01', endDate: '2029-05-01',
    description: 'Focus on Artificial Intelligence & Robotics. Expected graduation May 2029.', logo: null,
  },
  {
    school: 'LaGuardia Community College (LAGCC)', degree: 'A.S.', field: 'Computer Science', location: '',
    startDate: '2017-09-01', endDate: '2026-05-01',
    description: 'Focus on Computer Science.', logo: null,
  },
]
