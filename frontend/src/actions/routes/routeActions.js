import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";
import { formatDate } from "../shared/formatters";

// Utak lekérése
export async function getRoutes() {
  const carId = localStorage.getItem("selected_car_id");
  const url = carId ? apiUrl(`/routes/?car_id=${carId}`) : apiUrl("/routes/");

  const response = await fetch(url, {
    headers: { Authorization: authHeaders().Authorization },
  });

  const data = await parseJsonSafe(response);
  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérni az utakat.");
  }

  const items = data.routes ?? [];

  return items.map((route) => ({
    id: route.route_usage_id,
    honnan: route.from_city || "-",
    hova: route.to_city || "-",
    datum: formatDate(route.date),
    kezdes: route.departure_time_hhmm || "-",
    vege: route.arrival_time_hhmm || "-",
    javitas: 0,
    tavolsag: Number(route.distance_km || 0),
    tankolas_szam: Number(route.fuelings_count || 0),
    koltseg: Math.round(Number(route.fuelings_spent || 0)),
  }));
}
