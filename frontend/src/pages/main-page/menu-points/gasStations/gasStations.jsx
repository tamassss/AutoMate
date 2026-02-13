import Navbar from "../../../../components/navbar/navbar"
import "./gasStations.css"
import GasStationCard from "../../../../components/gas-station-card/gasStationCard"
import { useEffect, useState } from "react"
import { getGasStations } from "../../../../actions/gasStations"

export default function GasStations(){
    const [stations, setStations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getGasStations()
            .then(setStations)
            .catch((err) => setError(err.message || "Nem sikerült betölteni a benzinkutakat."));
    }, []);

    return(
        <>
            <Navbar />

            <div className="container mt-4">
                {error && <p className="text-danger">{error}</p>}
                {stations.length === 0 && !error && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
                        <p className="fs-4">Még nincsenek rögzített benzinkút adatok.</p>
                    </div>
                )}
                <div className="row g-4 justify-content-center">
                    {stations.map(station => (
                        <div key={station.id} className="col-11 col-md-6 col-lg-4 d-flex justify-content-center">
                            <GasStationCard station={station} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}



