import Input from "../../../../components/input/input";
import Modal from "../../../../components/modal/modal";

export default function EditLimit({onClose}){
    return(
        <Modal title={"Limit módosítása"} onClose={onClose}>
            <p>Mennyit szeretne klteni üzemanyagra ebben a hónapban?</p>
            <Input type={"number"} placeholder={"Minimum"}/>
            <Input type={"number"} placeholder={"Maximum"}/>

        </Modal>
    )
}