import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

export function imageUrl(source, width = 800) {
  if (!source) return ''
  if (typeof source === 'string') return source // fixture URL string
  return builder.image(source).width(width).url() // Sanity image ref
}
