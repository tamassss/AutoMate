const COMMUNITY_ENABLED_KEY = "community_enabled_by_car";
const COMMUNITY_PROFILES_KEY = "community_profiles";
const COMMUNITY_SHARE_REQUESTS_KEY = "community_share_requests";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function profileKey(userId, carId) {
  return `${userId}_${carId}`;
}

function carOnlyKey(carId) {
  return `car_${carId}`;
}

export function getCurrentUserMeta() {
  return {
    userId: String(localStorage.getItem("user_id") || ""),
    fullName: String(localStorage.getItem("full_name") || "Felhasználó"),
    role: String(localStorage.getItem("role") || "user"),
  };
}

export function isCommunityEnabledForCar(userId, carId) {
  const map = readJson(COMMUNITY_ENABLED_KEY, {});
  return !!(map[profileKey(userId, carId)] ?? map[carOnlyKey(carId)] ?? false);
}

export function setCommunityEnabledForCar(userId, carId, enabled) {
  const map = readJson(COMMUNITY_ENABLED_KEY, {});
  map[profileKey(userId, carId)] = !!enabled;
  map[carOnlyKey(carId)] = !!enabled;
  writeJson(COMMUNITY_ENABLED_KEY, map);
}

export function upsertCommunityProfile(profile) {
  const profiles = readJson(COMMUNITY_PROFILES_KEY, []);
  const idx = profiles.findIndex(
    (item) => String(item.userId) === String(profile.userId) && toNumber(item.carId) === toNumber(profile.carId)
  );
  const next = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) {
    profiles[idx] = next;
  } else {
    profiles.push(next);
  }
  writeJson(COMMUNITY_PROFILES_KEY, profiles);
}

export function removeCommunityProfile(userId, carId) {
  const profiles = readJson(COMMUNITY_PROFILES_KEY, []);
  const nextProfiles = profiles.filter(
    (item) => !(String(item.userId) === String(userId) && toNumber(item.carId) === toNumber(carId))
  );
  writeJson(COMMUNITY_PROFILES_KEY, nextProfiles);

  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const nextRequests = requests.filter(
    (item) => !(String(item.userId) === String(userId) && toNumber(item.carId) === toNumber(carId))
  );
  writeJson(COMMUNITY_SHARE_REQUESTS_KEY, nextRequests);
}

export function getCommunityProfilesForList(currentUserId, currentCarId) {
  const nowProfiles = readJson(COMMUNITY_PROFILES_KEY, []);
  return nowProfiles.filter(
    (profile) =>
      !(
        String(profile.userId) === String(currentUserId) &&
        toNumber(profile.carId) === toNumber(currentCarId)
      )
  );
}

export function createShareRequest({ userId, fullName, carId, carName, gasStation }) {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const existingIdx = requests.findIndex(
    (item) => String(item.userId) === String(userId) && toNumber(item.carId) === toNumber(carId) && toNumber(item.gasStationId) === toNumber(gasStation.gasStationId)
  );

  const payload = {
    requestId: existingIdx >= 0 ? requests[existingIdx].requestId : `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    userId: String(userId),
    fullName: fullName || "Felhasználó",
    carId: toNumber(carId),
    carName: carName || "-",
    gasStationId: toNumber(gasStation.gasStationId),
    station: gasStation,
    status: "pending",
    createdAt: new Date().toISOString(),
    approvedAt: null,
    expiresAt: null,
  };

  if (existingIdx >= 0) {
    requests[existingIdx] = payload;
  } else {
    requests.push(payload);
  }
  writeJson(COMMUNITY_SHARE_REQUESTS_KEY, requests);
  return payload;
}

export function revokeShareRequest({ userId, carId, gasStationId }) {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const next = requests.filter(
    (item) =>
      !(
        String(item.userId) === String(userId) &&
        toNumber(item.carId) === toNumber(carId) &&
        toNumber(item.gasStationId) === toNumber(gasStationId)
      )
  );
  writeJson(COMMUNITY_SHARE_REQUESTS_KEY, next);
}

export function getShareStatus({ userId, carId, gasStationId }) {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const found = requests.find(
    (item) =>
      String(item.userId) === String(userId) &&
      toNumber(item.carId) === toNumber(carId) &&
      toNumber(item.gasStationId) === toNumber(gasStationId)
  );
  return found?.status || "none";
}

export function getPendingShareRequests() {
  return readJson(COMMUNITY_SHARE_REQUESTS_KEY, []).filter((item) => item.status === "pending");
}

export function reviewShareRequest(requestId, decision) {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const idx = requests.findIndex((item) => String(item.requestId) === String(requestId));
  if (idx < 0) return;

  if (decision === "accept") {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 30);
    requests[idx].status = "approved";
    requests[idx].approvedAt = now.toISOString();
    requests[idx].expiresAt = expires.toISOString();
  } else {
    requests[idx].status = "rejected";
    requests[idx].approvedAt = null;
    requests[idx].expiresAt = null;
  }
  writeJson(COMMUNITY_SHARE_REQUESTS_KEY, requests);
}

export function getApprovedSharedStations() {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const now = new Date();

  const filtered = requests.filter((item) => {
    if (item.status !== "approved") return false;
    if (!item.expiresAt) return true;
    return new Date(item.expiresAt) > now;
  });

  if (filtered.length !== requests.length) {
    writeJson(COMMUNITY_SHARE_REQUESTS_KEY, filtered.concat(requests.filter((item) => item.status !== "approved")));
  }

  return filtered.sort((a, b) => new Date(b.approvedAt || b.createdAt) - new Date(a.approvedAt || a.createdAt));
}

export function moderatorDeleteSharedStation(requestId) {
  const requests = readJson(COMMUNITY_SHARE_REQUESTS_KEY, []);
  const next = requests.filter((item) => String(item.requestId) !== String(requestId));
  writeJson(COMMUNITY_SHARE_REQUESTS_KEY, next);
}
