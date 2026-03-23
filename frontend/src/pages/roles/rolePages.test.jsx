import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "./admin/adminPage";
import ModeratorPage from "./moderator/moderatorPage";
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
      return { pathname: "/admin" };
    },
  };
});

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({
    user_id: "1",
    token: "secret-token",
  });
  globalThis.window = { location: { href: "/" } };
});

describe("role pages", function() {
  it("renders admin page", function() {
    const markup = renderMarkup(<AdminPage />);

    expect(markup).toContain("Admin felület");
    expect(markup).toContain("Keresés");
  });

  it("renders moderator page empty state", function() {
    const markup = renderMarkup(<ModeratorPage pendingRequests={[]} onReview={vi.fn()} />);

    expect(markup).toContain("Várólista");
    expect(markup).toContain("Nincs függőben lévő kérelem");
  });
});
