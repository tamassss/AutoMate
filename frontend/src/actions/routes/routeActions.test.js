import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteTrip, getRoutes } from "./routeActions";
import { createJsonResponse, createLocalStorageMock } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "9",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getRoutes", function() {
  it("átalakítja az útadatokat az utak táblázatához", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        routes: [
          {
            route_usage_id: 22,
            from_city: "Budapest",
            to_city: "Gyor",
            date: "2026-03-21T00:00:00Z",
            departure_time_hhmm: "08:00",
            arrival_time_hhmm: "10:00",
            arrival_delta_min: 5,
            distance_km: 123.4,
            fuelings_count: 2,
            fuelings_spent: 15678.2,
          },
        ],
      }),
    );

    await expect(getRoutes()).resolves.toEqual([
      {
        month: "2026. 03.",
        id: 22,
        honnan: "Budapest",
        hova: "Gyor",
        datum: "2026. 03. 21.",
        kezdes: "08:00",
        vege: "10:00",
        javitas: 5,
        tavolsag: 123.4,
        tankolas_szam: 2,
        koltseg: 15678,
      },
    ]);
  });
});

describe("deleteTrip", function() {
  it("hibát dob, ha hiányzik az úthasználat azonosítója", async function() {
    await expect(deleteTrip("")).rejects.toThrow();
  });
});
