// dashboard adatok
export async function getDashboard() {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")

  const url = carId
    ? `http://localhost:8000/api/dashboard/?car_id=${carId}`
    : "http://localhost:8000/api/dashboard/"

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear()
      window.location.href = "/"
      throw new Error("Lejárt a belépés. Jelentkezz be újra.")
    }
    throw new Error(data.detail || "Nem sikerült lekérni a dashboard adatokat")
  }

  return data
}

//TripCard jósolt idő
export async function estimateRoute(fromText, toText, avgConsumption) {
  const geoFrom = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fromText)}`
  )
  const geoTo = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(toText)}`
  )

  const [from] = await geoFrom.json()
  const [to] = await geoTo.json()

  if (!from || !to) {
    throw new Error("Nem talalható cím.")
  }

  const routeRes = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat}${to.lon},${to.lat}?overview=false`
  )
  const routeData = await routeRes.json()
  const route = routeData?.routes?.[0]

  if (!route) {
    throw new Error("Nem sikerült útvonalat számolni.")
  }

  const km = route.distance / 1000
  const minutes = Math.round(route.duration / 60)
  const liters =
    avgConsumption !== undefined &&
    avgConsumption !== null &&
    avgConsumption !== ""
      ? (km * Number(avgConsumption)) / 100
      : null

  return {
    km: Number(km.toFixed(1)),
    minutes,
    liters: liters === null ? null : Number(liters.toFixed(2)),
  }
}

function authHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

//Automatikus kiléptetés
function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/"
    throw new Error("Lejárt a belépés. Jelentkezz be újra.")
  }
}

//stopper -> perc
function hhmmToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string" || !hhmm.includes(":")) return null
  const [h, m] = hhmm.split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

//út mentéséhez cím
async function createAddress(cityText) {
  const response = await fetch("http://localhost:8000/api/addresses/create/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ city: cityText }),
  })
  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)

  if (!response.ok) throw new Error(data.detail || "Cím létrehozása sikertelen")

  return data.address_id
}

//új út
async function createRoute(fromAddressId, toAddressId) {
  const response = await fetch("http://localhost:8000/api/routes/create/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      from_address_id: fromAddressId,
      to_address_id: toAddressId,
    }),
  })
  const data = await response.json().catch(() => ({}))

  handleUnauthorized(response)

  if (!response.ok) throw new Error(data.detail || "Útvonal létrehozása sikertelen")

  return data.route_id
}

//út mentése
async function createRouteUsage(carId, routeId, tripData) {
  const response = await fetch("http://localhost:8000/api/route-usage/create/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      route_id: Number(routeId),
      date: new Date().toISOString(),
      departure_time: hhmmToMinutes(tripData?.startTime),
      arrival_time: hhmmToMinutes(tripData?.expectedArrival),
      distance_km: tripData?.distanceKm ?? null,
      title: tripData?.title || null,
    }),
  })
  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)
  if (!response.ok) throw new Error(data.detail || "Út használat mentése sikertelen")
  return data.route_usage_id
}

//benzinkút hozzáadása
async function createGasStation(fueling) {
  const response = await fetch("http://localhost:8000/api/gas-stations/create/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: fueling?.stationName || null,
      city: fueling?.stationCity || null,
      street: fueling?.stationAddress || null,
    }),
  })
  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)
  if (!response.ok) throw new Error(data.detail || "Benzinkút mentése sikertelen")
  return data.gas_station_id
}

//új tankolás
async function createFueling(carId, gasStationId, fueling) {
  const fuelTypeId = fueling?.fuelTypeId ? Number(fueling.fuelTypeId) : null

  let odometer = fueling?.odometerKm
  if (odometer === null || odometer === undefined || odometer === "") {
    const selectedKm = Number(localStorage.getItem("selected_car_odometer_km") || 0)
    odometer = selectedKm > 0 ? selectedKm : 1
  }

  const payload = {
    car_id: Number(carId),
    gas_station_id: Number(gasStationId),
    date: fueling?.date || new Date().toISOString(),
    liters: Number(fueling?.liters),
    price_per_liter: Number(fueling?.pricePerLiter),
    supplier: fueling?.supplier || null,
    odometer_km: Number(odometer),
  }

  if (fuelTypeId) {
    payload.fuel_type_id = fuelTypeId
  }

  const response = await fetch("http://localhost:8000/api/fuelings/create/", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)

  if (!response.ok) throw new Error(data.detail || "Tankolás mentése sikertelen")

  return data.fueling_id
}

//új tankolás út közben
export async function saveTripWithFuelings(tripData) {
  const carId = localStorage.getItem("selected_car_id")

  if (!carId) {
    throw new Error("Nincs kiválasztott autó.")
  }

  const fromAddressId = await createAddress(tripData?.from || "Ismeretlen")
  const toAddressId = await createAddress(tripData?.to || "Ismeretlen")
  const routeId = await createRoute(fromAddressId, toAddressId)

  await createRouteUsage(carId, routeId, tripData)

  const fuelings = tripData?.fuelings || []

  for (const fueling of fuelings) {
    const gasStationId = await createGasStation(fueling)
    await createFueling(carId, gasStationId, fueling)
  }

  return { ok: true }
}

//új tankolás + új benzinkút
export async function saveFuelingWithGasStation(fuelData) {
  const carId = localStorage.getItem("selected_car_id")

  if (!carId) {
    throw new Error("Nincs kiválasztott autó.")
  }

  const gasStationId = await createGasStation(fuelData || {})
  await createFueling(carId, gasStationId, fuelData || {})

  return { ok: true }
}

//getLimit
export function getStoredBudgetLimit() {
  const carId = localStorage.getItem("selected_car_id") || "default"
  const raw = localStorage.getItem(`budget_limit_${carId}`)
  const n = Number(raw)

  if (!raw || Number.isNaN(n) || n < 0) return null

  return n
}

//setLimit
export function setStoredBudgetLimit(limitValue) {
  const carId = localStorage.getItem("selected_car_id") || "default"
  const safe = Math.max(0, Number(limitValue) || 0)

  localStorage.setItem(`budget_limit_${carId}`, String(safe))

  return safe
}

///új esemény
export async function createEvent({ partName, date, reminder }) {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")

  if (!carId) throw new Error("Nincs kiválasztott autó.")

  const serviceCenterRes = await fetch("http://localhost:8000/api/service-centers/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "AutoMate" }),
  })

  const serviceCenterData = await serviceCenterRes.json().catch(() => ({}))
  handleUnauthorized(serviceCenterRes)
  if (!serviceCenterRes.ok) {
    throw new Error(serviceCenterData.detail || "Nem sikerült létrehozni a szerviz központot.")
  }

  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`

  const maintenanceRes = await fetch("http://localhost:8000/api/maintenance/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      car_id: Number(carId),
      service_center_id: serviceCenterData.service_center_id,
      date: dateIso,
      part_name: partName || null,
      reminder: reminder || null,
    }),
  })

  const maintenanceData = await maintenanceRes.json().catch(() => ({}))
  handleUnauthorized(maintenanceRes)

  if (!maintenanceRes.ok) {
    throw new Error(maintenanceData.detail || "Nem sikerült létrehozni az eseményt.")
  }

  return maintenanceData
}