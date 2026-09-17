import { useSanity } from './useSanity'
import { pickContent } from '../lib/content'

export function useContent(query, fixture, params = {}) {
  const { data, loading, error } = useSanity(query, params)
  return { data: pickContent(data, fixture, import.meta.env.DEV), loading, error }
}
