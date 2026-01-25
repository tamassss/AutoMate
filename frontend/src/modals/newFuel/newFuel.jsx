import Button from "../../components/button/button"
import Input from "../../components/input/input"
import Modal from "../../components/modal/modal"
import HrOptional from "../../components/hr-optional/hrOptional"
import "./newFuel.css"

import { Link } from "react-router-dom"

export default function NewFuel({onClose}){
    return(
        <Modal title={"Új tankolás"} onClose={onClose} footer={<Button text={"Hozzáadás"}/>} >
            <Input placeholder={"Mennyiség"} type={"number"}/>
            <Input placeholder={"Ft/liter"} type={"number"}/>
            <Input placeholder={"Km óra állás"} type={"number"}/>
            <HrOptional/>
            <h3 className="full-width">Új Benzinkút</h3>
            <Input placeholder={"Helység"} type={"text"}/>
            <Input placeholder={"Cím"} type={"text"}/>
            <Input placeholder={"Forgalmazó"} type={"text"}/>
            <Input placeholder={"Üzemanyag típusa"} type={"text"}/>
                  
        </Modal>
    )
}