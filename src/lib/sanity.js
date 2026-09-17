import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// projectId is public (not a secret); default it so a production build never
// crashes on a missing env var. Override via VITE_SANITY_* when needed.
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '0bxjr1em',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function imageUrl(source, width = 800) {
  if (!source) return ''
  if (typeof source === 'string') return source // fixture URL string
  return builder.image(source).width(width).url() // Sanity image ref
}
