import { useEffect, useState } from 'react'
import { client } from '../lib/sanity'

export function useSanity(query, params = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    client
      .fetch(query, params)
      .then((res) => { if (active) { setData(res); setError(null) } })
      .catch((e) => { if (active) setError(e) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [query, JSON.stringify(params)])

  return { data, error, loading }
}
