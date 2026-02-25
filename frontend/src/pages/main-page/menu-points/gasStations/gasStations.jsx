import { useEffect, useMemo, useState } from "react";

import Navbar from "../../../../components/navbar/navbar";
import GasStationCard from "../../../../components/gas-station-card/gasStationCard";
import Menu from "../../dashboard/menu/menu";
import { getGasStations } from "../../../../actions/gasStations/gasStationActions";
import { getCars } from "../../../../actions/cars/carsActions";
import {
  createShareRequest,
  getCurrentUserMeta,
  getShareStatus,
  isCommunityEnabledForCar,
  revokeShareRequest,
} from "../../../../actions/community/communityLocalActions";

import "./gasStations.css";
import "../menuLayout.css";

export default function GasStations() {
  const [stations, setStations] = useState([]);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");

  const { userId, fullName } = getCurrentUserMeta();
  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);
  const selectedCar = useMemo(
    () => cars.find((car) => Number(car.car_id) === selectedCarId),
    [cars, selectedCarId]
  );
  const communityEnabled = isCommunityEnabledForCar(userId, selectedCarId);

  useEffect(() => {
    async function loadData() {
      try {
        const [stationsData, carsData] = await Promise.all([getGasStations(), getCars()]);
        setStations(stationsData);
        setCars(carsData);
      } catch (err) {
        setError(err.message || "Nem sikerült betölteni a benzinkutakat.");
      }
    }
    loadData();
  }, []);

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

  function handleShareToggle(station) {
    if (!communityEnabled || !selectedCarId || !userId) return;
    const currentStatus = getShareStatus({
      userId,
      carId: selectedCarId,
      gasStationId: station.gasStationId,
    });

    if (currentStatus === "pending" || currentStatus === "approved") {
      revokeShareRequest({
        userId,
        carId: selectedCarId,
        gasStationId: station.gasStationId,
      });
      return;
    }

    createShareRequest({
      userId,
      fullName,
      carId: selectedCarId,
      carName: selectedCar?.display_name || "-",
      gasStation: station,
    });
  }

  function buttonTextFor(station) {
    const status = getShareStatus({
      userId,
      carId: selectedCarId,
      gasStationId: station.gasStationId,
    });
    if (status === "pending") return "Visszavonás (függőben)";
    if (status === "approved") return "Megosztás visszavonása";
    return "Megosztás";
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
                  onExtraButtonClick={() => handleShareToggle(station)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
