//dátum format
function formatDate(iso) {
  if (!iso) return "-"

  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) return "-"

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${y}. ${m}. ${day}.`
}

function formatMonth(monthKey) {
  if (!monthKey || !monthKey.includes("-")) return monthKey || "-"
  const [y, m] = monthKey.split("-")

  return `${y}. ${m}.`
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/"
    throw new Error("Lejárt a belépés. Jelentkezz be újra.")
  }
}

export async function getFuelings() {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")
  const url = carId
    ? `http://localhost:8000/api/fuelings/?car_id=${carId}`
    : "http://localhost:8000/api/fuelings/"

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérni a tankolásokat")
  }

  const groups = data.fuelings_by_month ?? []

  return groups.map((g) => ({
    month: formatMonth(g.month),
    items: (g.items || []).map((f) => ({
      id: f.fueling_id,
      datum: formatDate(f.date),
      mennyiseg: Number(f.liters || 0),
      literft: Number(f.price_per_liter || 0),
      kmallas: f.odometer_km ?? "-",
    })),
  }))
}