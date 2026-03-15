import { useEffect, useState, useCallback } from "react";
import { getDashboard } from "../../../actions/dashboard/dashboardActions";
import { getStoredBudgetLimit, setStoredBudgetLimit } from "../../../actions/dashboard/budgetActions";
import { saveFuelingWithGasStation, saveTripWithFuelings } from "../../../actions/trips/tripActions";
import { createEvent } from "../../../actions/serviceLog/serviceLogActions";

import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import Navbar from "../../../components/navbar/navbar";
import DashboardGauge from "./dashboardGauge/dashbboardGauge";
import Menu from "./menu/menu";
import Trip from "./trip/trip";
import Fuel from "./fuel/fuel";
import TripInfo from "./tripInfo/tripInfo";
import FuelInfo from "./fuelInfo/fuelInfo";
import SuccessModal from "../../../components/success-modal/successModal";
import { hhmmToMinutes } from "../../../actions/shared/formatters";

import NewTrip from "../../../modals/newTrip/newTrip";
import NewFuel from "../../../modals/newFuel/newFuel";
import NewGasStation from "../../../modals/newGasStation/newGasStation";

import "./dashboard.css";

export default function Dashboard() {
  const [showNewFuel, setShowNewFuel] = useState(false);
  const [showNewGasStation, setShowNewGasStation] = useState(false);
  const [showNewTrip, setShowNewTrip] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [isSavingTrip, setIsSavingTrip] = useState(false);

  // Aktív út betöltése (ls)
  const [activeTrip, setActiveTrip] = useState(() => {
    const raw = localStorage.getItem("active_trip_state");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  // út megmaradjon frissítéskor
  const syncActiveTrip = useCallback((updater) => {
    setActiveTrip((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (!next) {
        localStorage.removeItem("active_trip_state");
        return null;
      }
      localStorage.setItem("active_trip_state", JSON.stringify(next));
      return next;
    });
  }, []);

  // Adatok betöltése backendből
  const loadDashboardData = useCallback(async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);

      if (data?.selected_car?.odometer_km != null) {
        localStorage.setItem("selected_car_odometer_km", String(data.selected_car.odometer_km));
      }
    } catch (err) {
      console.error("Hiba a dashboard adatok betöltésekor:", err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Budget számítás
  const backendSpent = Number(dashboardData?.monthly_budget?.spent || 0);
  const backendLimit = Number(dashboardData?.monthly_budget?.limit || 0);
  const customLimit = getStoredBudgetLimit();
  const limit = customLimit !== null ? customLimit : backendLimit;
  const percentUsed = limit > 0 ? Math.min(Math.round((backendSpent / limit) * 100), 100) : 0;

  const shownBudget = {
    spent: backendSpent,
    limit,
    percent_used: percentUsed,
  };


  const handleTripRuntimeChange = (runtime) => {
    syncActiveTrip((prev) => {
      if (!prev || JSON.stringify(prev.runtime) === JSON.stringify(runtime)) return prev;
      return { ...prev, runtime };
    });
  };

  //út törlés
  const handleCancelTripFinish = () => {
    syncActiveTrip(null);
    setSuccessMessage("Út törölve");
  };

  //út mentés
  const handleSaveTripFinish = async () => {
    if (!activeTrip || isSavingTrip) return;

    const tripToSave = activeTrip;
    setIsSavingTrip(true);
    
    try {
      const expectedMinutes = hhmmToMinutes(tripToSave?.expectedArrival);
      const actualMinutes = hhmmToMinutes(tripToSave?.runtime?.actualArrival);
      const arrivalDeltaMin = (expectedMinutes == null || actualMinutes == null) 
        ? null 
        : expectedMinutes - actualMinutes;

      await saveTripWithFuelings({
        ...tripToSave,
        fuelings: [],
        arrivalDeltaMin,
      });
      
      syncActiveTrip(null);
      await loadDashboardData();
      setSuccessMessage("Út sikeresen elmentve");
    } catch (err) {
      alert(err.message || "Nem sikerült menteni az utat.");
    } finally {
      setIsSavingTrip(false);
    }
  };

  // új tankolás
  const handleSaveFuel = async (fuelData) => {
    // úthoz kapcsolás
    const tripCarId = activeTrip?.carId || null;
    await saveFuelingWithGasStation(fuelData, tripCarId);
    
    if (activeTrip && !activeTrip?.runtime?.showFinishResult) {
      syncActiveTrip((prev) => ({
        ...prev,
        fuelings: [...(prev?.fuelings || []), fuelData],
      }));
    }
    
    await loadDashboardData();
    setShowNewFuel(false);
  };

  //új limit
  const handleSaveBudgetLimit = (newLimit) => {
    const savedLimit = setStoredBudgetLimit(newLimit);
    loadDashboardData();
  };

  //új út
  const handleStartTrip = (newTrip) => {
    const selectedCarId = localStorage.getItem("selected_car_id");
    const startedTrip = {
      ...newTrip,
      carId: selectedCarId || null,
      carDisplayName: dashboardData?.selected_car?.display_name || null,
      runtime: {
        isRunning: true,
        elapsedBeforeRunSec: 0,
        lastStartedAtMs: Date.now(),
        showFinishResult: false,
        actualArrival: null,
      },
      fuelings: [],
    };
    syncActiveTrip(startedTrip);
    setShowNewTrip(false);
  };

  const tripToShow = activeTrip;
  const activeTripCarId = Number(tripToShow?.carId || 0);
  const selectedCarId = Number(dashboardData?.selected_car?.car_id || 0);
  const isTripFromAnotherCar = !!tripToShow && activeTripCarId > 0 && selectedCarId > 0 && activeTripCarId !== selectedCarId;

  return (
    <div className="dashboard-layout">
      <div className="menu-content">
        <Menu 
          events={dashboardData?.events?.items || []} 
          onEventCreated={async (formData) => {
            await createEvent(formData);
            await loadDashboardData();
          }} 
        />
      </div>

      <div className="flex-grow-1">
        <Navbar />
        <div className="dashboard-header">
          <h1 className="custom-title">
            {dashboardData?.selected_car?.display_name || "Nincs autó kiválasztva"}
          </h1>
        </div>

        {/* TARTALOM */}
        <div className="container-fluid">
          <div className="row g-3 dashboard-main-row">
            {/* ÚT */}
            <div className="col-xl-4 col-12">
              <div className="fixed-height-card mb-3">
                <Card>
                  <div className="card-content-wrap justify-content-center">
                    {tripToShow ? (
                      <>
                        {isTripFromAnotherCar && (
                          <p className="text-warning text-center mb-2">
                            Út ezzel az autóval: <strong>{tripToShow?.carDisplayName}</strong>
                          </p>
                        )}
                        <Trip
                          tripData={tripToShow}
                          onCancelFinish={handleCancelTripFinish}
                          onSaveFinish={handleSaveTripFinish}
                          onRuntimeChange={handleTripRuntimeChange}
                        />
                      </>
                    ) : (
                      <TripInfo />
                    )}
                  </div>
                  {!tripToShow && (
                    <div className="card-btn">
                      <Button text="Új út" onClick={() => setShowNewTrip(true)} />
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* BUDGET GAUGE KÁRTYA */}
            <div className="col-xl-4 col-12">
              <div className="fixed-height-card mb-3">
                <Card>
                  <div className="card-content-wrap justify-content-center">
                    <DashboardGauge
                      selectedCar={dashboardData?.selected_car}
                      monthlyBudget={shownBudget}
                      onSaveLimit={handleSaveBudgetLimit}
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* TANKOLÁS */}
            <div className="col-xl-4 col-12">
              <div className="fixed-height-card mb-3">
                <Card>
                  <div className="card-content-wrap justify-content-center">
                    {dashboardData?.latest_fueling ? (
                      <Fuel 
                        fuelingChart={dashboardData?.fueling_chart} 
                        latestFueling={dashboardData?.latest_fueling} 
                      />
                    ) : (
                      <FuelInfo />
                    )}
                  </div>
                  <div className="card-btn dashboard-fuel-actions">
                    <Button text="Új tankolás" onClick={() => setShowNewFuel(true)} />
                    <Button text="Új benzinkút" onClick={() => setShowNewGasStation(true)} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {showNewFuel && <NewFuel onClose={() => setShowNewFuel(false)} onSave={handleSaveFuel} />}
        {showNewGasStation && (
          <NewGasStation onClose={() => setShowNewGasStation(false)} onSave={loadDashboardData} />
        )}
        {showNewTrip && (
          <NewTrip
            onClose={() => setShowNewTrip(false)}
            avgConsumption={dashboardData?.selected_car?.average_consumption}
            onStart={handleStartTrip}
          />
        )}
        {successMessage && (
          <SuccessModal description={successMessage} onClose={() => setSuccessMessage("")} />
        )}
      </div>
    </div>
  );
}
