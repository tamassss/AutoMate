import Button from "../../../../components/button/button"
import Input from "../../../../components/input/input"
import Modal from "../../../../components/modal/modal"
import "./newEvent.css"

import { Link } from "react-router-dom"

export default function NewEvent({onClose}){
    return(
        <Modal title={"Új esemény"} onClose={onClose}>
            <Input placeholder={"Esemény"} type={"text"}/>
            <Input placeholder={"Időpont"} type={"date"}/>
            <Input placeholder={"Km"} type={"number"}/>

            <Button text={"Hozzáadás"}/>
        </Modal>
    )
}