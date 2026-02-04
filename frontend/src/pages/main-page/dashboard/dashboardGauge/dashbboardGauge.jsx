import Card from "../../../../components/card/card"
import Button from "../../../../components/button/button"
import "./dashboardGauge.css"
import { useState } from "react"
import EditLimit from "../../../../modals/editLimit/editLimit"
import { Link } from "react-router-dom"
import BudgetLimit from "../budgetLimit/budgetLimit"


export default function DashboardGauge(){
    const [showLimit, setShowLimit] = useState(false);

    return(
        <div>
            <div className="limit d-flex flex-column align-items-center">
                <BudgetLimit
                    currentFt={"32500"}
                    limitFt={"50000"}
                />

                

                <div className="limit-btn-wrapper">
                    <Button
                        text={"limit"}
                        onClick={() => setShowLimit(true)}
                    />
                </div>
                
                {showLimit && (
                    <EditLimit onClose={() => setShowLimit(false)}/>
                )}
            </div>

            <hr className="mb-5"/>

            <div className="screen d-flex flex-column align-items-center">
                <div className="screen-div">
                    <table className="dg-table justify-content-center align-items-center">
                        <thead>
                            <tr className="current-km-div">
                                <th colSpan={2}><p className="field">DB 123 456 km</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="odd field"><p>Becsült hatótáv</p></th>
                                <td className="odd field"><Link to={"/muszerfal/atlagfogyasztas"}><p className="test-p field">Kattintson ide a</p></Link></td>
                            </tr>

                            <tr>
                                <th className="even field">Átlagos fogyasztás</th>
                                <td className="even field"><Link to={"/muszerfal/atlagfogyasztas"}><p className="test-p field">teszt elvégzéséhez</p></Link></td>
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
    )
}