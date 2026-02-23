import Navbar from "../../../../components/navbar/navbar";
import "./tripsAndFuels.css";
import { useEffect, useState } from "react";
import Trips from "./trips/trips";
import Fuels from "./fuels/fuels";
import { getRoutes } from "../../../../actions/routes/routeActions";
import { getFuelings } from "../../../../actions/fuelings/fuelingActions";
import Menu from "../../dashboard/menu/menu";
import "../menuLayout.css";

export default function TripsAndFuels() {
    const [showTrips, setShowTrips] = useState(true);
    const [trips, setTrips] = useState([]);
    const [fuelGroups, setFuelGroups] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            setError("");
            try {
                const [routesData, fuelingsData] = await Promise.all([
                    getRoutes(),
                    getFuelings(),
                ]);
                setTrips(routesData);
                setFuelGroups(fuelingsData);
            } catch (err) {
                setError(err.message || "Nem sikerült betölteni az adatokat.");
            }
        }

        loadData();
    }, []);

    function handleDeletedFuel(deletedFuelId) {
        setFuelGroups((prev) =>
            prev
                .map((group) => ({
                    ...group,
                    items: (group.items || []).filter((item) => item.id !== deletedFuelId),
                }))
                .filter((group) => (group.items || []).length > 0)
        );
    }

    function handleUpdatedFuel(updatedFuel) {
        if (!updatedFuel?.id) return;

        setFuelGroups((prev) =>
            prev.map((group) => ({
                ...group,
                items: (group.items || []).map((item) =>
                    item.id === updatedFuel.id ? { ...item, ...updatedFuel } : item
                ),
            }))
        );
    }

    function handleDeletedTrip(deletedTripId) {
        setTrips((prev) => prev.filter((trip) => trip.id !== deletedTripId));
    }

    return (
        <div className="main-menu-layout">
            <div className="main-menu-content">
                <Menu />
            </div>

            <div className="flex-grow-1">
                <Navbar />
                <div>
                    <div className="container-fluid p-0 tf-nav-tabs">
                        <div className="row g-0">
                            <div
                                className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "active" : "inactive"}`}
                                onClick={() => setShowTrips(true)}
                            >
                                <p className="fs-5">Utak</p>
                            </div>
                            <div
                                className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "inactive" : "active"}`}
                                onClick={() => setShowTrips(false)}
                            >
                                <p className="fs-5">Tankolások</p>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-4">
                        {error && <p className="text-danger">{error}</p>}
                        {showTrips ? (
                            <Trips trips={trips} onDeletedTrip={handleDeletedTrip} />
                        ) : (
                            <Fuels
                                fuelGroups={fuelGroups}
                                onDeletedFuel={handleDeletedFuel}
                                onUpdatedFuel={handleUpdatedFuel}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



