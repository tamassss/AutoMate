import { beforeEach, describe, expect, it, vi } from "vitest";
import Community from "./community/community";
import CommunityGasStations from "./community/communityGasStations";
import CommunityProfiles from "./community/communityProfiles";
import GasStations from "./gasStations/gasStations";
import ServiceLog from "./serviceLog/serviceLog";
import AllCars from "./statistics/all-cars/allCars";
import DataVisual from "./statistics/data-visual/dataVisual";
import GeneralStats from "./statistics/general-stats/generalStats";
import Statistics from "./statistics/statistics";
import Fuels from "./tripsAndFuels/fuels/fuels";
import Trips from "./tripsAndFuels/trips/trips";
import TripsAndFuels from "./tripsAndFuels/tripsAndFuels";
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
    Navigate: function Navigate(props) {
      return <div>navigate:{props.to}</div>;
    },
    useNavigate: function() {
      return vi.fn();
    },
    useLocation: function() {
      return { pathname: "/muszerfal/statisztikak" };
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
  };
});

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    selected_car_id: "7",
    user_id: "2",
    role: "user",
    full_name: "Teszt User",
  });
  globalThis.window = {
    location: { href: "/" },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    CustomEvent,
  };
});

describe("menüpont oldalak", function() {
  it("megjeleníti a kikapcsolt közösségi profilok szövegét", function() {
    const markup = renderMarkup(
      <CommunityProfiles loading={false} enabled={false} profiles={[]} onCompare={vi.fn()} />,
    );

    expect(markup).toContain("közösségi");
  });

  it("megjeleníti a közösségi benzinkutak üres állapotát", function() {
    const markup = renderMarkup(
      <CommunityGasStations
        loading={false}
        isModerator={false}
        pendingRequests={[]}
        sharedCards={[]}
        onReview={vi.fn()}
        onDeleteShared={vi.fn()}
      />,
    );

    expect(markup).toContain("megosztott benzinkút");
  });

  it("megjeleníti a közösségi oldal kezdő állapotát", function() {
    const markup = renderMarkup(<Community />);

    expect(markup).toContain("Közösség");
    expect(markup).not.toContain("Loading...");
  });

  it("megjeleníti a benzinkutak oldalt", function() {
    const markup = renderMarkup(<GasStations />);

    expect(markup).toContain("Benzinkutak");
    expect(markup).toContain("Még nincsenek mentett benzinkutak");
  });

  it("megjeleníti a szerviznapló oldalt", function() {
    const markup = renderMarkup(<ServiceLog />);

    expect(markup).toContain("Szerviznapló");
    expect(markup).toContain("Új szerviz");
  });

  it("megjeleníti az általános statisztika kártyát", function() {
    const markup = renderMarkup(
      <GeneralStats
        generalStats={{
          car: { display_name: "BMW E91" },
          distance_km_total: 12345,
          fuelings: { count: 3, liters: 150.5, spent: 90000 },
          maintenance: { total_cost: 12000 },
        }}
      />,
    );

    expect(markup).toContain("BMW E91");
    expect(markup).toContain("12.345 km");
  });

  it("megjeleníti az összes autó összesítését", function() {
    const markup = renderMarkup(
      <AllCars
        summaryStats={[
          {
            car_name: "Audi A4",
            distance_km: 1200,
            fuelings: { count: 2, spent: 25000, liters: 90.5 },
          },
        ]}
      />,
    );

    expect(markup).toContain("Audi A4");
    expect(markup).toContain("1.200 km");
  });

  it("megjeleníti az adatvizualizáció betöltési állapotát", function() {
    const markup = renderMarkup(<DataVisual />);

    expect(markup).toContain("Betöltés...");
  });

  it("megjeleníti a statisztika oldalt", function() {
    const markup = renderMarkup(<Statistics />);

    expect(markup).toContain("Statisztikák");
    expect(markup).toContain("Betöltés...");
  });

  it("megjeleníti az utak üres állapotát", function() {
    const markup = renderMarkup(<Trips trips={[]} onDeletedTrip={vi.fn()} />);

    expect(markup).toContain("Még nincsenek mentett utak");
  });

  it("megjeleníti a tankolások üres állapotát", function() {
    const markup = renderMarkup(<Fuels fuelGroups={[]} onDeletedFuel={vi.fn()} onUpdatedFuel={vi.fn()} />);

    expect(markup).toContain("Még nincsenek mentett tankolások");
  });

  it("megjeleníti az utak és tankolások oldalt", function() {
    const markup = renderMarkup(<TripsAndFuels />);

    expect(markup).toContain("Utak");
    expect(markup).toContain("Tankolások");
  });
});
