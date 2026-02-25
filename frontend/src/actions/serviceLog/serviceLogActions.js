import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";
import { formatDate, formatMoney } from "../shared/formatters";

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
  const serviceRows = rows.filter((item) => item?.service_center?.name !== "AutoMate");

  return serviceRows.map((item) => ({
    id: item.maintenance_id,
    alkatresz: item.part_name || "-",
    ido: formatDate(item.date),
    ar: item.cost != null ? formatMoney(item.cost) : "-",
    rawDate: item.date,
    rawCost: item.cost,
    rawReminder: item.reminder,
    serviceCenterId: item?.service_center?.service_center_id || null,
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

export async function updateServiceLogEntry(maintenanceId, { partName, date, cost, reminderDate, reminderKm }) {
  if (!maintenanceId) throw new Error("Hiányzik a szerviz azonosító.");

  let reminder = null;
  if (reminderDate && reminderKm) reminder = `${reminderDate} | ${reminderKm} km`;
  else if (reminderDate) reminder = reminderDate;
  else if (reminderKm) reminder = `${reminderKm} km`;

  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`;

  const response = await fetch(apiUrl(`/maintenance/${maintenanceId}/`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      part_name: partName || null,
      date: dateIso,
      cost: cost !== "" && cost != null ? Number(cost) : null,
      reminder,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült módosítani a szervizt.");
  }

  return data?.maintenance || null;
}

export async function deleteServiceLogEntry(maintenanceId) {
  if (!maintenanceId) throw new Error("Hiányzik a szerviz azonosító.");

  const response = await fetch(apiUrl(`/maintenance/${maintenanceId}/delete/`), {
    method: "DELETE",
    headers: { Authorization: authHeaders().Authorization },
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült törölni a szervizt.");
  }

  return true;
}

function normalizeReminderValue(reminder) {
  const reminderText = String(reminder ?? "").trim();
  if (!reminderText) return null;

  const onlyDigits = reminderText.split("").every((char) => char >= "0" && char <= "9");
  if (onlyDigits) return `${reminderText} km`;

  return reminderText;
}

export async function createEvent({ partName, date, reminder }) {
  const carId = localStorage.getItem("selected_car_id");
  if (!carId) throw new Error("Nincs kiválasztott autó.");

  const serviceCenterId = await createServiceCenter("AutoMate");
  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`;
  const reminderValue = normalizeReminderValue(reminder);

  const response = await fetch(apiUrl("/maintenance/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      service_center_id: serviceCenterId,
      date: dateIso,
      part_name: partName || null,
      reminder: reminderValue,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült létrehozni az eseményt.");
  }

  return data;
}

export async function getEvents() {
  const carId = localStorage.getItem("selected_car_id");
  const url = carId ? apiUrl(`/service-log/?car_id=${carId}`) : apiUrl("/service-log/");

  const response = await fetch(url, {
    headers: { Authorization: authHeaders().Authorization },
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni az eseményeket.");
  }

  const items = data?.service_log || [];
  const eventRows = items.filter(
    (item) => String(item?.service_center?.name || "").trim().toLowerCase() === "automate"
  );

  return eventRows.map((item) => ({
    id: item.maintenance_id,
    title: item.part_name || "Esemény",
    date: item.date,
    reminder: item.reminder || null,
  }));
}

export async function updateEvent(maintenanceId, { partName, date, reminder }) {
  if (!maintenanceId) throw new Error("Hiányzik az esemény azonosító.");

  const dateIso = date && date.includes("T") ? date : `${date}T00:00:00Z`;
  const reminderValue = normalizeReminderValue(reminder);

  const response = await fetch(apiUrl(`/maintenance/${maintenanceId}/`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      part_name: partName || null,
      date: dateIso,
      reminder: reminderValue,
      cost: null,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült módosítani az eseményt.");
  }

  return data?.maintenance || null;
}

export async function deleteEvent(maintenanceId) {
  return deleteServiceLogEntry(maintenanceId);
}