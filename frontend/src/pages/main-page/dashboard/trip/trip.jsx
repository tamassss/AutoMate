import Card from "../../../../components/card/card"

import "./trip.css"
import Button from "../../../../components/button/button"

export default function Trip(){
    return(
        <Card title={"Út"}>
            <h4>Indítson új utat és kövesse nyomon:</h4>
            <ul>
                <li>várt és valós érkezés</li>
                <li>út hossza</li>
                <li>várt üzemanyag fogyasztás</li>
                <li>várt költség</li>
                <li>tankolások</li>
                <li>költségek</li>
            </ul>
        </Card>
    )
}