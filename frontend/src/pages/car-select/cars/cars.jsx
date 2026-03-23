import { useState } from "react";

import Navbar from "../../../components/navbar/navbar";
import Button from "../../../components/button/button";
import EditCar from "../../../modals/editCar/editCar";
import AddCar from "../../../modals/addCar/addCar";
import DeleteCar from "../../../modals/deleteCar/deleteCar";
import CarSelect from "../carSelect/carSelect";
import Settings from "../../../modals/settings/settings";

import "./cars.css";

export default function Cars() {
  const fullName = localStorage.getItem("full_name") || "Felhasználó";

  // Modal állapotok
  const [showAddCar, setShowAddCar] = useState(false);
  const [showEditCar, setShowEditCar] = useState(false);
  const [showDeleteCar, setShowDeleteCar] = useState(false);
  const [showSetting, setShowSettings] = useState(false);

  // Adatok
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteTargetCar, setDeleteTargetCar] = useState(null);

  // Frissítés
  const [refreshKey, setRefreshKey] = useState(0);

  function triggerRefresh() {
    setRefreshKey(function(prev) {
      return prev + 1;
    });
  }

  return (
    <>
      <Navbar />

      {/* Beállítások */}
      {showSetting && (
        <Settings 
          onClose={function() {
            setShowSettings(false);
          }} 
        />
      )}

      <h1 className="title fs-1 mt-3">{fullName}</h1>
      <h2 className="subtitle fw-4 opacity-75">garázsa</h2>

      <div className="my-4">
        {/* Autó választó */}
        <CarSelect 
          refreshKey={refreshKey} 
          onCarChange={setSelectedCar} 
        />
      </div>

      <div className="cars-buttons">
        <div className="cars-button-item">
          <Button
            text="Módosítás"
            onClick={function() {
              setShowEditCar(true);
            }}
            disabled={!selectedCar}
            className={!selectedCar ? "unavailable" : ""}
          />
        </div>

        <div className="cars-button-item">
          <Button 
            text="Új autó" 
            onClick={function() {
              setShowAddCar(true);
            }} 
          />
        </div>

        <div className="cars-button-item">
          <Button
            text="Autó törlése"
            onClick={function() {
              setDeleteTargetCar(selectedCar);
              setShowDeleteCar(true);
            }}
            disabled={!selectedCar}
            className={!selectedCar ? "unavailable" : ""}
          />
        </div>
      </div>

      {/* Autó szerkesztése */}
      {showEditCar && (
        <EditCar 
          onClose={function() {
            setShowEditCar(false);
          }} 
          onSave={triggerRefresh} 
          selectedCar={selectedCar} 
        />
      )}

      {/* Új autó hozzáadása */}
      {showAddCar && (
        <AddCar 
          onClose={function() {
            setShowAddCar(false);
          }} 
          onSave={triggerRefresh} 
        />
      )}

      {/* Autó törlése */}
      {showDeleteCar && deleteTargetCar && (
        <DeleteCar
          onClose={function() {
            setShowDeleteCar(false);
            setDeleteTargetCar(null);
          }}
          onDeleted={function() {
            setSelectedCar(null);
            triggerRefresh();
          }}
          carId={deleteTargetCar.car_id}
          displayName={deleteTargetCar.display_name}
          licensePlate={deleteTargetCar.license_plate}
        />
      )}
    </>
  );
}
