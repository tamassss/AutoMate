function formatDate(iso) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}. ${m}. ${day}.`
}

function buildAddress(gs) {
  if (!gs) return "-"
  const parts = [gs.street, gs.house_number].filter(Boolean)
  if (parts.length > 0) return parts.join(" ")
  return gs.name || "-"
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/"
    throw new Error("Lejárt a belépés. Jelentkezz be újra.")
  }
}

export async function getGasStations() {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")
  const url = carId
    ? `http://localhost:8000/api/gas-stations/?car_id=${carId}`
    : "http://localhost:8000/api/gas-stations/"

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a benzinkutakat")
  }

  const items = data.gas_station_cards ?? []
  return items.map((item) => ({
    id: item.fueling_id,
    datum: formatDate(item.date),
    helyseg: item.gas_station?.city || "-",
    cim: buildAddress(item.gas_station),
    literft: Number(item.price_per_liter || 0),
    fuelType: item.fuel_type || "-",
    gasStationId: item.gas_station?.gas_station_id || null,
  }))
}