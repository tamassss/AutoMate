export async function estimateRoute(fromText, toText, avgConsumption) {
  const g1 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fromText)}`)
  const g2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(toText)}`)
  const [a1] = await g1.json()
  const [a2] = await g2.json()

  if (!a1 || !a2) throw new Error("Nem található cím.")

  const routeRes = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${a1.lon},${a1.lat}${a2.lon},${a2.lat}?overview=false`
  )

  const routeData = await routeRes.json()
  const r = routeData?.routes?.[0]

  if (!r) throw new Error("Nem sikerült útvonalat számolni.")

  const km = r.distance / 1000
  const minutes = Math.round(r.duration / 60)
  const liters = avgConsumption ? (km * Number(avgConsumption)) / 100 : null

  return { km: Number(km.toFixed(1)), minutes, liters: liters == null ? null : Number(liters.toFixed(2)) }
}
