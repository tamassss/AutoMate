import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEvent, deleteEvent, getEvents, updateEvent } from "./eventActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    token: "secret-token",
    selected_car_id: "11",
  });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("createEvent", function() {
  it("normalizes the date and numeric reminder", async function() {
    fetch.mockResolvedValue(createJsonResponse({ ok: true }));

    await createEvent({
      partName: "Olajcsere",
      date: "2026-03-21",
      reminder: "1500",
    });

    expect(getLastFetchBody()).toEqual({
      car_id: 11,
      title: "Olajcsere",
      date: "2026-03-21T00:00:00Z",
      reminder: "1500 km",
    });
  });
});

describe("getEvents", function() {
  it("maps backend events to the frontend shape", async function() {
    fetch.mockResolvedValue(
      createJsonResponse({
        events: [
          {
            event_id: 3,
            title: "",
            date: "2026-03-21T00:00:00Z",
            reminder: "500 km",
          },
        ],
      }),
    );

    await expect(getEvents()).resolves.toEqual([
      {
        id: 3,
        title: "Esemény",
        date: "2026-03-21T00:00:00Z",
        reminder: "500 km",
      },
    ]);
  });
});

describe("updateEvent", function() {
  it("throws when event id is missing", async function() {
    await expect(updateEvent("", {})).rejects.toThrow();
  });
});

describe("deleteEvent", function() {
  it("deletes the selected event", async function() {
    fetch.mockResolvedValue(createJsonResponse({}));

    await expect(deleteEvent(4)).resolves.toBe(true);
  });
});
