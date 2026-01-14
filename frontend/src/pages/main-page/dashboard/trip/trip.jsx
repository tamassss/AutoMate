import Card from "../../../../components/card/card"

import "./trip.css"
import Button from "../../../../components/button/button"

export default function Trip(){
    return(
        <div>
            <h2>Út</h2>
            <h5>Indítson új utat és kövesse nyomon:</h5>
            <ul className="text-start">
                <li>várt és valós érkezés</li>
                <li>út hossza</li>
                <li>várt üzemanyag fogyasztás</li>
                <li>várt költség</li>
                <li>tankolások</li>
                <li>költségek</li>
            </ul>
        </div>
    )
}