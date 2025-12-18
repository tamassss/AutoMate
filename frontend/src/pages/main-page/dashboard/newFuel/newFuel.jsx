import Button from "../../../../components/button/button"
import Input from "../../../../components/input/input"
import Modal from "../../../../components/modal/modal"
import "./newFuel.css"

import { Link } from "react-router-dom"

export default function NewFuel({onClose}){
    return(
        <Modal title={"Új tankolás"} onClose={onClose}>
            <Input placeholder={"Mennyiség"} type={"number"}/>
            <Input placeholder={"Ft/liter"} type={"number"}/>
            <Input placeholder={"Km óra állás"} type={"number"}/>
            <hr/>
            <p>Opcionális</p>
            <Input placeholder={"Helység"} type={"text"}/>
            <Input placeholder={"Cím"} type={"text"}/>
            <Input placeholder={"Forgalmazó"} type={"text"}/>
            <Input placeholder={"Üzemanyag típusa"} type={"text"}/>

            <Button
                text={"Hozzáadás"}
            />
        </Modal>
    )
}