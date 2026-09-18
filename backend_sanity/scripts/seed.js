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

async function pdf(file, filename) {
  const asset = await client.assets.upload('file', createReadStream(resolve(pub, file)), {filename})
  return {_type: 'file', asset: {_type: 'reference', _ref: asset._id}}
}

const skill = (id, name, category) => ({_id: `skill-${id}`, _type: 'skill', name, category})

async function run() {
  console.log('Uploading project images…')
  const [faceSculpting, spaceAssault, hangman, ragingSea, charli] = await Promise.all([
    img('images/projects/face-sculpting-bar.png'),
    img('images/projects/space-assault.png'),
    img('images/projects/hangman-3d.png'),
    img('images/projects/raging-sea.png'),
    img('images/projects/charli.png'),
  ])

  console.log('Uploading resume…')
  const resumePdf = await pdf('resume/Christian Bermeo Resume 2026.pdf', 'christian-bermeo-resume.pdf')

  // Remove documents from earlier seed passes that are no longer in the model.
  console.log('Deleting stale documents…')
  await client.delete({
    query: `*[_id in ["work-portfolio","work-api","work-dashboard","exp-freelance","edu-cs","skill-sass","skill-redux","about-craft"]]`,
  })

  const docs = [
    {
      _id: 'profile', _type: 'profile',
      name: 'Christian Bermeo',
      title: 'Software Engineer / Creative Developer',
      tagline: 'I build fast, production-ready web and mobile apps — end to end.',
      bio: 'Full-stack developer focused on clean, performant React front-ends and pragmatic, well-tested back-ends. The details matter to me.',
      email: 'hello@cbermeo.com',
      resumePdf,
      socials: [
        {_key: 'gh', platform: 'github', url: 'https://github.com/christiancabp'},
        {_key: 'li', platform: 'linkedin', url: 'https://www.linkedin.com/in/christian-bermeo-679023185/'},
      ],
    },

    // Experience
    {_id: 'exp-pci', _type: 'experience', role: 'Software Developer', company: 'PCI', companyUrl: 'https://www.pci.us', location: 'Remote', startDate: '2022-09-01', current: true, highlights: ['Design and implement end-to-end features used by real production users of an ERP system.', 'Improved user experience and accessibility across the app.']},
    {_id: 'exp-army', _type: 'experience', role: 'Service Member', company: 'United States Army', location: 'Long Island, NY', startDate: '2020-12-01', endDate: '2021-08-01', current: false, highlights: ['Supported the New York Joint Task Force COVID-19 response at a vaccination pop-up clinic.', 'Provided operational support at the Jones Beach vaccination site and alternate care facility.']},

    // Education
    {_id: 'edu-njit', _type: 'education', school: 'New Jersey Institute of Technology (NJIT)', degree: 'B.S.', field: 'Computer Science', startDate: '2026-09-01', endDate: '2029-05-01', description: 'Focus on Artificial Intelligence & Robotics. Expected graduation May 2029.'},
    {_id: 'edu-lagcc', _type: 'education', school: 'LaGuardia Community College (LAGCC)', degree: 'A.S.', field: 'Computer Science', startDate: '2017-09-01', endDate: '2026-05-01', description: 'Focus on Computer Science.'},

    // Projects
    {_id: 'work-face-sculpting-bar', _type: 'work', title: 'Face Sculpting Bar', description: 'Freelance production website for a skincare studio — branding, SEO-optimized, services menu, and booking link.', image: faceSculpting, projectLink: 'https://facesculptingbar.com', tags: ['Next.js', 'TailwindCSS', 'TypeScript']},
    {_id: 'work-space-assault', _type: 'work', title: 'Space Assault', description: 'A 3D arcade shooter reimagining Space Invaders, rendered in the browser with WebGL.', image: spaceAssault, projectLink: 'https://space-assault.vercel.app', codeLink: 'https://github.com/christiancabp/space-assault', tags: ['Three.js', 'React', 'TypeScript', 'Shaders', 'Game']},
    {_id: 'work-hangman-3d', _type: 'work', title: 'Hangman 3D', description: 'A playful 3D take on the classic Hangman word game.', image: hangman, projectLink: 'https://hangman-3d.vercel.app', codeLink: 'https://github.com/christiancabp/Hangman-3D', tags: ['Three.js', 'React', 'TypeScript', 'Game']},
    {_id: 'work-raging-sea', _type: 'work', title: 'Raging Sea', description: 'A real-time animated ocean surface driven by custom GLSL vertex & fragment shaders.', image: ragingSea, projectLink: 'https://raging-sea-snowy.vercel.app', codeLink: 'https://github.com/christiancabp/RagingSea-threeJS', tags: ['Three.js', 'JavaScript', 'Shaders']},
    {_id: 'work-charli', _type: 'work', title: 'C.H.A.R.L.I.', description: 'A JARVIS-inspired personal AI assistant (voice + chat), built on top of OpenCLAW with Gemini as the brain.', image: charli, codeLink: 'https://github.com/christiancabp/CHARLI', tags: ['Python', 'OpenClaw', 'TypeScript']},

    // Skills (icons rendered from react-icons in the frontend — no image needed)
    skill('react', 'React', 'Frontend'),
    skill('nextjs', 'Next.js', 'Frontend'),
    skill('tailwind', 'TailwindCSS', 'Frontend'),
    skill('typescript', 'TypeScript', 'Frontend'),
    skill('js', 'JavaScript', 'Frontend'),
    skill('html', 'HTML', 'Frontend'),
    skill('css', 'CSS', 'Frontend'),
    skill('threejs', 'Three.js', 'Frontend'),
    skill('node', 'Node.js', 'Backend'),
    skill('python', 'Python', 'Backend'),
    skill('django', 'Django', 'Backend'),
    skill('sql', 'SQL', 'Backend'),
    skill('mongodb', 'MongoDB', 'Backend'),
    skill('postgresql', 'PostgreSQL', 'Backend'),
    skill('redis', 'Redis', 'Backend'),
    skill('aws', 'AWS', 'Backend'),
    skill('git', 'Git', 'Tools'),
    skill('docker', 'Docker', 'Tools'),
    skill('openclaw', 'OpenClaw', 'Tools'),
    skill('claude-code', 'Claude Code', 'Tools'),
    skill('devops', 'DevOps', 'Tools'),
    skill('cicd', 'CI/CD', 'Tools'),

    // About (text-only)
    {_id: 'about-frontend', _type: 'about', title: 'Front-end', description: 'React, Next.js, TailwindCSS, TypeScript, component systems, and accessible, responsive UI.'},
    {_id: 'about-backend', _type: 'about', title: 'Back-end', description: 'Node.js, Django, Python, SQL databases, caching, data modeling, and microservices.'},
    {_id: 'about-tools', _type: 'about', title: 'Tools', description: 'Git, Docker, OpenClaw, Claude Code, and AWS cloud services.'},
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
