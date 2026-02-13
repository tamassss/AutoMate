function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear()
    window.location.href = "/"
    throw new Error("Lejárt a belépés. Jelentkezz be újra.")
  }
}

function formatDate(iso) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}. ${m}. ${day}.`
}

export async function getServiceLog() {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")
  const url = carId
    ? `http://localhost:8000/api/service-log/?car_id=${carId}`
    : "http://localhost:8000/api/service-log/"

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await response.json().catch(() => ({}))
  handleUnauthorized(response)
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a szerviznaplót.")
  }

  const rows = data.service_log ?? []
  return rows.map((item) => ({
    id: item.maintenance_id,
    alkatresz: item.part_name || "-",
    ido: formatDate(item.date),
    ar: item.cost != null ? `${Math.round(Number(item.cost))} Ft` : "-",
    emlekeztetoDatum: item.reminder && String(item.reminder).includes("|")
      ? String(item.reminder).split("|")[0].trim()
      : (item.reminder || "-"),
    emlekeztetoKm: item.reminder && String(item.reminder).includes("|")
      ? String(item.reminder).split("|")[1].trim()
      : "",
  }))
}

export async function createServiceLogEntry({
  partName,
  date,
  cost,
  reminderDate,
  reminderKm,
  serviceCenterName,
}) {
  const token = localStorage.getItem("token")
  const carId = localStorage.getItem("selected_car_id")
  if (!carId) throw new Error("Nincs kiválasztott autó.")

  const responseCenter = await fetch("http://localhost:8000/api/service-centers/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: serviceCenterName || "AutoMate Szerviz",
    }),
  })

  const centerData = await responseCenter.json().catch(() => ({}))
  handleUnauthorized(responseCenter)
  if (!responseCenter.ok) {
    throw new Error(centerData.detail || "Nem sikerült létrehozni a szervizt.")
  }

  let reminder = null
  if (reminderDate && reminderKm) reminder = `${reminderDate} | ${reminderKm} km`
  else if (reminderDate) reminder = reminderDate
  else if (reminderKm) reminder = `${reminderKm} km`

  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`

  const responseMaintenance = await fetch("http://localhost:8000/api/maintenance/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      car_id: Number(carId),
      service_center_id: centerData.service_center_id,
      date: dateIso,
      part_name: partName || null,
      cost: cost !== "" && cost != null ? Number(cost) : null,
      reminder,
    }),
  })

  const maintenanceData = await responseMaintenance.json().catch(() => ({}))
  handleUnauthorized(responseMaintenance)
  if (!responseMaintenance.ok) {
    throw new Error(maintenanceData.detail || "Nem sikerült menteni a szervizt.")
  }

  return maintenanceData
}
