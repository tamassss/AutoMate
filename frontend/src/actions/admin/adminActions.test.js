import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "./adminActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getAdminUsers", function() {
  it("loads users and adds trimmed email query", async function() {
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
  it("throws when user id is missing", async function() {
    await expect(updateAdminUser("", {})).rejects.toThrow();
  });

  it("sends patch payload and returns the updated user", async function() {
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
  it("deletes the selected user", async function() {
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
