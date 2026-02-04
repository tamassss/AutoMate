import Navbar from "../../../../components/navbar/navbar"
import "./tripsAndFuels.css"
import { useNavigate } from "react-router-dom"
import backIcon from "../../../../assets/icons/back.png"
import { useState } from "react"
import Trips from "./trips/trips"
import Fuels from "./fuels/fuels"


export default function TripsAndFuels(){
    const navigate = useNavigate();
    const [showTrips, setShowTrips] = useState(true);

    // Statikus adatok
    const staticTrips = [
        { id: 1, honnan: "Göd", hova: "Mogyoród", datum: "2025. 10. 24.", kezdes: "15:13", vege: "15:31", javitas: 2, tavolsag: 16, tankolas_szam: 1, koltseg: 2850 },
        { id: 2, honnan: "Mogyoród", hova: "Budapest", datum: "2025. 10. 24.", kezdes: "16:24", vege: "16:58", javitas: -3, tavolsag: 24, tankolas_szam: 0, koltseg: 0 },
        { id: 3, honnan: "Budapest", hova: "Szigetszentmiklós", datum: "2025. 10. 24.", kezdes: "17:42", vege: "18:07", javitas: 5, tavolsag: 23, tankolas_szam: 1, koltseg: 4200 },
        { id: 4, honnan: "Szigetszentmiklós", hova: "Göd", datum: "2025. 10. 24.", kezdes: "19:11", vege: "20:07", javitas: 8, tavolsag: 71, tankolas_szam: 1, koltseg: 5500 }
    ];

    const staticFuels = [
        { id: 1, datum: "2025. 10. 20.", mennyiseg: 45, literft: 630, kmallas: "123 789" },
        { id: 2, datum: "2025. 10. 05.", mennyiseg: 25, literft: 640, kmallas: "123 678" },
        { id: 3, datum: "2025. 09. 15.", mennyiseg: 30, literft: 620, kmallas: "123 456" }
    ];

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
            <div>
                <div className="container-fluid p-0 tf-nav-tabs">
                    <div className="row g-0">
                        <div className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "active" : "inactive"}`}
                             onClick={() => setShowTrips(true)}>
                            <p className="fs-5">Utak</p>
                        </div>
                        <div className={`col-6 d-flex justify-content-center align-items-center tf-nav-tab ${showTrips ? "inactive" : "active"}`}
                             onClick={() => setShowTrips(false)}>
                            <p className="fs-5">Tankolások</p>
                        </div>
                    </div>
                </div>

                <div className="container mt-4">
                    {showTrips ? (
                        <Trips trips={staticTrips} />
                    ) : (
                        <Fuels fuels={staticFuels} />
                    )}
                </div>
            </div>
        </>
    )
}