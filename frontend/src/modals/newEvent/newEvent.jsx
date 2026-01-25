import Button from "../../components/button/button"
import Input from "../../components/input/input"
import Modal from "../../components/modal/modal"
import "./newEvent.css"

export default function NewEvent({onClose}){
    return(
        <Modal title={"Új esemény"} onClose={onClose} columns={1} footer={<Button text={"Hozzáadás"}/>}>
            <Input placeholder={"Esemény"} type={"text"}/>
            <Input placeholder={"Időpont"} type={"date"}/>
            <Input placeholder={"Km"} type={"number"}/>
        </Modal>
    )
}