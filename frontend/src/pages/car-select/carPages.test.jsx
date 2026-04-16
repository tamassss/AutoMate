import { beforeEach, describe, expect, it, vi } from "vitest";
import Cars from "./cars/cars";
import CarSelect from "./carSelect/carSelect";
import { createLocalStorageMock } from "../../actions/shared/testHelpers";
import { renderMarkup } from "../testHelpers";

vi.mock("react-router-dom", function() {
  return {
    Link: function Link(props) {
      return <a href={props.to}>{props.children}</a>;
    },
    useNavigate: function() {
      return vi.fn();
    },
    useLocation: function() {
      return { pathname: "/autok" };
    },
  };
});

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    full_name: "Teszt Elek",
  });
  globalThis.window = { location: { href: "/" } };
});

describe("autó oldalak", function() {
  it("megjeleníti az autóválasztó üres állapotát", function() {
    const markup = renderMarkup(<CarSelect refreshKey={0} onCarChange={vi.fn()} />);

    expect(markup).toContain("main-image");
    expect(markup).toContain("main-car-img");
  });

  it("megjeleníti az autók oldal fejlécét és műveletgombjait", function() {
    const markup = renderMarkup(<Cars />);

    expect(markup).toContain("Teszt Elek");
    expect(markup).toContain("cars-buttons");
    expect(markup).toContain("Új autó");
    expect(markup).not.toContain("Vissza");
  });

  it("megjeleníti az admin linket admin felhasználónál", function() {
    localStorage.setItem("role", "admin");

    const markup = renderMarkup(<Cars />);

    expect(markup).toContain("Admin felület");
  });
});
