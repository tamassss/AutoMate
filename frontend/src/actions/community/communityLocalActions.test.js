import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentUserMeta } from "./communityLocalActions";

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock();
});

describe("getCurrentUserMeta", function() {
  it("visszaadja az eltárolt helyi felhasználói adatokat", function() {
    localStorage.setItem("user_id", "15");
    localStorage.setItem("full_name", "Test User");
    localStorage.setItem("role", "admin");

    expect(getCurrentUserMeta()).toEqual({
      userId: "15",
      fullName: "Test User",
      role: "admin",
    });
  });

  it("alapértelmezett értékeket ad vissza, ha üres a local storage", function() {
    expect(getCurrentUserMeta()).toEqual({
      userId: "",
      fullName: "Felhasználó",
      role: "user",
    });
  });
});
