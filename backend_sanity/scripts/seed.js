// Seed placeholder content into Sanity. Idempotent (deterministic _ids + createOrReplace).
// Run from backend_sanity/:  npx sanity exec scripts/seed.js --with-user-token
import {getCliClient} from 'sanity/cli'
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'

const client = getCliClient({apiVersion: '2024-01-01'})
const imgDir = resolve(process.cwd(), '../public/images')

async function img(file) {
  const asset = await client.assets.upload('image', createReadStream(resolve(imgDir, file)), {filename: file})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  console.log('Uploading images…')
  const [avatar, a1, a2, a3, react, js, html, css, sass, redux, node, git] = await Promise.all([
    img('profile.png'), img('about01.png'), img('about02.png'), img('about03.png'),
    img('react.png'), img('javascript.png'), img('html.png'), img('css.png'),
    img('sass.png'), img('redux.png'), img('node.png'), img('git.png'),
  ])

  const docs = [
    {
      _id: 'profile', _type: 'profile',
      name: 'Christian Bermeo', title: 'Software Developer',
      tagline: 'I build fast, accessible web apps — front to back.',
      bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.',
      email: 'hello@cbermeo.com', avatar,
      socials: [
        {_key: 'gh', platform: 'github', url: 'https://github.com/christiancabp'},
        {_key: 'li', platform: 'linkedin', url: 'https://www.linkedin.com/'},
      ],
    },
    {_id: 'exp-pci', _type: 'experience', role: 'Software Developer', company: 'PCI', companyUrl: 'https://www.pci.us', location: 'Remote', startDate: '2023-03-01', current: true, highlights: ['Built and shipped React features used across internal tools.', 'Improved performance and accessibility across the app.']},
    {_id: 'exp-freelance', _type: 'experience', role: 'Freelance Developer', company: 'Self-employed', location: 'Remote', startDate: '2021-06-01', endDate: '2023-02-01', current: false, highlights: ['Delivered client web apps end-to-end (React + Node).']},
    {_id: 'edu-cs', _type: 'education', school: 'University', degree: 'B.S.', field: 'Computer Science', startDate: '2017-09-01', endDate: '2021-05-01', description: 'Focus on software engineering and web development.'},
    {_id: 'work-portfolio', _type: 'work', title: 'Portfolio Website', description: 'This site — React, Vite, Tailwind, and Sanity.', image: a1, projectLink: 'https://cbermeo.com', codeLink: 'https://github.com/christiancabp/portfolio-website', tags: ['React', 'Vite', 'Tailwind', 'Sanity']},
    {_id: 'work-api', _type: 'work', title: 'API Service', description: 'A Node/Express service with a typed data layer.', image: a2, tags: ['Node', 'Express', 'PostgreSQL']},
    {_id: 'work-dashboard', _type: 'work', title: 'React Dashboard', description: 'A responsive, data-rich dashboard UI.', image: a3, tags: ['React', 'Redux']},
    {_id: 'skill-react', _type: 'skill', name: 'React', category: 'Frontend', icon: react},
    {_id: 'skill-js', _type: 'skill', name: 'JavaScript', category: 'Frontend', icon: js},
    {_id: 'skill-html', _type: 'skill', name: 'HTML', category: 'Frontend', icon: html},
    {_id: 'skill-css', _type: 'skill', name: 'CSS', category: 'Frontend', icon: css},
    {_id: 'skill-sass', _type: 'skill', name: 'Sass', category: 'Frontend', icon: sass},
    {_id: 'skill-redux', _type: 'skill', name: 'Redux', category: 'Frontend', icon: redux},
    {_id: 'skill-node', _type: 'skill', name: 'Node.js', category: 'Backend', icon: node},
    {_id: 'skill-git', _type: 'skill', name: 'Git', category: 'Tools', icon: git},
    {_id: 'about-frontend', _type: 'about', title: 'Front-end', description: 'React, component systems, and accessible, responsive UI.', image: a1},
    {_id: 'about-backend', _type: 'about', title: 'Back-end', description: 'Node APIs, data modeling, and integrations.', image: a2},
    {_id: 'about-craft', _type: 'about', title: 'Craft', description: 'Performance, testing, and clean, maintainable code.', image: a3},
  ]

  console.log(`Writing ${docs.length} documents…`)
  const tx = client.transaction()
  docs.forEach((d) => tx.createOrReplace(d))
  await tx.commit()
  console.log(`✅ Seeded ${docs.length} documents + 12 images into "${client.config().dataset}"`)
}

run().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})
