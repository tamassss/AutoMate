import { useState } from "react"
import Button from "../../../../components/button/button"
import Table from "../../../../components/table/table"
import "./serviceLog.css"

import { Link } from "react-router-dom"

export default function ServiceLog(){
    const [showNewService, setShowNewService] = useState(false)
    return(
        <>
            <h1>Szerviznapló</h1>
            <Button text={"Új szerviz"} onClick={() => setShowNewService(true)}/>
            
            {showNewService && (
                <
            )}

            <Table>
            </Table>
        </>
    )
}