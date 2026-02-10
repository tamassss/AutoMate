import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCars } from "../../../actions/cars"

import Navbar from "../../../components/navbar/navbar"
import Button from "../../../components/button/button"
import EditCar from "../../../modals/editCar/editCar"
import AddCar from "../../../modals/addCar/addCar"
import CarSelect from "../carSelect/carSelect"

import settingsIcon from "../../../assets/icons/settings.png"
import exitIcon from "../../../assets/icons/exit.png"

import "./cars.css"
import Settings from "../../../modals/settings/settings"

export default function Cars(){
    const cars = getCars();
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

            <h1 className="title fs-1 mt-3">/////////////////////////////////////////////////////////////////////////////////////////////////////////////</h1>
            <h2 className="subtitle fw-4 opacity-75">autói</h2>
            
            <div className="my-4">
                <CarSelect/>
            </div>
            
            <div className="justify-content-center g-3 cars-buttons">

                <div className="col-12 col-sm-auto">
                    <Button
                        text={"Módosítás"}
                        onClick={() => setShowEditCar(true)}
                    />
                </div>

                    
                <div className="col-12 col-sm-auto">
                    <Button
                        text={"Új autó"}
                        onClick={() => setShowAddCar(true)}
                    />
                </div>
                    
            </div>

            {showEditCar && (
                <EditCar onClose={() => setShowEditCar(false)}/>
            )}

            {showAddCar && (
                <AddCar onClose={() => setShowAddCar(false)}/>
            )}
            
        </>
    )
}