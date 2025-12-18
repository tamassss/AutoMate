import Input from "../../../../components/input/input"
import Modal from "../../../../components/modal/modal"
import Table from "../../../../components/table/table"

export default function NewService(onClose){
    return(
        <Modal title={"Új szerviz"} onClose={onClose}>
            <Input/>
        </Modal>
    )
}