import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createGasStation,
  deleteGasStation,
  editFuelingById,
  getGasStations,
} from "./gasStationActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "4",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getGasStations", function() {
  it("filters invalid cards and maps valid cards", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        gas_station_cards: [
          {
            fueling_id: 1,
            date: "2026-03-21T00:00:00Z",
            price_per_liter: "619",
            supplier: "Shell",
            fuel_type: "95",
            fuel_type_id: 2,
            gas_station: {
              gas_station_id: 5,
              city: "Budapest",
              street: "Fo utca",
              house_number: "12",
              name: "Shell",
              postal_code: "1111",
            },
          },
          {
            fueling_id: 2,
            gas_station: {},
          },
        ],
      }),
    );

    await expect(getGasStations()).resolves.toEqual([
      {
        id: 1,
        datum: "2026. 03. 21.",
        helyseg: "Budapest",
        cim: "Fo utca 12",
        literft: 619,
        supplier: "Shell",
        fuelType: "95",
        fuelTypeId: 2,
        gasStationId: 5,
        fuelingId: 1,
        stationName: "Shell",
        stationCity: "Budapest",
        stationPostalCode: "1111",
        stationStreet: "Fo utca",
        stationHouseNumber: "12",
      },
    ]);
  });
});

describe("createGasStation", function() {
  it("posts the gas station payload", async function() {
    fetch.mockResolvedValue(createJsonResponse({ gas_station_id: 15 }));

    await expect(
      createGasStation({
        name: "MOL",
        city: "Gyor",
        postal_code: "9021",
        street: "Kossuth utca",
        house_number: "1",
      }),
    ).resolves.toBe(15);

    expect(getLastFetchBody()).toEqual({
      name: "MOL",
      city: "Gyor",
      postal_code: "9021",
      street: "Kossuth utca",
      house_number: "1",
    });
  });
});

describe("editFuelingById", function() {
  it("updates supplier and fuel type on a fueling", async function() {
    fetch.mockResolvedValue(createJsonResponse({ fueling: { fueling_id: 6 } }));

    await expect(
      editFuelingById(6, {
        price_per_liter: 630,
        supplier: "OMV",
        fuel_type_id: 4,
      }),
    ).resolves.toEqual({ fueling_id: 6 });
  });
});

describe("deleteGasStation", function() {
  it("throws when gas station id is missing", async function() {
    await expect(deleteGasStation("")).rejects.toThrow();
  });
});
