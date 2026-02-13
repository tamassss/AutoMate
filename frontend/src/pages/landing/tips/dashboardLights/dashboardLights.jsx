import "./dashboardLights.css"

import { Link } from "react-router-dom"

export default function DashboardLights(){
    return(
        <>
            <div className="container">
                <h1 className="my-4">Műszerfal jelzések</h1>
                <div className="row">
                    <div className="col-4" style={{backgroundColor:"red"}}>
                        <img/>
                    </div>
                    <div className="col-8" style={{backgroundColor:"blue"}}>

                    </div>
                </div>
            </div>
        </>
    )
}