import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"

import helpIcon from "../../assets/icons/help.png"
import backIcon from "../../assets/icons/back.png"
import exitIcon from "../../assets/icons//exit.png"
import settingsIcon from "../../assets/icons/settings.png"

import SuccessModal from "../success-modal/successModal"
import Settings from "../../modals/settings/settings"

import "./navbar.css"

export default function Navbar(){
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const isCarsPage = location.pathname === "/autok";

    function goToHomeBySelectedCar() {
        const selectedCarId = localStorage.getItem("selected_car_id");
        if (selectedCarId && selectedCarId !== "default") {
            navigate("/muszerfal");
            return;
        }

        navigate("/");
    }

    
    function logout(){
        localStorage.clear()
        setShowLogoutSuccess(true)
    }

    return(
        <>
            <nav className="custom-navbar">
                {isCarsPage && (
                    <div className="settings-div" onClick={() => setShowSettings(true)}>
                        <img className="settings-icon" src={settingsIcon} alt="Beállítások" />
                    </div>
                )}

                <div className={"nav-icons-div"} onClick={() => navigate(-1)}>
                    <img className={"nav-icons"} src={backIcon} alt={"Vissza"} />
                </div>

                <div className="nav-title-div">
                    <p className="brand" onClick={goToHomeBySelectedCar}>
                        Auto<span className="mate-span">Mate</span>
                    </p>
                </div>

                <div className={"nav-icons-div"} onClick={logout}>
                    <img className={"nav-icons"} src={exitIcon} alt={"Kilépés"}/>
                </div>

                <div className="help-div">
                    <Link to="/tippek" className="help-link">
                        <img src={helpIcon} alt="Segítség kezdőknek" title="Segítség kezdőknek"/>
                    </Link>
                </div>
            </nav>

            {showLogoutSuccess && (
                <SuccessModal
                    onClose={() => {
                        setShowLogoutSuccess(false)
                        navigate("/")
                    }}
                    title={"Siker!"}
                    description={"Sikeresen kijelentkeztél!"}
                />
            )}

            {showSettings && (
                <Settings onClose={() => setShowSettings(false)} />
            )}
        </>
    )
}
