import Navbar from "../../../../components/navbar/navbar";
import Menu from "../../dashboard/menu/menu";
import "../menuLayout.css";
import "./community.css";

export default function Community() {
  return (
    <div className="main-menu-layout">
      <div className="main-menu-content">
        <Menu />
      </div>

      <div className="flex-grow-1">
        <Navbar />
        <div className="container py-5">
          <h1 className="text-center text-primary mb-5 fw-bold">Közösség</h1>
        </div>
      </div>
    </div>
  );
}

