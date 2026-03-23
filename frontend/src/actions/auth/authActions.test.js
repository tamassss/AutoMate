import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, register, updateProfileSettings } from "./authActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token", role: "user" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("login", function() {
  it("stores auth and user data after successful login", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        tokens: { access: "access-token", refresh: "refresh-token" },
        user: { user_id: 8, full_name: "Test User", role: "admin" },
      }),
    );

    const result = await login("test@example.com", "secret");

    expect(getLastFetchBody()).toEqual({
      email: "test@example.com",
      password: "secret",
    });
    expect(localStorage.getItem("token")).toBe("access-token");
    expect(localStorage.getItem("refresh")).toBe("refresh-token");
    expect(localStorage.getItem("full_name")).toBe("Test User");
    expect(localStorage.getItem("role")).toBe("admin");
    expect(localStorage.getItem("user_id")).toBe("8");
    expect(result).toEqual({ user_id: 8, full_name: "Test User", role: "admin" });
  });

  it("throws on invalid credentials", async function() {
    fetch.mockResolvedValue(createJsonResponse({}, { ok: false, status: 401 }));

    await expect(login("bad@example.com", "bad")).rejects.toThrow();
  });
});

describe("register", function() {
  it("returns backend data on success", async function() {
    fetch.mockResolvedValue(createJsonResponse({ ok: true }));

    await expect(register("new@example.com", "secret", "New User")).resolves.toEqual({ ok: true });
  });
});

describe("updateProfileSettings", function() {
  it("saves returned profile data to local storage", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        user: {
          full_name: "Updated Name",
          email: "updated@example.com",
          role: "moderator",
        },
      }),
    );

    const result = await updateProfileSettings({
      fullName: "Updated Name",
      email: "updated@example.com",
      password: "new-secret",
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/auth/profile/",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
    expect(localStorage.getItem("full_name")).toBe("Updated Name");
    expect(localStorage.getItem("email")).toBe("updated@example.com");
    expect(localStorage.getItem("password")).toBe("new-secret");
    expect(localStorage.getItem("role")).toBe("moderator");
    expect(result).toEqual({
      full_name: "Updated Name",
      email: "updated@example.com",
      role: "moderator",
    });
  });
});
