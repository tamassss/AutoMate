import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDashboard } from "./dashboardActions";
import { createJsonResponse, createLocalStorageMock } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "12",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getDashboard", function() {
  it("loads dashboard data for the selected car", async function() {
    fetch.mockResolvedValue(createJsonResponse({ summary: true }));

    await expect(getDashboard()).resolves.toEqual({ summary: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/dashboard/?car_id=12",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer secret-token",
        }),
      }),
    );
  });

  it("throws when backend returns an error", async function() {
    fetch.mockResolvedValue(createJsonResponse({}, { ok: false, status: 500 }));

    await expect(getDashboard()).rejects.toThrow();
  });
});
