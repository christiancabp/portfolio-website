import avatar from '../assets/profile.png'
import reactIcon from '../assets/react.png'
import nodeIcon from '../assets/node.png'
import jsIcon from '../assets/javascript.png'
import cssIcon from '../assets/css.png'
import htmlIcon from '../assets/html.png'
import sassIcon from '../assets/sass.png'
import reduxIcon from '../assets/redux.png'
import gitIcon from '../assets/git.png'
import proj1 from '../assets/about01.png'
import proj2 from '../assets/about02.png'
import proj3 from '../assets/about03.png'

export const profileFixture = {
  name: 'Christian Bermeo',
  title: 'Software Developer',
  tagline: 'I build fast, accessible web applications.',
  bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic back-ends.',
  email: 'christian.bermeo@pci.us',
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
