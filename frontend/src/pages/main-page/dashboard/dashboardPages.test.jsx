import { beforeEach, describe, expect, it, vi } from "vitest";
import { Line } from "react-chartjs-2";
import AverageConsumption from "../averageConsumption/averageConsumption";
import BudgetLimit from "./budgetLimit/budgetLimit";
import DashboardGauge from "./dashboardGauge/dashboardGauge";
import Fuel from "./fuel/fuel";
import FuelInfo from "./fuelInfo/fuelInfo";
import Menu from "./menu/menu";
import Trip from "./trip/trip";
import TripInfo from "./tripInfo/tripInfo";
import Dashboard from "./dashboard";
import { createLocalStorageMock } from "../../../actions/shared/testHelpers";
import { renderMarkup } from "../../testHelpers";

vi.mock("react-router-dom", function() {
  return {
    Link: function Link(props) {
      return <a href={props.to}>{props.children}</a>;
    },
    NavLink: function NavLink(props) {
      const className = typeof props.className === "function" ? props.className({ isActive: false }) : props.className;
      return <a href={props.to} className={className}>{props.children}</a>;
    },
    useNavigate: function() {
      return vi.fn();
    },
    useLocation: function() {
      return { pathname: "/muszerfal" };
    },
  };
});

vi.mock("react-chartjs-2", function() {
  return {
    Line: function Line() {
      return <div>mock-line-chart</div>;
    },
    Bar: function Bar() {
      return <div>mock-bar-chart</div>;
    },
    Pie: function Pie() {
      return <div>mock-pie-chart</div>;
    },
  };
});

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    selected_car_id: "5",
  });
  globalThis.window = {
    location: { href: "/" },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    CustomEvent,
  };
  globalThis.alert = vi.fn();
});

describe("dashboard pages", function() {
  it("renders average consumption page", function() {
    const markup = renderMarkup(<AverageConsumption />);

    expect(markup).toContain("avg-cons-div");
    expect(markup).toContain("Kalkulálás");
  });

  it("renders budget limit stats", function() {
    const markup = renderMarkup(<BudgetLimit spent={5000} limit={10000} />);

    expect(markup).toContain("HAVI");
    expect(markup).toContain("50%");
  });

  it("renders dashboard gauge", function() {
    const markup = renderMarkup(
      <DashboardGauge
        selectedCar={{ average_consumption: 6.3 }}
        monthlyBudget={{ spent: 12000, limit: 30000 }}
        onSaveLimit={vi.fn()}
      />,
    );

    expect(markup).toContain("Átlagos fogyasztás");
    expect(markup).toContain("Teszt");
  });

  it("renders fuel card with chart and last fueling", function() {
    const markup = renderMarkup(
      <Fuel
        fuelingChart={{ points: [{ spent: 1000, liters: 5 }] }}
        latestFueling={{ date: "2026-03-22T00:00:00Z", liters: 20, spent: 12345 }}
      />,
    );

    expect(markup).toContain("mock-line-chart");
    expect(markup).toContain("12.345 Ft");
  });

  it("renders fuel info placeholder", function() {
    const markup = renderMarkup(<FuelInfo />);

    expect(markup).toContain("Tankolás");
    expect(markup).toContain("ul");
  });

  it("renders trip page", function() {
    const markup = renderMarkup(
      <Trip
        tripData={{
          title: "Hazaut",
          startTime: "08:00",
          expectedArrival: "09:30",
          distanceKm: 120,
          avgConsumption: 6.5,
          fuelings: [],
          runtime: {
            isRunning: false,
            elapsedBeforeRunSec: 3600,
            lastStartedAtMs: null,
            showFinishResult: false,
            actualArrival: null,
          },
        }}
      />,
    );

    expect(markup).toContain("Hazaut");
    expect(markup).toContain("08:00");
  });

  it("renders trip info placeholder", function() {
    const markup = renderMarkup(<TripInfo />);

    expect(markup).toContain("Út");
    expect(markup).toContain("ul");
  });

  it("renders menu page structure", function() {
    const markup = renderMarkup(<Menu />);

    expect(markup).toContain("menu-panel");
    expect(markup).toContain("menu-events-empty");
  });

  it("renders dashboard layout", function() {
    const markup = renderMarkup(<Dashboard />);

    expect(markup).toContain("dashboard-layout");
    expect(markup).toContain("Új Út");
    expect(markup).toContain("Új Tankolás");
  });
});
