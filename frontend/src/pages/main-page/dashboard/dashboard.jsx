import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Card from "../../../components/card/card"
import Button from "../../../components/button/button"
import Navbar from "../../../components/navbar/navbar"
import DashboardGauge from "./dashboardGauge/dashbboardGauge"
import Menu from "./menu/menu"
import Trip from "./trip/trip"
import Fuel from "./fuel/fuel"
import TripInfo from "./tripInfo/tripInfo"
import FuelInfo from "./fuelInfo/fuelInfo"

import NewTrip from "../../../modals/newTrip/newTrip"
import NewFuel from "../../../modals/newFuel/newFuel"

import backIcon from "../../../assets/icons/back.png"
import exitIcon from "../../../assets/icons/exit.png"

import "./dashboard.css"


export default function Dashboard(){
    const [showNewFuel, setShowNewFuel] = useState(false)
    const [showNewTrip, setShowNewTrip] = useState(false)

    const [hasFuels, setHasFuels] = useState(true)
    const [ongoingTrip, setOngoingTrip] = useState(true)

    const navigate = useNavigate();

    return(
        <div className="dashboard-layout">

            <div className="menu-content">
                <Menu/>
            </div>

            <div className="flex-grow-1">
                <Navbar 
                    rightIcon={exitIcon} 
                    altRight={"Kilépés"} 
                    onRightClick={() => navigate("/")} 
                    leftIcon={backIcon} 
                    altLeft={"Vissza az autókhoz"} 
                    onLeftClick={() => navigate("/autok")}
                />
                <div className="dashboard-header">
                    <h1 className="custom-title">AUTÓ NEVE</h1>
                </div>
                
                <div className="container-fluid">
                    <div className="row g-4">

                        <div className="col-xl-4 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap justify-content-center">
                                        {ongoingTrip ? <Trip/> : <TripInfo/>}
                                    </div>
                                    {!ongoingTrip && (
                                        <div className="card-btn">
                                            <Button text={"új út"} onClick={() => setShowNewTrip(true)}/>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>

                        <div className="col-xl-4 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap justify-content-center">
                                        <DashboardGauge/>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        


                        <div className="col-xl-4 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap justify-content-center">
                                        {hasFuels ? <Fuel/> : <FuelInfo/>}
                                    </div>
                                    <div className="card-btn">
                                        <Button text={"új tankolás"} onClick={() => setShowNewFuel(true)}/>
                                    </div>
                                </Card>
                            </div>
                            
                        </div>

                        

                    </div>
                </div>
                
                {showNewFuel && (
                    <NewFuel onClose={() => setShowNewFuel(false)}/>
                )}

                {showNewTrip && (
                    <NewTrip onClose={() => setShowNewTrip(false)}/>
                )}
            </div>
            
            

            
        </div>
    )
}