import Card from "../card/card";
import Button from "../../components/button/button";
import molLogo from "../../assets/icons/molLogo.png";
import fuel95Icon from "../../assets/icons/fuel95.png";

import "./gasStationCard.css"
import { useState } from "react";
import DeleteGasStation from "../../modals/deleteGasStation/deleteGasStation";
import EditGasStation from "../../modals/editGasStation/editGasStation";

export default function GasStationCard({ station, onDeleted, onUpdated }) {
    const [showEditGasStation, setShowEditGasStation] = useState(false);
    const[showDeleteGasStation, setShowDeleteGasStation] = useState(false);
    const priceText = station?.literft ? `${station.literft.toFixed(1)} Ft` : "-";

    return (
        <Card>
            <div style={{ color: "white" }}>
                <div className="date-header text-center p-3" >
                    <p className="date-text" style={{color:"#4CAF50"}}>
                        {station.datum}
                    </p>
                </div>

                <div className="p-1">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <img src={molLogo} alt="MOL" className="station-icon"/>
                        <h2 className="price">{priceText}</h2>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <img src={fuel95Icon} alt="95" className="fuel-icon"/>
                        <div className="text-start">
                            <h4 className="m-0 station-city">{station.helyseg}</h4>
                            <p className="m-0 text-secondary station-address">{station.cim}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 ">
                        <div className="fuel-button">
                            <Button 
                                text="Módosítás"
                                onClick={() => setShowEditGasStation(true)}
                            />
                        </div>
                        <div className="fuel-button">
                            <Button 
                                text="Törlés"
                                onClick={() => setShowDeleteGasStation(true)}
                            />
                        </div>
                    </div>
                </div>

                {showDeleteGasStation && (
                    <DeleteGasStation
                        onClose={() => setShowDeleteGasStation(false)}
                        onDeleted={onDeleted}
                        gasStationId={station?.gasStationId}
                        helyseg={station?.helyseg || "-"}
                        cim={station?.cim || "-"}
                    />
                )}

                {showEditGasStation && (
                    <EditGasStation
                        onClose={() => setShowEditGasStation(false)}
                        selectedStation={station}
                        onSave={(updatedStation) => onUpdated?.(updatedStation)}
                    />
                )}

            </div>
        </Card>
    );
}
