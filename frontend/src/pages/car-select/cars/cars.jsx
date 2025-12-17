import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Navbar from "../../../components/navbar/navbar"
import Button from "../../../components/button/button"
import EditCar from "../editCar/editCar"
import AddCar from "../addCar/addCar"
import CarSelect from "../carSelect/carSelect"

import settingsIcon from "../../../assets/icons/settings.png"
import exitIcon from "../../../assets/icons/exit.png"

import "./cars.css"
import Settings from "../settings/settings"

export default function Cars(){
    const navigate = useNavigate();

    const [showAddCar, setShowAddCar] = useState(false);
    const [showEditCar, setShowEditCar] = useState(false);
    const [showSetting, setShowSettings] = useState(false);
    

    return(
        <>
            <Navbar 
                leftIcon={settingsIcon} 
                altLeft={"Beállítások"}
                onLeftClick={() => setShowSettings(true)}
                rightIcon={exitIcon}
                altRight={"Kilépés"}
                onRightClick={() => navigate("/")} 
            />

            {showSetting && (
                <Settings onClose={() => setShowSettings(false)}/>
            )}

            <h1>KERESZTNÉV autói</h1>

            <CarSelect/>

            {/* Módosítás gomb */}
            <Button
            text={"Módosítás"}
            onClick={() => setShowEditCar(true)}/>

            {showEditCar && (
                <EditCar onClose={() => setShowEditCar(false)}/>
            )}

            {/* Új autó gomb */}
            <Button
            text={"Új autó"}
            onClick={() => setShowAddCar(true)}/>

            {showAddCar && (
                <AddCar onClose={() => setShowAddCar(false)}/>
            )}


            
        </>
    )
}