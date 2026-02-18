import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";
import { hhmmToMinutes } from "../shared/formatters";
import { hasValue } from "../shared/valueChecks";

// Cím létrehozása
async function createAddress(cityText) {
  const response = await fetch(apiUrl("/addresses/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ city: cityText }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Cím létrehozása sikertelen.");
  }

  return data.address_id;
}

// Új út
async function createRoute(fromAddressId, toAddressId) {
  const response = await fetch(apiUrl("/routes/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      from_address_id: fromAddressId,
      to_address_id: toAddressId,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Útvonal létrehozása sikertelen.");
  }

  return data.route_id;
}

// Út mentése
async function createRouteUsage(carId, routeId, tripData) {
  const response = await fetch(apiUrl("/route-usage/create/"), {
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
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Úthasználat mentése sikertelen.");
  }

  return data.route_usage_id;
}

// Új benzinkút
async function createGasStation(fueling) {
  const response = await fetch(apiUrl("/gas-stations/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: fueling?.stationName || null,
      city: fueling?.stationCity || null,
      street: fueling?.stationAddress || null,
    }),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Benzinkút mentése sikertelen.");
  }

  return data.gas_station_id;
}

// Új tankolás
async function createFueling(carId, gasStationId, fueling) {
  const fuelTypeId = fueling?.fuelTypeId ? Number(fueling.fuelTypeId) : null;

  let odometer = fueling?.odometerKm;
  if (!hasValue(odometer)) {
    odometer = 0;
  }

  const payload = {
    car_id: Number(carId),
    gas_station_id: Number(gasStationId),
    date: fueling?.date || new Date().toISOString(),
    liters: Number(fueling?.liters),
    price_per_liter: Number(fueling?.pricePerLiter),
    supplier: fueling?.supplier || null,
    odometer_km: Number(odometer),
  };

  if (fuelTypeId) {
    payload.fuel_type_id = fuelTypeId;
  }

  const response = await fetch(apiUrl("/fuelings/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Tankolás mentése sikertelen.");
  }

  return data.fueling_id;
}

// Út mentése tankolásokkal
export async function saveTripWithFuelings(tripData) {
  const carId = localStorage.getItem("selected_car_id");
  if (!carId) throw new Error("Nincs kiválasztott autó.");

  const fromAddressId = await createAddress(tripData?.from || "Ismeretlen");
  const toAddressId = await createAddress(tripData?.to || "Ismeretlen");
  const routeId = await createRoute(fromAddressId, toAddressId);

  await createRouteUsage(carId, routeId, tripData);

  const fuelings = tripData?.fuelings || [];
  for (const fueling of fuelings) {
    const gasStationId = await createGasStation(fueling);
    await createFueling(carId, gasStationId, fueling);
  }

  return { ok: true };
}

// Tankolás + benzinkút mentése
export async function saveFuelingWithGasStation(fuelData) {
  const carId = localStorage.getItem("selected_car_id");
  if (!carId) throw new Error("Nincs kiválasztott autó.");

  const gasStationId = await createGasStation(fuelData || {});
  await createFueling(carId, gasStationId, fuelData || {});

  return { ok: true };
}




