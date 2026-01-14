import { Link, useNavigate } from "react-router-dom"

import Card from "../../../components/card/card"
import Button from "../../../components/button/button"
import Navbar from "../../../components/navbar/navbar"
import DashboardGauge from "./dashboardGauge/dashbboardGauge"
import Menu from "./menu/menu"
import Trip from "./trip/trip"

import NewTrip from "./newTrip/newTrip"

import backIcon from "../../../assets/icons/back.png"
import exitIcon from "../../../assets/icons/exit.png"

import "./dashboard.css"
import { useState } from "react"
import NewFuel from "./newFuel/newFuel"

export default function Dashboard(){
    const [showNewFuel, setShowNewFuel] = useState(false)
    const [showNewTrip, setShowNewTrip] = useState(false)

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

                    <h1 className="custom-title">AUTÓ NEVE</h1>
                

                <div className="container-fluid">
                    <div className="row g-4">
                        <div className="col-lg-6 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap">
                                        <DashboardGauge/>
                                    </div>
                                </Card>
                            </div>
                            
                            <div className="dashboard-button">
                                <Button 
                                    text={"Új tankolás"}
                                    onClick={() => setShowNewFuel(true)}
                                />
                            </div>
                        </div>

                        <div className="col-lg-6 col-12">
                            <div className="fixed-height-card mb-3">
                                <Card>
                                    <div className="card-content-wrap">
                                        <Trip/>
                                    </div>
                                </Card>
                            </div>
                            
                            <div className="dashboard-button">
                            <Button 
                                text={"Új út"}
                                onClick={() => setShowNewTrip(true)}
                            />
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