import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";
import { formatDate } from "../shared/formatters";

// Kötelező (backend miatt)
async function createServiceCenter(serviceCenterName) {
  const response = await fetch(apiUrl("/service-centers/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: serviceCenterName || "AutoMate Szerviz",
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült létrehozni a szervizt.");
  }

  return data.service_center_id;
}

// Szerviznapló lekérése
export async function getServiceLog() {
  const carId = localStorage.getItem("selected_car_id");
  const url = carId ? apiUrl(`/service-log/?car_id=${carId}`) : apiUrl("/service-log/");

  const response = await fetch(url, {
    headers: { Authorization: authHeaders().Authorization },
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a szerviznaplót.");
  }

  const rows = data.service_log ?? [];

  return rows.map((item) => ({
    id: item.maintenance_id,
    alkatresz: item.part_name || "-",
    ido: formatDate(item.date),
    ar: item.cost != null ? `${Math.round(Number(item.cost))} Ft` : "-",
    emlekeztetoDatum:
      item.reminder && String(item.reminder).includes("|")
        ? String(item.reminder).split("|")[0].trim()
        : item.reminder || "-",
    emlekeztetoKm:
      item.reminder && String(item.reminder).includes("|")
        ? String(item.reminder).split("|")[1].trim()
        : "",
  }));
}

// Új szerviz
export async function createServiceLogEntry({
  partName,
  date,
  cost,
  reminderDate,
  reminderKm,
  serviceCenterName,
}) {
  const carId = localStorage.getItem("selected_car_id");
  if (!carId) throw new Error("Nincs kiválasztott autó.");

  const serviceCenterId = await createServiceCenter(serviceCenterName);

  let reminder = null;
  if (reminderDate && reminderKm) reminder = `${reminderDate} | ${reminderKm} km`;
  else if (reminderDate) reminder = reminderDate;
  else if (reminderKm) reminder = `${reminderKm} km`;

  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`;

  const response = await fetch(apiUrl("/maintenance/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      service_center_id: serviceCenterId,
      date: dateIso,
      part_name: partName || null,
      cost: cost !== "" && cost != null ? Number(cost) : null,
      reminder,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült menteni a szervizt.");
  }

  return data;
}

// Új esemény
export async function createEvent({ partName, date, reminder }) {
  const carId = localStorage.getItem("selected_car_id");
  if (!carId) throw new Error("Nincs kiválasztott autó.");

  const serviceCenterId = await createServiceCenter("AutoMate");
  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`;

  const response = await fetch(apiUrl("/maintenance/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      service_center_id: serviceCenterId,
      date: dateIso,
      part_name: partName || null,
      reminder: reminder || null,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült létrehozni az eseményt.");
  }

  return data;
}
