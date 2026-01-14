import Button from "../../../../components/button/button";
import Input from "../../../../components/input/input";
import Modal from "../../../../components/modal/modal";

import "./editLimit.css"

export default function EditLimit({onClose}){
    return(
        <Modal title={"Limit módosítása"} onClose={onClose}>
            <p className="full-width">Mennyit szeretne költeni üzemanyagra ebben a hónapban?</p>
            <Input type={"number"} placeholder={"Minimum"}/>
            <Input type={"number"} placeholder={"Maximum"}/>
            <Button
                text={"Módosítás"}
            />
        </Modal>
    )
}