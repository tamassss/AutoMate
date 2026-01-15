import Card from "../../../../components/card/card"
import Button from "../../../../components/button/button"

import indicatorImage from "../../../../assets/indicator.png"

import "./dashboardGauge.css"
import { useState } from "react"
import EditLimit from "../editLimit/editLimit"
import { Link } from "react-router-dom"


export default function DashboardGauge(){
    const [showLimit, setShowLimit] = useState(false);

    return(
        <div>
            <div className="limit">
                <img src={indicatorImage} alt="limit mutató"  className="gauge-img"/>

                <Button
                    text={"limit"}
                    onClick={() => setShowLimit(true)}/>
                
                {showLimit && (
                    <EditLimit onClose={() => setShowLimit(false)}/>
                )}
            </div>

            <div>
                <p> KILOMÉTERÓRA ÁLLÁS</p>
                <Link to={"/muszerfal/atlagfogyasztas"}>
                    <div className="avg-consumption-div">
                        <h3>Átlagos fogyasztás</h3>
                    </div>
                </Link>
            </div>
        </div>
    )
}