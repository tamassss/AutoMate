import Card from "../../../../components/card/card"
import Button from "../../../../components/button/button"

import indicatorImage from "../../../../assets/indicator.png"

import "./dashboardGauge.css"


export default function DashboardGauge(){
    return(
        <Card>
            <div className="limit">
                <img src={indicatorImage} alt="limit mutató"/>
                <Button text={"limit"}/>
                <div>
                    <p> KILOMÉTERÓRA ÁLLÁS</p>
                </div>
                <div className="avg-consumption-div">
                    <h3>Átlagos fogyasztás</h3>
                </div>
            </div>
        </Card>
    )
}