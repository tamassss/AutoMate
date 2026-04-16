import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createServiceLogEntry,
  deleteServiceLogEntry,
  getServiceLog,
  updateServiceLogEntry,
} from "./serviceLogActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "3",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getServiceLog", function() {
  it("átalakítja a szerviznapló sorait és szétbontja az emlékeztető mezőket", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        service_log: [
          {
            maintenance_id: 4,
            part_name: "Olajszuro",
            date: "2026-03-21T00:00:00Z",
            cost: 12345,
            reminder: "2026-06-01 | 5000 km",
            service_center: { service_center_id: 8 },
          },
        ],
      }),
    );

    await expect(getServiceLog()).resolves.toEqual([
      {
        id: 4,
        alkatresz: "Olajszuro",
        ido: "2026. 03. 21.",
        ar: "12.345 Ft",
        rawDate: "2026-03-21T00:00:00Z",
        rawCost: 12345,
        rawReminder: "2026-06-01 | 5000 km",
        serviceCenterId: 8,
        emlekeztetoDatum: "2026-06-01",
        emlekeztetoKm: "5000 km",
      },
    ]);
  });
});

describe("createServiceLogEntry", function() {
  it("először létrehozza a szervizt, majd menti a szervizbejegyzést", async function() {
    fetch
      .mockResolvedValueOnce(createJsonResponse({ service_center_id: 10 }))
      .mockResolvedValueOnce(createJsonResponse({ maintenance_id: 20 }));

    await createServiceLogEntry({
      partName: "Olajcsere",
      date: "2026-03-21",
      cost: "14990",
      reminderDate: "2026-06-01",
      reminderKm: "5000",
      serviceCenterName: "Proba Szerviz",
    });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8000/api/service-centers/create/",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8000/api/maintenance/create/",
      expect.objectContaining({ method: "POST" }),
    );

    const secondBody = JSON.parse(fetch.mock.calls[1][1].body);
    expect(secondBody).toEqual({
      car_id: 3,
      service_center_id: 10,
      date: "2026-03-21T00:00:00Z",
      part_name: "Olajcsere",
      cost: 14990,
      reminder: "2026-06-01 | 5000 km",
    });
  });
});

describe("updateServiceLogEntry", function() {
  it("az üres költséget null értékre cseréli és megtartja a csak km-es emlékeztetőt", async function() {
    fetch.mockResolvedValue(createJsonResponse({ maintenance: { maintenance_id: 6 } }));

    await updateServiceLogEntry(6, {
      partName: "Szuro",
      date: "2026-03-25",
      cost: "",
      reminderDate: "",
      reminderKm: "7000",
    });

    expect(getLastFetchBody()).toEqual({
      part_name: "Szuro",
      date: "2026-03-25T00:00:00Z",
      cost: null,
      reminder: "7000 km",
    });
  });
});

describe("deleteServiceLogEntry", function() {
  it("hibát dob, ha hiányzik a karbantartás azonosítója", async function() {
    await expect(deleteServiceLogEntry("")).rejects.toThrow();
  });
});
