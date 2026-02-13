function formatDate(iso) {
  if (!iso) return "-"

  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) return "-"

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${y}. ${m}. ${day}.`
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/"
    throw new Error("Lejárt a belépés. Jelentkezz be újra.")
  }
}

export async function getRoutes() {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")
  const url = carId
    ? `http://localhost:8000/api/routes/?car_id=${carId}`
    : "http://localhost:8000/api/routes/"

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérni az utakat")
  }

  const items = data.routes ?? []
  return items.map((r) => ({
    id: r.route_usage_id,
    honnan: r.from_city || "-",
    hova: r.to_city || "-",
    datum: formatDate(r.date),
    kezdes: r.departure_time_hhmm || "-",
    vege: r.arrival_time_hhmm || "-",
    javitas: 0,
    tavolsag: Number(r.distance_km || 0),
    tankolas_szam: Number(r.fuelings_count || 0),
    koltseg: Math.round(Number(r.fuelings_spent || 0)),
  }))
}