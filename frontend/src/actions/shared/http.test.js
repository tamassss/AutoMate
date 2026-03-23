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
  it("builds the url for paths with leading slash", function() {
    expect(apiUrl("/cars/")).toBe("http://localhost:8000/api/cars/");
  });

  it("builds the url for paths without leading slash", function() {
    expect(apiUrl("cars/")).toBe("http://localhost:8000/api/cars/");
  });
});

describe("authHeaders", function() {
  it("returns json content type and bearer token", function() {
    localStorage.setItem("token", "secret-token");

    expect(authHeaders()).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer secret-token",
    });
  });
});

describe("handleUnauthorized", function() {
  it("does nothing for non-401 response", function() {
    expect(() => handleUnauthorized({ status: 200 })).not.toThrow();
  });

  it("clears localStorage and throws on 401", function() {
    localStorage.setItem("token", "secret-token");

    expect(function() {
      handleUnauthorized({ status: 401 });
    }).toThrow("Lejárt a belépés. Jelentkezz be újra.");

    expect(localStorage.getItem("token")).toBe(null);
    expect(window.location.href).toBe("/");
  });
});

describe("parseJsonSafe", function() {
  it("returns parsed json when response json works", async function() {
    const response = {
      json: vi.fn().mockResolvedValue({ ok: true }),
    };

    await expect(parseJsonSafe(response)).resolves.toEqual({ ok: true });
  });

  it("returns empty object when response json fails", async function() {
    const response = {
      json: vi.fn().mockRejectedValue(new Error("bad json")),
    };

    await expect(parseJsonSafe(response)).resolves.toEqual({});
  });
});
