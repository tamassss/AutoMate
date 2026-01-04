import { useState } from "react"
import Button from "../../../../components/button/button"
import Table from "../../../../components/table/table"
import "./serviceLog.css"

import { Link, useNavigate } from "react-router-dom"
import NewService from "../newService/newService"
import Navbar from "../../../../components/navbar/navbar"

import backIcon from "../../../../assets/icons/back.png"

export default function ServiceLog(){
    const [showNewService, setShowNewService] = useState(false)
    const navigate = useNavigate();

    return(
        <>
            <Navbar leftIcon={backIcon} altLeft={"Vissza"} onLeftClick={() => navigate("/muszerfal")}/>
            <h1>Szerviznapló</h1>
            <Button text={"Új szerviz"} onClick={() => setShowNewService(true)}/>
            
            {showNewService && (
                <NewService onClose={() => setShowNewService(false)}/>
            )}

            <p>Még nem adtál hozzá szervizt</p>
            {/* <Table>
            </Table> */}
        </>
    )
}