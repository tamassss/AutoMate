import Input from "../../../../components/input/input";
import Modal from "../../../../components/modal/modal";

import "./editLimit.css"

export default function EditLimit({onClose}){
    return(
        <Modal title={"Limit módosítása"} onClose={onClose}>
            <p>Mennyit szeretne költeni üzemanyagra ebben a hónapban?</p>
            <Input type={"number"} placeholder={"Minimum"}/>
            <Input type={"number"} placeholder={"Maximum"}/>

        </Modal>
    )
}