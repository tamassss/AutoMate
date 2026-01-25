import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Button from "../../../../components/button/button"
import Card from "../../../../components/card/card"
import Navbar from "../../../../components/navbar/navbar"

import NewService from "../../../../modals/newService/newService"

import backIcon from "../../../../assets/icons/back.png"

import "./serviceLog.css"

export default function ServiceLog(){
    const [showNewService, setShowNewService] = useState(false)
    const navigate = useNavigate();

    const staticServices = [
        { id: 1, alkatresz: "Olajszűrő", ido: "2025. 05. 12.", ar: "15 000 Ft", emlekeztetoDatum: "2026. 05. 12.", emlekeztetoKm: "15 000 km" },
        { id: 2, alkatresz: "Fékbetét", ido: "2024. 11. 02.", ar: "45 000 Ft", emlekeztetoDatum: "2026. 11. 02.", emlekeztetoKm: "30 000 km" }
    ];

    const hasServices = staticServices.length > 0;

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")} subtitle={"Szerviznapló"}/>
            
            <div className="container mt-4">
                <h1 className="mb-4">Szerviznapló</h1>
                <Button text={"Új szerviz"} onClick={() => setShowNewService(true)}/>
                
                {showNewService && (
                    <NewService onClose={() => setShowNewService(false)}/>
                )}

                <div className="mt-5">
                    {hasServices ? (
                        <Card>
                            <table className="custom-table mt-2">
                                <thead>
                                    <tr>
                                        <th>Alkatrész</th>
                                        <th>Csere ideje</th>
                                        <th>Ár</th>
                                        <th>Emlékeztető</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staticServices.map((service) => (
                                        <tr key={service.id} >
                                            <td>{service.alkatresz}</td>
                                            <td>{service.ido}</td>
                                            <td>{service.ar}</td>
                                            <td>
                                                <div className="reminder-date">{service.emlekeztetoDatum}</div>
                                                <div className="reminder-km">{service.emlekeztetoKm}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
                            <p className="fs-5">Még nem adtál hozzá szervizt</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}