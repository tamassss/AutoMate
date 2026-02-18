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
        <div className="w-100">
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

            <div className="screen d-flex flex-column align-items-center w-100">
                <div className="screen-div w-100">
                    <table className="dg-table justify-content-center align-items-center w-100">
                        <thead>
                            <tr className="table-title-tr">
                                <th colSpan={2}>
                                    <p className="field">
                                        Átlagos fogyasztás
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="odd field cons-th">
                                    <p>
                                        {hasAverageConsumption
                                            ? `${selectedCar.average_consumption} l/100km`
                                            : (
                                                "?"
                                            )}
                                    </p>
                                </th>
                                <td className="even field test-td">
                                    <Link to={"/muszerfal/atlagfogyasztas"}>
                                        <p className="test-p">Teszt</p>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


