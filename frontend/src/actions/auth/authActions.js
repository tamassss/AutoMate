import { apiUrl, parseJsonSafe } from "../shared/http";

// Bejelentkezés
export async function login(email, password) {
  const response = await fetch(apiUrl("/auth/login/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.detail || "Hiba a bejelentkezésnél.");
  }

  localStorage.setItem("token", data?.tokens?.access || "");
  localStorage.setItem("refresh", data?.tokens?.refresh || "");
  localStorage.setItem("full_name", data?.user?.full_name || "");

  return data.user;
}

// Regisztráció
export async function register(email, password, fullName) {
  const response = await fetch(apiUrl("/auth/register/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.detail || "Hiba a regisztrációnál.");
  }

  return data;
}

// Kijelentkezés
export function logout() {
  localStorage.clear();
}
