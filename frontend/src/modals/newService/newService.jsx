import Button from "../../components/button/button"
import Input from "../../components/input/input"
import Modal from "../../components/modal/modal"

export default function NewService({onClose}){
    return(
        <Modal title={"Új szerviz"} onClose={onClose} footer={<Button text={"Hozzáadás"}/>}>
            <Input placeholder={"Alkatrész"} type={"text"}/>
            <Input placeholder={"Csere ideje"} type={"date"}/>
            <Input placeholder={"Ár"} type={"number"}/>
            <Input placeholder={"Emlékeztető (dátum)"} type={"date"}/>
            <Input placeholder={"Emlékeztető (km)"} type={"number"}/>
        </Modal>
    )
}