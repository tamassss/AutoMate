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
        <div className="align-middle">
            <Navbar leftIcon={backIcon} onLeftClick={()=>navigate("/muszerfal")}/>

            <div className="container avg-cons-div">
                <h1 className="text-center custom-title">Átlag fogyasztás</h1>
                <h3 className="text-center mb-3 custom-subtitle">
                    Tudja meg, mennyit fogyaszt az autója egy rövid teszttel!
                </h3>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7">
                        <Card>
                            <div className="p-3 text-start">
                                
                                <div className="mt-2">
                                    <p><span className="step-span">1. lépés:</span> Tankolja tele az autóját és írja le a kilométeróra állását</p>
                                    <div className="mt-3 col-12 col-sm-6 mx-auto">
                                        <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                                    </div>
                                </div>

                                <hr/>

                                <div>
                                    <p><span className="step-span">2. lépés:</span> Utazzon az autójával valamennyit</p>
                                    <p className="small opacity-75">(minél nagyobb távot tesz meg, annál pontosabb lesz a számítás)</p>
                                </div>

                                <hr/>

                                <div>
                                    <p><span className="step-span">3. lépés:</span> Ismét tankolja tele az autóját, majd írja le:</p>
                                    
                                    <div className="row g-3 mt-2">
                                        <div className="col-12 col-sm-6">
                                            <Input placeholder={"Kilométeróra állás"} type={"number"}/>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <Input placeholder={"Tankolt mennyiség (liter)"} type={"number"}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center btn-div">
                                    <Button text={"Kalkulálás"}/>
                                </div>

                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}