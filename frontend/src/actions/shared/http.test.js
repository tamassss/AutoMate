import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiUrl, authHeaders, handleUnauthorized, parseJsonSafe } from "./http";

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock();
  globalThis.window = {
    location: { href: "/current" },
  };
});

describe("apiUrl", function() {
  it("összeállítja az url-t perjellel kezdődő útvonalaknál", function() {
    expect(apiUrl("/cars/")).toBe("http://localhost:8000/api/cars/");
  });

  it("összeállítja az url-t perjel nélkül kezdődő útvonalaknál", function() {
    expect(apiUrl("cars/")).toBe("http://localhost:8000/api/cars/");
  });
});

describe("authHeaders", function() {
  it("visszaadja a json content type-ot és a bearer tokent", function() {
    localStorage.setItem("token", "secret-token");

    expect(authHeaders()).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer secret-token",
    });
  });
});

describe("handleUnauthorized", function() {
  it("nem csinál semmit nem 401-es válasznál", function() {
    expect(() => handleUnauthorized({ status: 200 })).not.toThrow();
  });

  it("törli a localStorage-ot és hibát dob 401-es válasznál", function() {
    localStorage.setItem("token", "secret-token");

    expect(function() {
      handleUnauthorized({ status: 401 });
    }).toThrow("Lejárt a belépés. Jelentkezz be újra.");

    expect(localStorage.getItem("token")).toBe(null);
    expect(window.location.href).toBe("/");
  });
});

describe("parseJsonSafe", function() {
  it("visszaadja a feldolgozott json-t, ha működik a response json", async function() {
    const response = {
      json: vi.fn().mockResolvedValue({ ok: true }),
    };

    await expect(parseJsonSafe(response)).resolves.toEqual({ ok: true });
  });

  it("üres objektumot ad vissza, ha a response json hibára fut", async function() {
    const response = {
      json: vi.fn().mockRejectedValue(new Error("bad json")),
    };

    await expect(parseJsonSafe(response)).resolves.toEqual({});
  });
});
