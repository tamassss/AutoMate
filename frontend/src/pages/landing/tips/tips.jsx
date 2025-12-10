import "./tips.css"

import { Link } from "react-router-dom"

export default function Tips(){
    return(
        <>
            <div>
                <Link to="./dashboardLights">
                    <img src="../../assets/placeholder.jpg" alt="Műszerfal jelzések"/>
                    <p>Műszerfal jelzések</p>
                </Link>
            </div>

            <div>
                <Link to="./fuelSaving">
                    <img src="../../assets/placeholder.jpg" alt="Üzemanyag Spórolás"/>
                    <p>Üzemanyag spórolás</p>
                </Link>
            </div>

            <div>
                <Link to="./parkingHelp">
                    <img src="../../assets/placeholder.jpg" alt="Parkolási tippek"/>
                    <p>Parkolási tippek</p>
                </Link>
            </div>
        </>
    )
}