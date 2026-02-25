import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

import Navbar from "../../../../components/navbar/navbar";
import Menu from "../../dashboard/menu/menu";
import Card from "../../../../components/card/card";
import Button from "../../../../components/button/button";
import GasStationCard from "../../../../components/gas-station-card/gasStationCard";
import { getCars } from "../../../../actions/cars/carsActions";
import { getGeneralStats } from "../../../../actions/stats/statsActions";
import { getCarImageSrc } from "../../../../assets/car-images/carImageOptions";
import {
  getApprovedSharedStations,
  getCommunityProfilesForList,
  getCurrentUserMeta,
  getPendingShareRequests,
  isCommunityEnabledForCar,
  moderatorDeleteSharedStation,
  reviewShareRequest,
  upsertCommunityProfile,
} from "../../../../actions/community/communityLocalActions";

import "../menuLayout.css";
import "./community.css";

function chartOptions(yTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#ddd" } },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: yTitle, color: "#7ec8ff" },
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.12)" },
      },
      x: {
        ticks: { color: "#ccc" },
        grid: { display: false },
      },
    },
  };
}

function profileChart(title, unit, myValue, otherValue, myName, otherName) {
  return (
    <div className="community-chart-item">
      <p className="text-light text-center mb-2">{title}</p>
      <div style={{ height: "220px" }}>
        <Bar
          data={{
            labels: [myName, otherName],
            datasets: [
              {
                label: unit,
                data: [myValue, otherValue],
                backgroundColor: ["#0a6ddf", "#2cb67d"],
              },
            ],
          }}
          options={chartOptions(unit)}
        />
      </div>
    </div>
  );
}

