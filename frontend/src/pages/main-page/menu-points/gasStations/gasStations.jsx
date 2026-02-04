import Navbar from "../../../../components/navbar/navbar"
import "./gasStations.css"
import backIcon from "../../../../assets/icons/back.png"
import { useNavigate } from "react-router-dom"
import GasStationCard from "../../../../components/gas-station-card/gasStationCard"

export default function GasStations(){
    const navigate = useNavigate();

    // Példa adatok
    const staticStations = [
        { id: 1, datum: "2025.02.25",helyseg: "Mogyoród", cim: "Hungaroring"},
        { id: 2, datum: "2025.02.23",helyseg: "Diósd", cim: "Balatoni út 11."}
    ];

    return(
        <>
            <Navbar
                leftIcon={backIcon}
                onLeftClick={() => navigate("/muszerfal")}
            />

            <div className="container mt-4">
                <div className="row g-4 justify-content-center">
                    {staticStations.map(station => (
                        <div key={station.id} className="col-11 col-md-6 col-lg-4 d-flex justify-content-center">
                            <GasStationCard station={station} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}