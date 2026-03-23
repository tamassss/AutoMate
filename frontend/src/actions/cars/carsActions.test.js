import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCar, deleteCar, editCar, getCars, returnSelectedCard } from "./carsActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getCars", function() {
  it("returns the listed cars", async function() {
    fetch.mockResolvedValue(createJsonResponse({ cars: [{ car_id: 2 }] }));

    await expect(getCars()).resolves.toEqual([{ car_id: 2 }]);
  });
});

describe("createCar", function() {
  it("converts numeric fields before sending", async function() {
    fetch.mockResolvedValue(createJsonResponse({ ok: true }));

    await createCar({
      license_plate: "ABC-123",
      brand: "Ford",
      model: "Focus",
      car_image: "car_1",
      odometer_km: "123456",
      average_consumption: "6.7",
    });

    expect(getLastFetchBody()).toEqual({
      license_plate: "ABC-123",
      brand: "Ford",
      model: "Focus",
      car_image: "car_1",
      odometer_km: 123456,
      average_consumption: 6.7,
    });
  });
});

describe("editCar", function() {
  it("sends null for cleared optional numeric fields", async function() {
    fetch.mockResolvedValue(createJsonResponse({ ok: true }));

    await editCar(5, {
      license_plate: "ABC-123",
      odometer_km: "",
      average_consumption: "",
    });

    expect(getLastFetchBody()).toEqual({
      license_plate: "ABC-123",
      odometer_km: null,
      average_consumption: null,
    });
  });
});

describe("deleteCar", function() {
  it("throws when car id is missing", async function() {
    await expect(deleteCar("")).rejects.toThrow();
  });
});

describe("returnSelectedCard", function() {
  it("stores the selected car id", function() {
    expect(returnSelectedCard(15)).toBe(15);
    expect(localStorage.getItem("selected_car_id")).toBe("15");
  });
});
