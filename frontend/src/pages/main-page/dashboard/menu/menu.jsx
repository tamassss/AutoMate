import { Link } from "react-router-dom"
import "./menu.css"

export default function Menu(){
    return(
        <div>
            <Link to="/utak-tankolasok">
            <div>
                <img/>
                <p>Utak - Tankolások</p>
            </div>
            </Link>

            <Link to="/statisztikak">
            <div>
                <img/>
                <p>Statisztikák</p>
            </div>
            </Link>

            <Link to="/szerviznaplo">
            <div>
                <img/>
                <p>Szerviznapló</p>
            </div>
            </Link>

            <div>
                <h3>Események</h3>
                <p>események...</p>
            </div>
        </div>  
    )
    
}