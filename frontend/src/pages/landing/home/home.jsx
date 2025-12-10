import { Link } from "react-router-dom"
import { useState } from "react"

import Login from "../login/login"
import Register from "../register/register";
import Footer from "../../../components/footer/footer";


export default function Home(){

    const [showLogin, setShowLogin] = useState(true);

    return(
        <>
            <Link to="/tips">Segítség kezdőknek</Link>

            <div>
                <h1>AutoMate</h1>
                <h2>Az autód digitális naplója</h2>
            </div>
            
            <div>
                <p onClick={()=>setShowLogin(!showLogin)}>
                    {showLogin ? "Regisztráció" : "Belépés"}
                </p>
                
                {showLogin ? <Login/> : <Register/>}
            </div>

            <div>
                <h3>Teljes körű autómenedzsment</h3>
                <div>
                <h4>Utak & Tankolások</h4>
                    <p>indítson új utat és az AutoMate megtippeli az érkezését, az út hosszát és költségeit</p>
                    <p>jegyezze fel tankolásait és az AutoMate rendszerezi azokat</p>
                </div>
                <div>
                    <h4>Költési limit</h4>
                    <p>adja meg, mennyit kíván költeni az adott hónapban és az AutoMate belépéskor szemlélteti azt</p>
                </div>
                <div>
                    <h4>Szerviznapló</h4>
                    <p>tartsa számon a cserélt alkatrészeket, a csere időpontját, az elköltött összeget és állítson be emlékeztetőt a következő cseréhez</p>
                </div>
                <div>
                    <h4>Statisztikák</h4>
                    <p>Az AutoMate automatikusan statisztikákat készít a szokásairól</p>
                    <p>Megtekintheti, hogy havonta mennyi kilométert tesz meg, mennyi üzemanyagot vásárol és az egyes hónapokban mennyibe került Önnek 1 kilométer megtétele</p>
                </div>
                <div>
                    <h4>Több autó</h4>
                    <p>Tartsa nyílván az összes autóját, hasonlítsa össze a statisztikáikat</p>
                </div>
                <div>
                    <h4>Emlékeztetők</h4>
                    <p>Állítson be emlékeztetőket, hogy ne feledkezzen meg a fontos eseményekrol</p>
                </div>
                <div>
                    <h4>Segítség kezdőknek</h4>
                    <p>Tekintse meg regisztráció nélkül, hogy mit jelentenek a műszerfalon megjelenő égők, hogyan spórolhat üzemanyagot és hogyan kell könnyedén parkolni</p>
                </div>
                
            </div>

            <Footer/>
        </>
    )
}