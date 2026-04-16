import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCar, deleteCar, editCar, getCars, returnSelectedCard } from "./carsActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("getCars", function() {
  it("visszaadja a listázott autókat", async function() {
    fetch.mockResolvedValue(createJsonResponse({ cars: [{ car_id: 2 }] }));

    await expect(getCars()).resolves.toEqual([{ car_id: 2 }]);
  });
});

describe("createCar", function() {
  it("elküldés előtt számmá alakítja a numerikus mezőket", async function() {
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
  it("null értéket küld a kiürített opcionális numerikus mezőknél", async function() {
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
  it("hibát dob, ha hiányzik az autó azonosítója", async function() {
    await expect(deleteCar("")).rejects.toThrow();
  });
});

describe("returnSelectedCard", function() {
  it("eltárolja a kiválasztott autó azonosítóját", function() {
    expect(returnSelectedCard(15)).toBe(15);
    expect(localStorage.getItem("selected_car_id")).toBe("15");
  });
});
