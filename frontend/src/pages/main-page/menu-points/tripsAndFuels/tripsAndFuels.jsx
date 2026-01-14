import Navbar from "../../../../components/navbar/navbar"
import "./tripsAndFuels.css"

import { useNavigate } from "react-router-dom"

import backIcon from "../../../../assets/icons/back.png"

import { Link } from "react-router-dom"
import { useState } from "react"

export default function TripsAndFuels(){
    const navigate = useNavigate();

    const [showTrips, setShowTrips] = useState(true);
    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
            <div>
                <div className="container-fluid p-0 tf-nav-tabs">
                    <div className="row g-0">
                        <div className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "active" : "inactive"}`}
                             onClick={() =>setShowTrips(true)}>
                            <p className="fs-5">Utak</p>
                        </div>
                        <div className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "inactive" : "active"}`}
                             onClick={() =>setShowTrips(false)}>
                            <p className="fs-5">Benzinkutak</p>
                        </div>
                    </div>
                </div>

                <div 
                    className="container d-flex justify-content-center align-items-center" 
                    style={{ height: "550px" }}
                >
                    {showTrips ? (
                        <p className="fs-5">Még nincsenek rögzített Utak.</p>
                    ) : (
                        <p className="fs-5">Még nincsenek rögzített Benzinkutak.</p>
                    )}
                </div>
            </div>
            
        </>
    )
}