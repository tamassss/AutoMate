import { beforeEach, describe, expect, it, vi } from "vitest";
import { getGeneralStats, getSummaryStats } from "./statsActions";
import { createJsonResponse, createLocalStorageMock } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "16",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getGeneralStats", function() {
  it("loads general stats for the selected car", async function() {
    fetch.mockResolvedValue(createJsonResponse({ total_cost: 12345 }));

    await expect(getGeneralStats()).resolves.toEqual({ total_cost: 12345 });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/statistics/general/?car_id=16",
      expect.any(Object),
    );
  });
});

describe("getSummaryStats", function() {
  it("returns summary array from backend", async function() {
    fetch.mockResolvedValue(createJsonResponse({ summary: [{ car_id: 1 }] }));

    await expect(getSummaryStats()).resolves.toEqual([{ car_id: 1 }]);
  });
});
