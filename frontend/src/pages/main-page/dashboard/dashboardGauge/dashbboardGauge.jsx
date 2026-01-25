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
                    currentFt={"12500"}
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
                    <table className="justify-content-center align-items-center">
                        <thead>
                            <tr className="current-km-div">
                                <th colSpan={2}><p>DB 123 456 km</p></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className="odd"><p>Becsült hatótáv</p></th>
                                <td className="odd"><Link to={"/muszerfal/atlagfogyasztas"}><p className="test-p">Kattintson ide a</p></Link></td>
                            </tr>

                            <tr>
                                <th className="even"><p>Átlagos fogyasztás</p></th>
                                <td className="even"><Link to={"/muszerfal/atlagfogyasztas"}><p className="test-p">teszt elvégzéséhez</p></Link></td>
                            </tr>

                            <tr>
                                <th className="odd text-center"><p>API</p></th>
                                <td className="odd text-center"><p>API</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}