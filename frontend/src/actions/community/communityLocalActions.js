import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "../shared/http";

export function getCurrentUserMeta() {
  return {
    userId: String(localStorage.getItem("user_id") || ""),
    fullName: String(localStorage.getItem("full_name") || "Felhasználó"),
    role: String(localStorage.getItem("role") || "user"),
  };
}

export async function isCommunityEnabledForCar(_userId, carId) {
  if (!carId) return false;
  const response = await fetch(apiUrl(`/community/settings/?car_id=${carId}`), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) return false;
  return !!data.enabled;
}

export async function setCommunityEnabledForCar(_userId, carId, enabled) {
  const response = await fetch(apiUrl("/community/settings/"), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ car_id: Number(carId), enabled: !!enabled }),
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült menteni a közösség állapotát.");
  }
  return !!data.enabled;
}

export async function upsertCommunityProfile() {
  return true;
}

export async function removeCommunityProfile(_userId, carId) {
  if (!carId) return;
  await setCommunityEnabledForCar(null, carId, false);
}

export async function getCommunityProfilesForList(_currentUserId, currentCarId) {
  if (!currentCarId) return [];
  const response = await fetch(apiUrl(`/community/profiles/?car_id=${currentCarId}`), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a közösségi profilokat.");
  }
  return data.profiles || [];
}

export async function getCommunityProfilesPayload(carId) {
  if (!carId) return { enabled: false, my_profile: null, profiles: [] };
  const response = await fetch(apiUrl(`/community/profiles/?car_id=${carId}`), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a közösségi profilokat.");
  }
  return {
    enabled: !!data.enabled,
    my_profile: data.my_profile || null,
    profiles: data.profiles || [],
  };
}

export async function createShareRequest({ carId, gasStation }) {
  const response = await fetch(apiUrl("/community/share-requests/create/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      gas_station_id: Number(gasStation?.gasStationId),
    }),
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült létrehozni a megosztási kérelmet.");
  }
  return data;
}

export async function revokeShareRequest({ carId, gasStationId }) {
  const response = await fetch(apiUrl("/community/share-requests/revoke/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      car_id: Number(carId),
      gas_station_id: Number(gasStationId),
    }),
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült visszavonni a megosztási kérelmet.");
  }
  return data;
}

export async function getShareStatus({ carId, gasStationId }) {
  const response = await fetch(apiUrl(`/community/share-requests/statuses/?car_id=${carId}`), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) return "none";
  const found = (data.statuses || []).find((s) => Number(s.gas_station_id) === Number(gasStationId));
  return found?.status || "none";
}

export async function getShareStatusesByCar(carId) {
  const response = await fetch(apiUrl(`/community/share-requests/statuses/?car_id=${carId}`), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) return {};
  const out = {};
  for (const item of data.statuses || []) {
    out[Number(item.gas_station_id)] = item.status;
  }
  return out;
}

export async function getPendingShareRequests() {
  const response = await fetch(apiUrl("/community/share-requests/pending/"), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a várólistát.");
  }
  return data.pending || [];
}

export async function reviewShareRequest(requestId, decision) {
  const response = await fetch(apiUrl(`/community/share-requests/${requestId}/review/`), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ decision }),
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült elbírálni a kérelmet.");
  }
  return data;
}

export async function getApprovedSharedStations() {
  const response = await fetch(apiUrl("/community/shared-stations/"), {
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni a megosztott benzinkutakat.");
  }
  return data.shared_stations || [];
}

export async function moderatorDeleteSharedStation(requestId) {
  const response = await fetch(apiUrl(`/community/share-requests/${requestId}/`), {
    method: "DELETE",
    headers: { Authorization: authHeaders().Authorization },
  });
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült törölni a megosztott benzinkutat.");
  }
  return true;
}

export async function getCommunityMonthlyComparison({ carId, otherUserId, otherCarId }) {
  const response = await fetch(
    apiUrl(
      `/community/compare-monthly/?car_id=${Number(carId)}&other_user_id=${Number(otherUserId)}&other_car_id=${Number(otherCarId)}`
    ),
    {
      headers: { Authorization: authHeaders().Authorization },
    }
  );
  const data = await parseJsonSafe(response);
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérdezni az összehasonlító statisztikákat.");
  }
  return data;
}
