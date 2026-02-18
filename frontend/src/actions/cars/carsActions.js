import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";
import { hasValue } from "../shared/valueChecks";

// Autók lekérése
export async function getCars() {
  const response = await fetch(apiUrl("/cars/"), {
    headers: { Authorization: authHeaders().Authorization },
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) return [];

  return data.cars ?? [];
}

// Új autó létrehozása
export async function createCar(carData) {
  const payload = {
    license_plate: carData.license_plate,
    brand: carData.brand,
    model: carData.model,
  };

  if (hasValue(carData.odometer_km)) {
    payload.odometer_km = Number(carData.odometer_km);
  }

  if (hasValue(carData.average_consumption)) {
    payload.average_consumption = Number(carData.average_consumption);
  }

  const response = await fetch(apiUrl("/cars/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült létrehozni az autót.");
  }

  return data;
}

// Autó módosítása
export async function editCar(carId, carData) {
  const payload = {};

  if (carData.license_plate !== undefined) payload.license_plate = carData.license_plate;
  if (carData.brand !== undefined) payload.brand = carData.brand;
  if (carData.model !== undefined) payload.model = carData.model;

  if (hasValue(carData.odometer_km)) {
    payload.odometer_km = Number(carData.odometer_km);
  } else if (!hasValue(carData.odometer_km)) {
    payload.odometer_km = null;
  }

  if (hasValue(carData.average_consumption)) {
    payload.average_consumption = Number(carData.average_consumption);
  } else if (!hasValue(carData.average_consumption)) {
    payload.average_consumption = null;
  }

  const response = await fetch(apiUrl(`/cars/${carId}/`), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült módosítani az autót.");
  }

  return data;
}

// Kiválasztott autó mentése
export function returnSelectedCard(carId) {
  localStorage.setItem("selected_car_id", String(carId));
  return carId;
}
