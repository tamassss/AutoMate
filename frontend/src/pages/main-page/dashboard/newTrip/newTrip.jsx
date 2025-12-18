import Button from "../../../../components/button/button"
import Input from "../../../../components/input/input"
import Modal from "../../../../components/modal/modal"
import "./newTrip.css"

import { Link } from "react-router-dom"

export default function NewTrip({onClose}){
    return(
        <Modal title={"Új út"} onClose={onClose}>
            <Input placeholder={"Honnan"} type={"text"}/>
            <Input placeholder={"Hová"} type={"text"}/>

            <Button
                text={"Út indítása"}
            />
        </Modal>
    )
}