export default function Community() {
  const { userId, fullName, role } = getCurrentUserMeta();
  const selectedCarId = Number(localStorage.getItem("selected_car_id") || 0);

  const [activeTab, setActiveTab] = useState("profiles");
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [sharedStations, setSharedStations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");

  const [myProfile, setMyProfile] = useState(null);
  const [compareWith, setCompareWith] = useState(null);

  const isModerator = role === "moderator" || role === "admin";

  const refreshCommunityData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const cars = await getCars();
      const selectedCar = cars.find((car) => Number(car.car_id) === selectedCarId);
      const isEnabled = isCommunityEnabledForCar(userId, selectedCarId);
      setEnabled(isEnabled);

      if (isEnabled) {
        const general = await getGeneralStats();
        const distance = Number(general?.distance_km_total || 0);
        const liters = Number(general?.fuelings?.liters || 0);
        const spent = Number(general?.fuelings?.spent || 0);
        const pricePerKm = distance > 0 ? Number((spent / distance).toFixed(1)) : 0;

        const current = {
          userId,
          fullName,
          carId: selectedCarId,
          carName: selectedCar?.display_name || general?.car?.display_name || "-",
          licensePlate: selectedCar?.license_plate || general?.car?.license_plate || "-",
          carImage: selectedCar?.car_image || null,
          stats: { distance, liters, spent, pricePerKm },
        };
        upsertCommunityProfile(current);
        setMyProfile(current);
      } else {
        setMyProfile(null);
      }

      setProfiles(getCommunityProfilesForList(userId, selectedCarId));
      setSharedStations(getApprovedSharedStations());
      setPendingRequests(isModerator ? getPendingShareRequests() : []);
    } catch (err) {
      setError(err.message || "Nem sikerült betölteni a közösségi adatokat.");
    } finally {
      setLoading(false);
    }
  }, [fullName, isModerator, selectedCarId, userId]);

  useEffect(() => {
    refreshCommunityData();
  }, [refreshCommunityData]);

  function acceptOrReject(requestId, decision) {
    reviewShareRequest(requestId, decision);
    refreshCommunityData();
  }

  function deleteSharedByModerator(requestId) {
    moderatorDeleteSharedStation(requestId);
    refreshCommunityData();
  }

  const sharedCards = useMemo(
    () =>
      sharedStations.map((item) => ({
        ...item.station,
        datum: item.approvedAt ? String(item.approvedAt).slice(0, 10) : "-",
        extraInfo: `${item.fullName} - ${item.carName}`,
      })),
    [sharedStations]
  );

  const canShowStationsTab = enabled || isModerator;

  return (
    <div className="main-menu-layout">
      <div className="main-menu-content">
        <Menu />
      </div>

      <div className="flex-grow-1">
        <Navbar />

        <div>
          <div className="container-fluid p-0 community-tabs">
            <div className="row g-0">
              <div
                className={`col-6 d-flex justify-content-center align-items-center community-tab ${
                  activeTab === "profiles" ? "active" : "inactive"
                }`}
                onClick={() => setActiveTab("profiles")}
              >
                <p className="fs-5">Profilok</p>
              </div>
              <div
                className={`col-6 d-flex justify-content-center align-items-center community-tab ${
                  activeTab === "stations" ? "active" : "inactive"
                }`}
                onClick={() => setActiveTab("stations")}
              >
                <p className="fs-5">Benzinkutak</p>
              </div>
            </div>
          </div>

          <div className="container py-4">
            <h1 className="text-center text-primary mb-4 fw-bold">Közösség</h1>
            {loading ? <p className="text-center text-light">Betöltés...</p> : null}
            {error ? <p className="text-danger text-center">{error}</p> : null}

            {!loading && !enabled && activeTab === "profiles" ? (
              <p className="text-center text-light">
                Ehhez az autóhoz nincs engedélyezve a közösség. A menüben jelöld be a Közösség checkboxot.
              </p>
            ) : null}

            {!loading && enabled && activeTab === "profiles" ? (
              <div className="row g-4">
                {profiles.length === 0 ? (
                  <p className="text-center text-light">Még nincs másik engedélyezett profil.</p>
                ) : (
                  profiles.map((profile) => (
                    <div key={`${profile.userId}_${profile.carId}`} className="col-12 col-md-6 col-xl-4">
                      <Card>
                        <div className="p-3 text-center text-light">
                          <img
                            src={getCarImageSrc(profile.carImage)}
                            alt={profile.carName}
                            style={{ width: "130px", height: "130px", objectFit: "contain" }}
                          />
                          <h5 className="text-primary mt-3 mb-1">{profile.fullName}</h5>
                          <p className="mb-1">{profile.carName}</p>
                          <p className="mb-3 text-secondary">{profile.licensePlate}</p>
                          <Button text="Statisztikák összehasonlítása" onClick={() => setCompareWith(profile)} />
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            ) : null}

            {!loading && activeTab === "stations" ? (
              <>
                {!canShowStationsTab ? (
                  <p className="text-center text-light">
                    A benzinkutak fülhöz kapcsold be a közösséget ennél az autónál.
                  </p>
                ) : null}

                {canShowStationsTab && sharedCards.length === 0 ? (
                  <p className="text-center text-light">Még nincs jóváhagyott megosztott benzinkút.</p>
                ) : null}

                {canShowStationsTab && sharedCards.length > 0 ? (
                  <div className="row g-4 justify-content-center">
                    {sharedCards.map((card, index) => (
                      <div key={`${card.gasStationId}_${index}`} className="col-11 col-md-6 col-lg-4 d-flex justify-content-center">
                        <GasStationCard
                          station={card}
                          showDefaultActions={false}
                          extraInfo={card.extraInfo}
                          extraButtonText={isModerator ? "Törlés" : ""}
                          onExtraButtonClick={() => {
                            if (!isModerator) return;
                            deleteSharedByModerator(sharedStations[index].requestId);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {isModerator ? (
                  <div className="mt-5">
                    <h3 className="text-primary mb-3">Moderátori várólista</h3>
                    {pendingRequests.length === 0 ? (
                      <p className="text-light">Nincs függőben lévő kérelem.</p>
                    ) : (
                      <div className="row g-4">
                        {pendingRequests.map((item) => (
                          <div key={item.requestId} className="col-12 col-xl-6">
                            <GasStationCard
                              station={{ ...item.station, datum: String(item.createdAt).slice(0, 10) }}
                              showDefaultActions={false}
                              extraInfo={`${item.fullName} - ${item.carName}`}
                            />
                            <div className="d-flex gap-2 justify-content-center mt-2">
                              <Button text="Elfogadás" onClick={() => acceptOrReject(item.requestId, "accept")} />
                              <Button text="Elutasítás" onClick={() => acceptOrReject(item.requestId, "reject")} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {compareWith && myProfile ? (
        <div className="community-modal-backdrop">
          <div className="community-modal">
            <div className="community-modal-header">
              <button className="community-back-btn" onClick={() => setCompareWith(null)} type="button">
                ←
              </button>
              <h4 className="text-primary m-0 text-center w-100">
                {myProfile.fullName} - {compareWith.fullName}
              </h4>
            </div>

            <div className="community-chart-wrap">
              {profileChart(
                "Megtett távolság összesen",
                "Km",
                myProfile.stats.distance,
                compareWith.stats?.distance || 0,
                "Én",
                "Másik"
              )}
              {profileChart(
                "Tankolt liter összesen",
                "Liter",
                myProfile.stats.liters,
                compareWith.stats?.liters || 0,
                "Én",
                "Másik"
              )}
              {profileChart(
                "1 km ára (átlag)",
                "Ft/km",
                myProfile.stats.pricePerKm,
                compareWith.stats?.pricePerKm || 0,
                "Én",
                "Másik"
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
