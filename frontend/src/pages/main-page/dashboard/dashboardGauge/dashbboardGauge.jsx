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
        <Card>
            <div className="limit">
                <img src={indicatorImage} alt="limit mutató"/>

                <Button
                    text={"limit"}
                    onClick={() => setShowLimit(true)}/>
                
                {showLimit && (
                    <EditLimit onClose={() => setShowLimit(false)}/>
                )}

                <div>
                    <p> KILOMÉTERÓRA ÁLLÁS</p>
                </div>
                <Link to={"/muszerfal/atlagfogyasztas"}>
                    <div className="avg-consumption-div">
                        <h3>Átlagos fogyasztás</h3>
                    </div>
                </Link>
            </div>
        </Card>
    )
}