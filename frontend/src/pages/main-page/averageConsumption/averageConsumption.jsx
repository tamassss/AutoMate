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

                
            <h1 className="mt-4 mb-3">Átlag fogyasztás</h1>
            <h3 className="text-center mb-3 custom-subtitle">Tudja meg, mennyit fogyaszt az autója egy rövid teszttel!</h3>

            <div className="d-flex justify-content-center align-items-center card-wrap">
            <Card>
                <div className="card-content">
                <div>
                    <p> <span className="step-span">1. lépés:</span> Tankolja tele az autóját és írja le a kilométeróra állását</p>
                    <div className="text-center mt-3">
                        <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                    </div>
                    
                </div>

                <hr/>

                <div>
                    <p> <span className="step-span">2. lépés:</span> Utazzon az autójával valamennyit</p>
                    <p className="fs-5">(minél nagyobb távot tesz meg, annál pontosabb lesz a számítás)</p>
                </div>

                <hr/>

                <div>
                    <p> <span className="step-span">3. lépés:</span> Ismét tankolja tele az autóját, majd írja le:</p>
                    <ul className="mt-3">
                        <li>kilométeróra állása</li>
                        <li>tankolt mennyiség</li>
                    </ul>
                    <div className=" d-flex justify-content-center align-items-center">
                        <div className="row">
                            <div className="col-lg-6">
                                <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                            </div>
                            <div className="col-lg-6">
                                <Input placeholder={"Tankolt mennyiség"} type={"number"}/>
                            </div>

                        </div>
                    </div>
                    
                        <Button 
                            text={"Kalkulálás"}
                        />
                    
                    
                </div>
                </div>
            </Card>
            </div>
        </>
    )
}