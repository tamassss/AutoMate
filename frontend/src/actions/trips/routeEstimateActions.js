import { hasValue } from "../shared/valueChecks";

// Útvonal becslés
export async function estimateRoute(fromText, toText, avgConsumption) {
  // Honnan
  const fromResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(fromText)}`
  );

  // Hová
  const toResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(toText)}`
  );

  const [from] = await fromResponse.json();
  const [to] = await toResponse.json();

  if (!from || !to) {
    throw new Error("Nem található cím.");
  }

  // Számolás
  const routeResponse = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`
  );

  const routeData = await routeResponse.json();
  const route = routeData?.routes?.[0];

  if (!route) {
    throw new Error("Nem sikerült útvonalat számolni.");
  }

  const km = route.distance / 1000;
  const minutes = Math.round(route.duration / 60);

  const liters =
    hasValue(avgConsumption)
      ? (km * Number(avgConsumption)) / 100
      : null;

  return {
    km: Number(km.toFixed(1)),
    minutes,
    liters: liters === null ? null : Number(liters.toFixed(2)),
  };
}

