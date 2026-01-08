import { Link, useNavigate } from "react-router-dom"

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

            <div className="dashboard-content">
                <Navbar rightIcon={exitIcon} altRight={"Kilépés"} onRightClick={() => navigate("/")} leftIcon={backIcon} altLeft={"Vissza az autókhoz"} onLeftClick={() => navigate("/autok")}/>

                <h1 className="title">AUTÓ NEVE</h1>
                <h2 className="subtitle">ÉVJÁRAT, LE</h2>

                <DashboardGauge/>

                <Button 
                    text={"Új tankolás"}
                    onClick={() => setShowNewFuel(true)}
                />

                {showNewFuel && (
                    <NewFuel onClose={() => setShowNewFuel(false)}/>
                )}

                <Trip/>
                <Button 
                    text={"Új út"}
                    onClick={() => setShowNewTrip(true)}
                />

                {showNewTrip && (
                    <NewTrip onClose={() => setShowNewTrip(false)}/>
                )}
            </div>
            
            

            
        </div>
    )
}