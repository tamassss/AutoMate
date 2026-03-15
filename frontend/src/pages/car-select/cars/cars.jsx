import { useState } from "react"
import { Link } from "react-router-dom"

import Navbar from "../../../components/navbar/navbar"
import Button from "../../../components/button/button"
import EditCar from "../../../modals/editCar/editCar"
import AddCar from "../../../modals/addCar/addCar"
import CarSelect from "../carSelect/carSelect"
import Settings from "../../../modals/settings/settings"

import "./cars.css"

export default function Cars() {
    const fullName = localStorage.getItem("full_name") || "Felhasználó";

    //modal
    const [showAddCar, setShowAddCar] = useState(false);
    const [showEditCar, setShowEditCar] = useState(false);
    const [showSetting, setShowSettings] = useState(false);

    const [selectedCar, setSelectedCar] = useState(null)

    //oldal frissítő
    const [refreshKey, setRefreshKey] = useState(0)
    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <>
            <Navbar />

            {showSetting && <Settings onClose={() => setShowSettings(false)} />}

            <h1 className="title fs-1 mt-3">{fullName}</h1>
            <h2 className="subtitle fw-4 opacity-75">garázsa</h2>
            
            <div className="my-4">
                <CarSelect refreshKey={refreshKey} onCarChange={setSelectedCar} />
            </div>
            
            <div className="justify-content-center g-3 cars-buttons">
                <div className="col-12 col-sm-auto">
                    <Button
                        text="Módosítás"
                        onClick={() => setShowEditCar(true)}
                        disabled={!selectedCar}
                        className={!selectedCar ? "unavailable" : ""}
                    />
                </div>

                <div className="col-12 col-sm-auto">
                    <Button
                        text="Új autó"
                        onClick={() => setShowAddCar(true)}
                    />
                </div>
            </div>

            {showEditCar && (
                <EditCar 
                    onClose={() => setShowEditCar(false)}
                    onSave={triggerRefresh}
                    selectedCar={selectedCar}
                />
            )}

            {showAddCar && (
                <AddCar 
                    onClose={() => setShowAddCar(false)}
                    onSave={triggerRefresh}
                />
            )}
        </>
    )
}