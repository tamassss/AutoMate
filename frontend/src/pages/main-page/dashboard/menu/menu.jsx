import { Link } from "react-router-dom"
import "./menu.css"
import { useState } from "react"
import NewEvent from "../newEvent/newEvent"

export default function Menu(){
    const [showEvents, setShowEvents] = useState(false)

    return(
        <div>
            <Link to="/muszerfal/utak-tankolasok">
            <div>
                <img/>
                <p>Utak - Tankolások</p>
            </div>
            </Link>

            <Link to="/muszerfal/statisztikak">
            <div>
                <img/>
                <p>Statisztikák</p>
            </div>
            </Link>

            <Link to="/muszerfal/szerviznaplo">
            <div>
                <img/>
                <p>Szerviznapló</p>
            </div>
            </Link>

            <div onClick={() => setShowEvents(true)}>
                <h3>Események</h3>
                <p>események...</p>
            </div>

            {showEvents && (
                <NewEvent onClose={() => setShowEvents(false)}/>
            )}

        </div>  
    )
    
}