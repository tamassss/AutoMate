import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import helpIcon from "../../assets/icons/help.png"
import backIcon from "../../assets/icons/back.png"
import exitIcon from "../../assets/icons//exit.png"

import SuccessModal from "../success-modal/successModal"

import "./navbar.css"

export default function Navbar(){
    const navigate = useNavigate();
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    
    function logout(){
        localStorage.clear()
        setShowLogoutSuccess(true)
    }

    return(
        <>
            <nav className="custom-navbar">
                <div className={"nav-icons-div"} onClick={() => navigate(-1)}>
                    <img className={"nav-icons"} src={backIcon} alt={"Vissza"} />
                </div>

                <div className="nav-title-div">
                    <p className="brand" onClick={() => navigate("/")}>
                        Auto<span className="mate-span">Mate</span>
                    </p>
                </div>

                <div className={"nav-icons-div"} onClick={logout}>
                    <img className={"nav-icons"} src={exitIcon} alt={"Kilépés"}/>
                </div>

                <div className="help-div">
                    <Link to="/tippek" className="help-link">
                        <img src={helpIcon} alt="Segítség kezdőknek"/>
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
        </>
    )
}