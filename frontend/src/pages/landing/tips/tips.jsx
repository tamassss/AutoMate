import "./tips.css"

import { Link } from "react-router-dom"

export default function Tips(){
    return(
        <>
            <div>
                <Link to="/tippek/muszerfal-jelzesek">
                    <img src="../../assets/placeholder.jpg" alt="Műszerfal jelzések"/>
                    <p>Műszerfal jelzések</p>
                </Link>
            </div>

            <div>
                <Link to="/tippek/uzemanyag-sporolas">
                    <img src="../../assets/placeholder.jpg" alt="Üzemanyag Spórolás"/>
                    <p>Üzemanyag spórolás</p>
                </Link>
            </div>

            <div>
                <Link to="/tippek/parkolasi-tippek">
                    <img src="../../assets/placeholder.jpg" alt="Parkolási tippek"/>
                    <p>Parkolási tippek</p>
                </Link>
            </div>
        </>
    )
}