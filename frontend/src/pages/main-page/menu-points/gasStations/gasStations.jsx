import { useEffect, useState } from "react";

import Navbar from "../../../../components/navbar/navbar";
import GasStationCard from "../../../../components/gas-station-card/gasStationCard";
import Menu from "../../dashboard/menu/menu";
import { getGasStations } from "../../../../actions/gasStations/gasStationActions";
import {
  createShareRequest,
  getCurrentUserMeta,
  getShareStatusesByCar,
  isCommunityEnabledForCar,
  revokeShareRequest,
} from "../../../../actions/community/communityLocalActions";

import "./gasStations.css";
import "../menuLayout.css";

export default function GasStations() {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");
  const [communityEnabled, setCommunityEnabled] = useState(false);
  const [shareStatuses, setShareStatuses] = useState({});

  const { userId } = getCurrentUserMeta();
  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);

  useEffect(() => {
    async function loadData() {
      try {
        const [stationsData, enabled] = await Promise.all([
          getGasStations(),
          isCommunityEnabledForCar(userId, selectedCarId),
        ]);
        setStations(stationsData);
        setCommunityEnabled(enabled);
        if (enabled && selectedCarId) {
          const statuses = await getShareStatusesByCar(selectedCarId);
          setShareStatuses(statuses);
        } else {
          setShareStatuses({});
        }
      } catch (err) {
        setError(err.message || "Nem siker�lt bet�lteni a benzinkutakat.");
      }
    }
    loadData();
  }, [selectedCarId, userId]);

  function handleDeletedGasStation(deletedGasStationId) {
    setStations((prev) => prev.filter((s) => s.gasStationId !== deletedGasStationId));
  }

  function handleUpdatedGasStation(updatedStation) {
    const buildAddress = (s) => {
      const parts = [s.stationStreet, s.stationHouseNumber].filter(Boolean);
      if (parts.length > 0) return parts.join(" ");
      return s.stationName || "-";
    };

    setStations((prev) =>
      prev.map((s) => {
        if (s.gasStationId !== updatedStation.gasStationId) return s;
        const next = {
          ...s,
          ...updatedStation,
          helyseg: updatedStation.stationCity || "-",
        };
        return {
          ...next,
          cim: buildAddress(next),
        };
      })
    );
  }

  async function handleShareToggle(station) {
    if (!communityEnabled || !selectedCarId || !userId) return;
    const stationId = Number(station.gasStationId);
    const currentStatus = shareStatuses[stationId] || "none";

    if (currentStatus === "pending" || currentStatus === "approved") {
      await revokeShareRequest({
        carId: selectedCarId,
        gasStationId: stationId,
      });
      setShareStatuses((prev) => {
        const next = { ...prev };
        delete next[stationId];
        return next;
      });
      return;
    }

    await createShareRequest({
      carId: selectedCarId,
      gasStation: station,
    });
    setShareStatuses((prev) => ({ ...prev, [stationId]: "pending" }));
  }

  function buttonTextFor(station) {
    const status = shareStatuses[Number(station.gasStationId)] || "none";
    if (status === "pending") return "Visszavon�s (f�gg�ben)";
    if (status === "approved") return "Megoszt�s visszavon�sa";
    return "Megoszt�s";
  }

  return (
    <div className="main-menu-layout">
      <div className="main-menu-content">
        <Menu />
      </div>

      <div className="flex-grow-1">
        <Navbar />

        <div className="container py-5">
          <h1 className="text-center text-primary mb-5 fw-bold">Benzinkutak</h1>
          {error ? <p className="text-danger">{error}</p> : null}
          {stations.length === 0 && !error ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
              <p className="fs-4">Még nincsenek rögzített benzinkút adatok.</p>
            </div>
          ) : null}
          <div className="row g-4 justify-content-center">
            {stations.map((station) => (
              <div key={station.id} className="col-11 col-md-6 col-lg-4 d-flex justify-content-center">
                <GasStationCard
                  station={station}
                  onDeleted={handleDeletedGasStation}
                  onUpdated={handleUpdatedGasStation}
                  extraButtonText={communityEnabled ? buttonTextFor(station) : ""}
                  onExtraButtonClick={async () => {
                    try {
                      await handleShareToggle(station);
                    } catch (err) {
                      setError(err.message || "Nem sikerült kezelni a megosztást.");
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
