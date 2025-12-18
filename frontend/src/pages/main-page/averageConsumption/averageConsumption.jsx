import Card from "../../../components/card/card";
import Navbar from "../../../components/navbar/navbar";
import backIcon from "../../../assets/icons/back.png"

import { useNavigate } from "react-router-dom";

import "./averageConsumption.css"
import Input from "../../../components/input/input";
import Button from "../../../components/button/button";

export default function AverageConsumption(){
    const navigate = useNavigate();

    return(
        <>
            <Navbar leftIcon={backIcon} onLeftClick={()=>navigate("/muszerfal")}/>
            <h1>Átlag fogyasztás</h1>
            <h3>Tudja meg, mennyit fogyaszt az autója egy rövid teszttel!</h3>
            <Card>
                <div>
                    <p> <span className="step-span">1. lépés:</span> Tankolja tele az autóját és írja le a kilométeróra állását</p>
                    <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                </div>

                <hr/>

                <div>
                    <p> <span className="step-span">2. lépés:</span> Utazzon az autójával valamennyit</p>
                    <p className="small-p">(minél nagyobb távot tesz meg, annál pontosabb lesz a számítás)</p>
                </div>

                <hr/>

                <div>
                    <p> <span className="step-span">3. lépés:</span> Ismét tankolja tele az autóját, majd írja le:</p>
                    <ul>
                        <li>kilométeróra állása</li>
                        <li>tankolt mennyiség</li>
                    </ul>
                    <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                    <Input placeholder={"Tankolt mennyiség"} type={"number"}/>

                    <Button text={"Kalkulálás"}/>
                </div>
            </Card>
        </>
    )
}