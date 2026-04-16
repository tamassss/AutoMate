import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./home/home";
import Login from "./login/login";
import Register from "./register/register";
import Gallery from "./gallery/gallery";
import Tips from "./tips/tips";
import FuelSaving from "./tips/fuelSaving/fuelSaving";
import ParkingHelp from "./tips/parkingHelp/parkingHelp";
import DashboardLight from "./tips/dashboardLights/dashboardLight";
import DashboardLights from "./tips/dashboardLights/dashboardLights";
import { createLocalStorageMock } from "../../actions/shared/testHelpers";
import { renderMarkup } from "../testHelpers";

vi.mock("react-router-dom", function() {
  return {
    Link: function Link(props) {
      return <a href={props.to} className={props.className}>{props.children}</a>;
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
      return { pathname: "/" };
    },
  };
});

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock();
  globalThis.window = { location: { href: "/" } };
});

describe("landing oldalak", function() {
  it("megjeleníti a főoldalt kijelentkezett felhasználóknak", function() {
    const markup = renderMarkup(<Home />);

    expect(markup).toContain("Auto");
    expect(markup).toContain("Bejelentkezés");
    expect(markup).toContain("Regisztráció");
  });

  it("megjeleníti a bejelentkezési űrlapot", function() {
    const markup = renderMarkup(<Login />);

    expect(markup).toContain("Bejelentkezés");
    expect(markup).toContain("Email cím");
    expect(markup).toContain("Jelszó");
  });

  it("megjeleníti a regisztrációs űrlapot", function() {
    const markup = renderMarkup(<Register />);

    expect(markup).toContain("Regisztráció");
    expect(markup).toContain("Teljes név");
    expect(markup).toContain("Jelszó ismét");
  });

  it("megjeleníti a galériát", function() {
    const markup = renderMarkup(<Gallery />);

    expect(markup).toContain("gallery-container");
    expect(markup).toContain("image-slider");
  });

  it("megjeleníti a tippek kezdőoldalát", function() {
    const markup = renderMarkup(<Tips />);

    expect(markup).toContain("/tippek/muszerfal-jelzesek");
    expect(markup).toContain("/tippek/uzemanyag-sporolas");
    expect(markup).toContain("/tippek/parkolasi-tippek");
  });

  it("megjeleníti az üzemanyag-spórolási tippeket", function() {
    const markup = renderMarkup(<FuelSaving />);

    expect(markup).toContain("fuelSaving-container");
    expect(markup).toContain("7. tipp");
  });

  it("megjeleníti a parkolási segítség alapértelmezett fülét", function() {
    const markup = renderMarkup(<ParkingHelp />);

    expect(markup).toContain("parking-container");
    expect(markup).toContain("EM");
    expect(markup).toContain("parking-title");
  });

  it("megjeleníti a műszerfal jelzés részleteit, ha létezik a jelzés", function() {
    const markup = renderMarkup(
      <DashboardLight
        light={{
          img: "/icon.png",
          title: "Teszt jelzes",
          meaning: "Teszt jelentés",
          todo: "Teszt tennivalo",
        }}
      />,
    );

    expect(markup).toContain("Teszt jelzes");
    expect(markup).toContain("Teszt jelentés");
    expect(markup).toContain("Teszt tennivalo");
  });

  it("megjeleníti a műszerfal jelzések oldalát", function() {
    const markup = renderMarkup(<DashboardLights />);

    expect(markup).toContain("dashboard-lights-container");
    expect(markup).toContain("dashboard-lights-gallery");
  });
});
