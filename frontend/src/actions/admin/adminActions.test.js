import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "./adminActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getAdminUsers", function() {
  it("betölti a felhasználókat és hozzáadja a levágott email keresést", async function() {
    fetch.mockResolvedValue(createJsonResponse({ users: [{ user_id: 1 }] }));

    const result = await getAdminUsers("  test@example.com  ");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/admin/users/?email=test%40example.com",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer secret-token",
        }),
      }),
    );
    expect(result).toEqual([{ user_id: 1 }]);
  });
});

describe("updateAdminUser", function() {
  it("hibát dob, ha hiányzik a felhasználó azonosítója", async function() {
    await expect(updateAdminUser("", {})).rejects.toThrow();
  });

  it("elküldi a patch adatokat és visszaadja a módosított felhasználót", async function() {
    fetch.mockResolvedValue(createJsonResponse({ user: { user_id: 4, role: "user" } }));

    const result = await updateAdminUser(4, { role: "user" });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/admin/users/4/",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
    expect(getLastFetchBody()).toEqual({ role: "user" });
    expect(result).toEqual({ user_id: 4, role: "user" });
  });
});

describe("deleteAdminUser", function() {
  it("törli a kiválasztott felhasználót", async function() {
    fetch.mockResolvedValue(createJsonResponse({}));

    await expect(deleteAdminUser(7)).resolves.toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/admin/users/7/delete/",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
