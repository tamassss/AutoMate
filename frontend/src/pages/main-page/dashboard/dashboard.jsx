import { useEffect, useMemo, useState } from "react";
import {
    createEvent,
    getDashboard,
    getStoredBudgetLimit,
    saveFuelingWithGasStation,
    saveTripWithFuelings,
    setStoredBudgetLimit,
} from "../../../actions/dashboard";

import Card from "../../../components/card/card";
import Button from "../../../components/button/button";
import Navbar from "../../../components/navbar/navbar";
import DashboardGauge from "./dashboardGauge/dashbboardGauge";
import Menu from "./menu/menu";
import Trip from "./trip/trip";
import Fuel from "./fuel/fuel";
import TripInfo from "./tripInfo/tripInfo";
import FuelInfo from "./fuelInfo/fuelInfo";

import NewTrip from "../../../modals/newTrip/newTrip";
import NewFuel from "../../../modals/newFuel/newFuel";

import "./dashboard.css";

const ACTIVE_TRIP_KEY = "active_trip_state";

export default function Dashboard() {
    const [showNewFuel, setShowNewFuel] = useState(false);
    const [showNewTrip, setShowNewTrip] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [activeTrip, setActiveTrip] = useState(() => {
        const raw = localStorage.getItem(ACTIVE_TRIP_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    });

    const shownBudget = useMemo(() => {
        const backendSpent = Number(dashboardData?.monthly_budget?.spent || 0);
        const backendLimit = Number(dashboardData?.monthly_budget?.limit || 0);
        const customLimit = getStoredBudgetLimit();
        const limit = customLimit !== null ? customLimit : backendLimit;
        const percent = limit > 0 ? Math.min(Math.round((backendSpent / limit) * 100), 100) : 0;

        return {
            spent: backendSpent,
            limit,
            percent_used: percent,
        };
    }, [dashboardData]);

    function persistActiveTrip(nextTrip) {
        if (!nextTrip) {
            localStorage.removeItem(ACTIVE_TRIP_KEY);
            return;
        }
        localStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(nextTrip));
    }

    function setAndPersistActiveTrip(updater) {
        setActiveTrip((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            persistActiveTrip(next);
            return next;
        });
    }

    async function loadDashboardData() {
        const data = await getDashboard();
        setDashboardData(data);

        if (data?.selected_car?.odometer_km !== undefined && data?.selected_car?.odometer_km !== null) {
            localStorage.setItem("selected_car_odometer_km", String(data.selected_car.odometer_km));
        }
    }

    function handleFuelAddedToTrip(fuelData) {
        setAndPersistActiveTrip((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                fuelings: [...(prev.fuelings || []), fuelData],
            };
        });
    }

    function handleCancelTripFinish() {
        setAndPersistActiveTrip(null);
    }

    async function handleSaveTripFinish() {
        if (!activeTrip) return;
        try {
            await saveTripWithFuelings(activeTrip);
            setAndPersistActiveTrip(null);
            await loadDashboardData();
        } catch (err) {
            alert(err.message || "Nem sikerült menteni az utat.");
        }
    }

    async function handleSaveFuel(fuelData) {
        if (activeTrip) {
            handleFuelAddedToTrip(fuelData);
            return;
        }
        await saveFuelingWithGasStation(fuelData);
        await loadDashboardData();
    }

    async function handleEventCreated(formData) {
        await createEvent(formData);
        await loadDashboardData();
    }

    function handleSaveBudgetLimit(newLimit) {
        const savedLimit = setStoredBudgetLimit(newLimit);
        setDashboardData((prev) => {
            if (!prev) return prev;
            const spent = Number(prev?.monthly_budget?.spent || 0);
            const percent = savedLimit > 0 ? Math.min(Math.round((spent / savedLimit) * 100), 100) : 0;
            return {
                ...prev,
                monthly_budget: {
                    ...(prev.monthly_budget || {}),
                    spent,
                    limit: savedLimit,
                    percent_used: percent,
                },
            };
        });
    }

    const tripToShow = activeTrip;

    useEffect(() => {
        loadDashboardData().catch(() => setDashboardData(null));
    }, []);

    return (
        <div className="dashboard-layout">
            <div className="menu-content">
                <Menu
                    events={dashboardData?.events?.items || []}
                    onEventCreated={handleEventCreated}
                />
            </div>

            <div className="flex-grow-1">
                <Navbar />
                <div className="dashboard-header">
                    <h1 className="custom-title">
                        {dashboardData?.selected_car?.display_name || "Nincs autó kiválasztva"}
                    </h1>
                </div>

                <div className="container-fluid">
                    <div className="row g-4">
                        <div className="col-xl-4 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap justify-content-center">
                                        {tripToShow ? (
                                            <Trip
                                                tripData={tripToShow}
                                                onCancelFinish={handleCancelTripFinish}
                                                onSaveFinish={handleSaveTripFinish}
                                                onRuntimeChange={(runtime) => {
                                                    setAndPersistActiveTrip((prev) => {
                                                        if (!prev) return prev;
                                                        return {
                                                            ...prev,
                                                            runtime,
                                                        };
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <TripInfo />
                                        )}
                                    </div>
                                    {!tripToShow && (
                                        <div className="card-btn">
                                            <Button text={"Új út"} onClick={() => setShowNewTrip(true)} />
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>

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
                                    <div className="card-btn">
                                        <Button text={"Új tankolás"} onClick={() => setShowNewFuel(true)} />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {showNewFuel && (
                    <NewFuel
                        onClose={() => setShowNewFuel(false)}
                        onSave={handleSaveFuel}
                    />
                )}

                {showNewTrip && (
                    <NewTrip
                        onClose={() => setShowNewTrip(false)}
                        avgConsumption={dashboardData?.selected_car?.average_consumption}
                        onStart={(newTrip) => {
                            const withRuntime = {
                                ...newTrip,
                                runtime: {
                                    isRunning: true,
                                    elapsedBeforeRunSec: 0,
                                    lastStartedAtMs: Date.now(),
                                    showFinishResult: false,
                                    actualArrival: null,
                                },
                            };
                            setAndPersistActiveTrip(withRuntime);
                        }}
                    />
                )}
            </div>
        </div>
    );
}


