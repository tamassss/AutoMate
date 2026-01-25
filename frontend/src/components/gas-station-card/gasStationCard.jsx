import Card from "../card/card";
import Button from "../../components/button/button";
import molLogo from "../../assets/icons/molLogo.png";
import fuel95Icon from "../../assets/icons/fuel95.png";

import "./gasStationCard.css"

export default function GasStationCard({ station }) {
    return (
        <Card>
            <div style={{ color: "white" }}>
                <div className="date-header text-center p-3" >
                    <p className="date-text" style={{color:"#4CAF50"}}>
                        {station.datum}
                    </p>
                </div>

                <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <img src={molLogo} alt="MOL" className="station-icon"/>
                        <h2 className="price">573.0 Ft</h2>
                    </div>

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <img src={fuel95Icon} alt="95" className="fuel-icon"/>
                        <div className="text-start">
                            <h4 className="m-0 station-city">{station.helyseg}</h4>
                            <p className="m-0 text-secondary station-address">{station.cim}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            text="Módosítás"
                        />
                        
                        <Button 
                            text="Törlés"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}