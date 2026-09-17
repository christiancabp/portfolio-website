export function groupByCategory(skills) {
  return skills.reduce((acc, s) => {
    const key = s.category || 'Other'
    ;(acc[key] ||= []).push(s)
    return acc
  }, {})
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function label(iso) {
  const [y, m] = iso.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

export function formatDateRange(start, end, current) {
  const right = current || !end ? 'Present' : label(end)
  return `${label(start)} — ${right}`
}
