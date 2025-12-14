import { Link } from "react-router-dom"
import { useState } from "react"

import "./home.css"

import Login from "../login/login"
import Register from "../register/register";
import Footer from "../../../components/footer/footer";
import Card from "../../../components/card/card";
import Feature from "../../../components/feature/feature";
import Button from "../../../components/button/button";



export default function Home(){

    const [showLogin, setShowLogin] = useState(true);

    return(
        <>
            <div className="help-div">
                <Link to="/tips" className="help-link">
                    Segítség kezdőknek
                </Link>
            </div>

            <div className="hero">
                <h1>Auto<span style={{color:"#075DBF"}}>Mate</span></h1>
                <h2 style={{color:"#BFBFBF"}}>Az autód digitális naplója</h2>
            </div>
            
            
                <div className="auth-div">
                    <div className="auth-tabs">
                            <div
                                className={showLogin ? "auth-tab active" : "auth-tab"}
                                onClick={() => setShowLogin(true)}>
                                <p>Bejelentkezés</p>
                            </div> 
                            <div
                                className={showLogin ? "auth-tab" : "auth-tab active"} 
                                onClick={() => setShowLogin(false)}>
                                <p>Regisztráció</p>
                            </div>                       
                    </div>
                
                    <Card>
                        {showLogin ? <Login/> : <Register/>}
                    </Card>
                </div>
                
            

            <div className="features">
                <h3>Teljes körű autómenedzsment</h3>

                <div className="feature">
                    <img src="../../../assets/"/>

                </div>

                <Feature
                    icon={"../../../assets/home/1.png"}
                    title={"Utak és tankolások"}
                    content={"indítson új utat és az AutoMate megtippeli az érkezését, az út hosszát és költségeit"}
                    content2={"jegyezze fel tankolásait és az AutoMate rendszerezi azokat"}
                />

                <Feature
                    icon={"../../../assets/home/2.png"}
                    title={"Költési limit"}
                    content={"adja meg, mennyit kíván költeni az adott hónapban és az AutoMate belépéskor szemlélteti azt"}
                />

                <Feature
                    icon={"../../../assets/home/3.png"}
                    title={"Szerviznapló"}
                    content={"tartsa számon a cserélt alkatrészeket, a csere időpontját, az elköltött összeget és állítson be emlékeztetőt a következő cseréhez"}
                />

                <Feature
                    icon={"../../../assets/home/4.png"}
                    title={"Statisztikák"}
                    content={"Az AutoMate automatikusan statisztikákat készít a szokásairól"}
                    content2={"Megtekintheti, hogy havonta mennyi kilométert tesz meg, mennyi üzemanyagot vásárol és az egyes hónapokban mennyibe került Önnek 1 kilométer megtétele"}
                />

                <Feature
                    icon={"../../../assets/home/6.png"}
                    title={"Több autó"}
                    content={"Tartsa nyílván az összes autóját, hasonlítsa össze a statisztikáikat"}
                />

                <Feature
                    icon={"../../../assets/home/7.png"}
                    title={"Emlékeztetők"}
                    content={"Állítson be emlékeztetőket, hogy ne feledkezzen meg a fontos eseményekről"}
                />

                <Feature
                    icon={"../../../assets/home/8.png"}
                    title={"Segítség kezdőknek"}
                    content={"Tekintse meg regisztráció nélkül, hogy mit jelentenek a műszerfalon megjelenő égők, hogyan spórolhat üzemanyagot és hogyan kell könnyedén parkolni"}
                />

                
                
            </div>

            <Footer/>
        </>
    )
}