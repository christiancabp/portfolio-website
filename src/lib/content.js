export function pickContent(data, fixture, isDev) {
  const empty = data == null || (Array.isArray(data) && data.length === 0)
  return empty && isDev ? fixture : data
}
