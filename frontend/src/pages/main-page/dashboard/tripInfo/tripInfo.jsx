import Card from "../../../../components/card/card"

import "./tripInfo.css"
import Button from "../../../../components/button/button"

export default function TripInfo(){
    return(
        <div>
            <h2 style={{color:"#075DBF", fontWeight:"bold"}}>Út</h2>
            <h5>Indítson új utat és kövesse nyomon:</h5>
            <ul className="text-start">
                <li>várható és valós érkezés</li>
                <li>út hossza</li>
                <li>várható üzemanyag fogyasztás</li>
                <li>várható költség</li>
                <li>tankolások</li>
                <li>költségek</li>
            </ul>
        </div>
    )
}