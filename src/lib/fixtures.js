// Dev-only fallback content (used by useContent when Sanity is empty in dev).
// Images are referenced by absolute URL from /public; imageUrl() passes strings through.
const reactIcon = '/images/react.png'
const nodeIcon = '/images/node.png'
const jsIcon = '/images/javascript.png'
const cssIcon = '/images/css.png'
const htmlIcon = '/images/html.png'
const sassIcon = '/images/sass.png'
const reduxIcon = '/images/redux.png'
const gitIcon = '/images/git.png'

const faceSculptingBar = '/images/projects/face-sculpting-bar.png'
const spaceAssault = '/images/projects/space-assault.png'
const hangman3d = '/images/projects/hangman-3d.png'
const ragingSea = '/images/projects/raging-sea.png'

export const profileFixture = {
  name: 'Christian Bermeo',
  title: 'Software Developer',
  tagline: 'I build fast, accessible web apps — front to back.',
  bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.',
  email: 'hello@cbermeo.com',
  resumeUrl: '',
  socials: [
    { platform: 'github', url: 'https://github.com/christiancabp' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/' },
  ],
}

export const aboutsFixture = [
  { title: 'Front-end', description: 'React, component systems, and accessible, responsive UI.' },
  { title: 'Back-end', description: 'Node APIs, data modeling, and integrations.' },
  { title: 'Craft', description: 'Performance, testing, and clean, maintainable code.' },
]

export const experiencesFixture = [
  {
    role: 'Software Developer', company: 'PCI', companyUrl: 'https://www.pci.us',
    location: 'Remote', startDate: '2023-03-01', endDate: null, current: true,
    highlights: [
      'Built and shipped React features used across internal tools.',
      'Improved page performance and accessibility across the app.',
    ],
    logo: null,
  },
  {
    role: 'Junior Developer', company: 'Freelance', companyUrl: '',
    location: 'Remote', startDate: '2021-06-01', endDate: '2023-02-01', current: false,
    highlights: ['Delivered client web apps end-to-end (React + Node).'],
    logo: null,
  },
]

export const projectsFixture = [
  {
    title: 'Face Sculpting Bar',
    description: 'Freelance production website for a facial-sculpting & skincare studio — branding, services, and booking.',
    image: faceSculptingBar,
    projectLink: 'https://facesculptingbar.com',
    codeLink: '',
    tags: ['Next.js', 'Tailwind', 'Freelance'],
  },
  {
    title: 'Space Assault',
    description: 'A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.',
    image: spaceAssault,
    projectLink: 'https://space-assault.vercel.app',
    codeLink: 'https://github.com/christiancabp/space-assault',
    tags: ['Three.js', 'React', 'WebGL'],
  },
  {
    title: 'Hangman 3D',
    description: 'A playful 3D take on the classic Hangman word game.',
    image: hangman3d,
    projectLink: 'https://hangman-3d.vercel.app',
    codeLink: 'https://github.com/christiancabp/Hangman-3D',
    tags: ['Three.js', 'Game'],
  },
  {
    title: 'Raging Sea',
    description: 'A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.',
    image: ragingSea,
    projectLink: 'https://raging-sea-snowy.vercel.app',
    codeLink: 'https://github.com/christiancabp/RagingSea-threeJS',
    tags: ['Three.js', 'GLSL', 'Shaders'],
  },
  {
    title: 'C.H.A.R.L.I.',
    description: 'A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW.',
    image: null,
    projectLink: '',
    codeLink: 'https://github.com/christiancabp/CHARLI',
    tags: ['Python', 'AI'],
  },
]

export const skillsFixture = [
  { name: 'React', category: 'Frontend', icon: reactIcon },
  { name: 'JavaScript', category: 'Frontend', icon: jsIcon },
  { name: 'HTML', category: 'Frontend', icon: htmlIcon },
  { name: 'CSS', category: 'Frontend', icon: cssIcon },
  { name: 'Sass', category: 'Frontend', icon: sassIcon },
  { name: 'Redux', category: 'Frontend', icon: reduxIcon },
  { name: 'Node.js', category: 'Backend', icon: nodeIcon },
  { name: 'Git', category: 'Tools', icon: gitIcon },
]

export const educationFixture = [
  {
    school: 'University', degree: 'B.S.', field: 'Computer Science', location: '',
    startDate: '2017-09-01', endDate: '2021-05-01',
    description: 'Focus on software engineering and web development.', logo: null,
  },
]
