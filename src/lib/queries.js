export const PROFILE = `*[_type == "profile"][0]`
export const ABOUTS = `*[_type == "about"]`
export const EXPERIENCES = `*[_type == "experience"] | order(startDate desc)`
export const PROJECTS = `*[_type == "work"] | order(_createdAt desc)`
export const SKILLS = `*[_type == "skill"]`
export const EDUCATION = `*[_type == "education"] | order(endDate desc)`
