// Seed content into Sanity. Idempotent (deterministic _ids + createOrReplace).
// Mirrors ../../seed.md. Run from backend_sanity/:
//   npx sanity exec scripts/seed.js --with-user-token
import {getCliClient} from 'sanity/cli'
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'

const client = getCliClient({apiVersion: '2024-01-01'})
const pub = resolve(process.cwd(), '../public')

async function img(file) {
  const asset = await client.assets.upload('image', createReadStream(resolve(pub, file)), {filename: file})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  console.log('Uploading images…')
  const [react, js, html, css, sass, redux, node, git, faceSculpting, spaceAssault, hangman, ragingSea] =
    await Promise.all([
      img('images/react.png'), img('images/javascript.png'), img('images/html.png'), img('images/css.png'),
      img('images/sass.png'), img('images/redux.png'), img('images/node.png'), img('images/git.png'),
      img('images/projects/face-sculpting-bar.png'), img('images/projects/space-assault.png'),
      img('images/projects/hangman-3d.png'), img('images/projects/raging-sea.png'),
    ])

  // Remove stale placeholder projects from the first seed pass.
  console.log('Deleting stale placeholder projects…')
  await client.delete({query: `*[_type == "work" && _id in ["work-portfolio", "work-api", "work-dashboard"]]`})

  const docs = [
    {
      _id: 'profile', _type: 'profile',
      name: 'Christian Bermeo', title: 'Software Developer',
      tagline: 'I build fast, accessible web apps — front to back.',
      bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.',
      email: 'hello@cbermeo.com',
      // no avatar
      socials: [
        {_key: 'gh', platform: 'github', url: 'https://github.com/christiancabp'},
        {_key: 'li', platform: 'linkedin', url: 'https://www.linkedin.com/'},
      ],
    },

    // Experience (placeholder — edit in Studio / seed.md)
    {_id: 'exp-pci', _type: 'experience', role: 'Software Developer', company: 'PCI', companyUrl: 'https://www.pci.us', location: 'Remote', startDate: '2023-03-01', current: true, highlights: ['Built and shipped React features used across internal tools.', 'Improved performance and accessibility across the app.']},
    {_id: 'exp-freelance', _type: 'experience', role: 'Junior Developer', company: 'Freelance', location: 'Remote', startDate: '2021-06-01', endDate: '2023-02-01', current: false, highlights: ['Delivered client web apps end-to-end (React + Node).']},

    // Education (placeholder — edit in Studio / seed.md)
    {_id: 'edu-cs', _type: 'education', school: 'University', degree: 'B.S.', field: 'Computer Science', startDate: '2017-09-01', endDate: '2021-05-01', description: 'Focus on software engineering and web development.'},

    // Projects
    {_id: 'work-face-sculpting-bar', _type: 'work', title: 'Face Sculpting Bar', description: 'Freelance production website for a facial-sculpting & skincare studio — branding, services, and booking.', image: faceSculpting, projectLink: 'https://facesculptingbar.com', tags: ['Next.js', 'Tailwind', 'Freelance']},
    {_id: 'work-space-assault', _type: 'work', title: 'Space Assault', description: 'A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.', image: spaceAssault, projectLink: 'https://space-assault.vercel.app', codeLink: 'https://github.com/christiancabp/space-assault', tags: ['Three.js', 'React', 'WebGL']},
    {_id: 'work-hangman-3d', _type: 'work', title: 'Hangman 3D', description: 'A playful 3D take on the classic Hangman word game.', image: hangman, projectLink: 'https://hangman-3d.vercel.app', codeLink: 'https://github.com/christiancabp/Hangman-3D', tags: ['Three.js', 'Game']},
    {_id: 'work-raging-sea', _type: 'work', title: 'Raging Sea', description: 'A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.', image: ragingSea, projectLink: 'https://raging-sea-snowy.vercel.app', codeLink: 'https://github.com/christiancabp/RagingSea-threeJS', tags: ['Three.js', 'GLSL', 'Shaders']},
    {_id: 'work-charli', _type: 'work', title: 'C.H.A.R.L.I.', description: 'A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW.', codeLink: 'https://github.com/christiancabp/CHARLI', tags: ['Python', 'AI']},

    // Skills
    {_id: 'skill-react', _type: 'skill', name: 'React', category: 'Frontend', icon: react},
    {_id: 'skill-js', _type: 'skill', name: 'JavaScript', category: 'Frontend', icon: js},
    {_id: 'skill-html', _type: 'skill', name: 'HTML', category: 'Frontend', icon: html},
    {_id: 'skill-css', _type: 'skill', name: 'CSS', category: 'Frontend', icon: css},
    {_id: 'skill-sass', _type: 'skill', name: 'Sass', category: 'Frontend', icon: sass},
    {_id: 'skill-redux', _type: 'skill', name: 'Redux', category: 'Frontend', icon: redux},
    {_id: 'skill-node', _type: 'skill', name: 'Node.js', category: 'Backend', icon: node},
    {_id: 'skill-git', _type: 'skill', name: 'Git', category: 'Tools', icon: git},

    // About (text-only)
    {_id: 'about-frontend', _type: 'about', title: 'Front-end', description: 'React, component systems, and accessible, responsive UI.'},
    {_id: 'about-backend', _type: 'about', title: 'Back-end', description: 'Node APIs, data modeling, and integrations.'},
    {_id: 'about-craft', _type: 'about', title: 'Craft', description: 'Performance, testing, and clean, maintainable code.'},
  ]

  console.log(`Writing ${docs.length} documents…`)
  const tx = client.transaction()
  docs.forEach((d) => tx.createOrReplace(d))
  await tx.commit()
  console.log(`✅ Seeded ${docs.length} documents into "${client.config().dataset}"`)
}

run().then(() => process.exit(0)).catch((e) => {
  console.error(e)
  process.exit(1)
})
