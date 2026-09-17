// Fixture images live in /public/images and are referenced by absolute URL.
// imageUrl() passes string paths through unchanged, so these work in dev and prod.
const avatar = '/images/profile.png'
const reactIcon = '/images/react.png'
const nodeIcon = '/images/node.png'
const jsIcon = '/images/javascript.png'
const cssIcon = '/images/css.png'
const htmlIcon = '/images/html.png'
const sassIcon = '/images/sass.png'
const reduxIcon = '/images/redux.png'
const gitIcon = '/images/git.png'
const proj1 = '/images/about01.png'
const proj2 = '/images/about02.png'
const proj3 = '/images/about03.png'

export const profileFixture = {
  name: 'Christian Bermeo',
  title: 'Software Developer',
  tagline: 'I build fast, accessible web applications.',
  bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic back-ends.',
  email: 'hello@cbermeo.com',
  avatar,
  resumeUrl: '',
  socials: [
    { platform: 'github', url: 'https://github.com/christiancabp' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/' },
  ],
}

export const aboutsFixture = [
  { title: 'Front-end', description: 'React, component systems, and accessible, responsive UI.', image: proj1 },
  { title: 'Back-end', description: 'Node APIs, data modeling, and integrations.', image: proj2 },
  { title: 'Craft', description: 'Performance, testing, and clean, maintainable code.', image: proj3 },
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
  { title: 'Portfolio Site', description: 'This site — React, Vite, Tailwind, Sanity.', image: proj1, projectLink: 'https://christian-bermeo.netlify.app', codeLink: 'https://github.com/christiancabp/portfolio-website', tags: ['React JS', 'Three JS'] },
  { title: 'API Service', description: 'A Node/Express service with a typed data layer.', image: proj2, projectLink: '', codeLink: '', tags: ['APIs', 'PERN'] },
  { title: 'React App', description: 'A responsive React dashboard.', image: proj3, projectLink: '', codeLink: '', tags: ['React JS'] },
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
