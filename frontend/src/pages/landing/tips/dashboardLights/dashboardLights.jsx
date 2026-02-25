import { useState } from "react";
import DashboardLight from "./dashboardLight";
import { lights } from "./lightsData";
import "./dashboardLights.css";
import Navbar from "../../../../components/navbar/navbar";

export default function DashboardLights() {
  const [selectedLightIndex, setSelectedLightIndex] = useState(0);
  const selectedLight = lights[selectedLightIndex];

  return (
    <>
    <Navbar/>
    <div className="container dashboard-lights-container">
      <h1 className="dashboard-lights-title">Műszerfal jelzések</h1>

      <DashboardLight light={selectedLight} />

      <div className="dashboard-lights-gallery">
        {lights.map((light, index) => (
          <button
            key={light.title}
            type="button"
            className={`dashboard-lights-thumb ${selectedLightIndex === index ? "is-active" : ""}`}
            onClick={() => setSelectedLightIndex(index)}
            aria-label={light.title}
            aria-pressed={selectedLightIndex === index}
          >
            <img src={light.img} alt={light.title} />
          </button>
        ))}
      </div>
    </div>
    </>
  );
}
