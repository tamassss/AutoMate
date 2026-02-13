import Button from "../../../../components/button/button";
import "./dashboardGauge.css";
import { useState } from "react";
import EditLimit from "../../../../modals/editLimit/editLimit";
import { Link } from "react-router-dom";
import BudgetLimit from "../budgetLimit/budgetLimit";

export default function DashboardGauge({ selectedCar, monthlyBudget, onSaveLimit }) {
    const [showLimit, setShowLimit] = useState(false);
    const hasAverageConsumption =
        selectedCar?.average_consumption !== null &&
        selectedCar?.average_consumption !== undefined &&
        selectedCar?.average_consumption !== "";

    return (
        <div>
            <div className="limit d-flex flex-column align-items-center">
                <BudgetLimit
                    spent={monthlyBudget?.spent || 0}
                    limit={monthlyBudget?.limit || 0}
                />

                <div className="limit-btn-wrapper">
                    <Button
                        text={"limit"}
                        onClick={() => setShowLimit(true)}
                    />
                </div>

                {showLimit && (
                    <EditLimit
                        onClose={() => setShowLimit(false)}
                        onSave={onSaveLimit}
                        initialLimit={monthlyBudget?.limit || 0}
                    />
                )}
            </div>

            <hr className="mb-5" />

            <div className="screen d-flex flex-column align-items-center">
                <div className="screen-div">
                    <table className="dg-table justify-content-center align-items-center">
                        <thead>
                            <tr className="current-km-div">
                                <th colSpan={2}>
                                    <p className="field">
                                        {selectedCar?.odometer_km != null
                                            ? `${selectedCar.odometer_km} km`
                                            : "Nincs megadva km"}
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="odd field"><p>Becsult hatotav</p></th>
                                <td className="even field">
                                    {hasAverageConsumption
                                        ? `${selectedCar.average_consumption} l/100km`
                                        : (
                                            <Link to={"/muszerfal/atlagfogyasztas"}>
                                                <p>Atlagfogyasztas teszt</p>
                                            </Link>
                                        )}
                                </td>
                            </tr>

                            <tr>
                                <th className="even field">Átlagos fogyasztás</th>
                                <td className="even field">
                                    {hasAverageConsumption
                                        ? `${selectedCar.average_consumption} l/100km`
                                        : (
                                            <Link to={"/muszerfal/atlagfogyasztas"}>
                                                <p>Atlagfogyasztas teszt</p>
                                            </Link>
                                        )}
                                </td>
                            </tr>

                            <tr>
                                <th className="odd text-center field"><p>API</p></th>
                                <td className="odd text-center field"><p>API</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


