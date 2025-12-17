import { Link, useNavigate } from "react-router-dom"

import Button from "../../../components/button/button"
import Navbar from "../../../components/navbar/navbar"
import DashboardGauge from "./dashboardGauge/dashbboardGauge"
import Menu from "./menu/menu"
import Trip from "./trip/trip"

import backIcon from "../../../assets/icons/back.png"
import exitIcon from "../../../assets/icons/exit.png"

import "./dashboard.css"

export default function Dashboard(){
    const navigate = useNavigate();
    return(
        <>
            <Navbar rightIcon={exitIcon} altRight={"Kilépés"} onRightClick={() => navigate("/")} leftIcon={backIcon} altLeft={"Vissza az autókhoz"} onLeftClick={() => navigate("/autok")}/>
            <h1>AUTÓ NEVE</h1>
            <h2>ÉVJÁRAT, LE</h2>
            <Menu/>

            <DashboardGauge/>
            <Button text={"Új tankolás"}/>

            <Trip/>
            <Button text={"Új út"}/>

            
        </>
    )
}