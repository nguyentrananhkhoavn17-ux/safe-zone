export async function fetchHazards() {
  try {
    const res = await fetch('/api/v1/hazards')
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error('fetchHazards error', e)
    return null
  }
}
