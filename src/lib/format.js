export function groupByCategory(skills) {
  return (skills || []).reduce((acc, s) => {
    if (!s) return acc
    const key = s.category || 'Other'
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function label(iso) {
  if (typeof iso !== 'string' || !iso.includes('-')) return ''
  const [y, m] = iso.split('-')
  const idx = Number(m) - 1
  return MONTHS[idx] ? `${MONTHS[idx]} ${y}` : y || ''
}

export function formatDateRange(start, end, current) {
  const left = label(start)
  let right = ''
  if (current) right = 'Present'
  else if (end) right = label(end)
  else if (left) right = 'Present' // has a start, no end → ongoing
  if (left && right) return `${left} — ${right}`
  return left || right || ''
}
