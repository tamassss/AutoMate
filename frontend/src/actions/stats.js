function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = "/";
    throw new Error("Lejart a belepes. Jelentkezz be ujra.");
  }
}

export async function getGeneralStats() {
  const token = localStorage.getItem("token");
  const carId = localStorage.getItem("selected_car_id");
  const url = carId
    ? `http://localhost:8000/api/statistics/general/?car_id=${carId}`
    : "http://localhost:8000/api/statistics/general/";

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérni az általános statisztikákat.");
  }

  return data;
}

export async function getSummaryStats() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/api/statistics/summary/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => ({}));
  handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(data.detail || "Nem sikerült lekérni az összesített statisztikákat.");
  }

  return data.summary ?? [];
}


