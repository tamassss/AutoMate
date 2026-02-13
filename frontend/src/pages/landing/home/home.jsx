import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import "./home.css"

import Login from "../login/login"
import Register from "../register/register";
import Footer from "../../../components/footer/footer";
import Card from "../../../components/card/card";
import Feature from "../../../components/feature/feature";
import Button from "../../../components/button/button";

import icon1 from "../../../assets/home/1.png";
import icon2 from "../../../assets/home/2.png";
import icon3 from "../../../assets/home/3.png";
import icon4 from "../../../assets/home/4.png";
import icon6 from "../../../assets/home/6.png";
import icon7 from "../../../assets/home/7.png";
import icon8 from "../../../assets/home/8.png";
import Error from "../../../components/error-modal/errorModal";


export default function Home(){
    const navigate = useNavigate()
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"))

    return(
        <>
            {isLoggedIn &&
                <p className="ms-4 mt-4 fs-4">Bejelentkezve: {localStorage.getItem("full_name")}</p>}
            <div className="hero">
                <br/>
                <h1 className="custom-title">Auto<span style={{color:"#075DBF"}}>Mate</span></h1>
                <h2 className="custom-h2 fs-4" style={{color:"#BFBFBF", fontWeight:"bold"}}>Az autód digitális naplója</h2>
            </div>
            
            {!isLoggedIn ? 
                (<div className="auth-div">
                    <div className="auth-tabs">
                            <div
                                className={showLogin ? "auth-tab active" : "auth-tab inactive"}
                                onClick={() => setShowLogin(true)}>
                                <p>Bejelentkezés</p>
                            </div> 
                            <div
                                className={showLogin ? "auth-tab inactive" : "auth-tab active"} 
                                onClick={() => setShowLogin(false)}>
                                <p>Regisztráció</p>
                            </div>                     
                    </div>
                
                    <div>
                        {showLogin ? <Login/> : <Register/>}
                    </div>
                
                </div>)
                :
                (<Button text={"Garázs"} onClick={() => navigate("/autok")}/>)
            }
                
                
            {/* Itt lesznek képek az oldalról */}
            

            <div className="features container">
                <h3 className="fs-3 mb-4">Teljes körű autómenedzsment</h3>

                <Feature
                    icon={icon1}
                    title={"Utak és tankolások"}
                    content={"indítson új utat és az AutoMate megtippeli az érkezését, az út hosszát és költségeit"}
                    content2={"jegyezze fel tankolásait és az AutoMate rendszerezi azokat"}
                />

                <Feature
                    icon={icon2}
                    title={"Költési limit"}
                    content={"adja meg, mennyit kíván költeni az adott hónapban és az AutoMate belépéskor szemlélteti azt"}
                />

                <Feature
                    icon={icon3}
                    title={"Szerviznapló"}
                    content={"tartsa számon a cserélt alkatrészeket, a csere időpontját, az elköltött összeget és állítson be emlékeztetőt a következő cseréhez"}
                />

                <Feature
                    icon={icon4}
                    title={"Statisztikák"}
                    content={"az AutoMate automatikusan statisztikákat készít a szokásairól"}
                    content2={"megtekintheti, hogy havonta mennyi kilométert tesz meg, mennyi üzemanyagot vásárol és az egyes hónapokban mennyibe került Önnek 1 kilométer megtétele"}
                />

                <Feature
                    icon={icon6}
                    title={"Több autó"}
                    content={"tartsa nyílván az összes autóját, hasonlítsa össze a statisztikáikat"}
                />

                <Feature
                    icon={icon7}
                    title={"Emlékeztetők"}
                    content={"állítson be emlékeztetőket, hogy ne feledkezzen meg a fontos eseményekről"}
                />

                <Feature
                    icon={icon8}
                    title={"Segítség kezdőknek"}
                    content={"tekintse meg regisztráció nélkül, hogy mit jelentenek a műszerfalon megjelenő égők, hogyan spórolhat üzemanyagot és hogyan kell könnyedén parkolni"}
                />
                
            </div>

            <Footer/>
        </>
    )
}