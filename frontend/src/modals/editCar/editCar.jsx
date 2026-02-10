import Button from "../../components/button/button"
import HrOptional from "../../components/hr-optional/hrOptional"
import LabeledInput from "../../components/labeledInput/labeledInput"
import Modal from "../../components/modal/modal"
import "./editCar.css"

export default function EditCar({onClose}){
    return(
        <Modal title="Autó módosítás" columns={1} onClose={onClose} footer={<Button text={"Módosítás"}/>}>
            <LabeledInput label={"Márka"}/>
            <LabeledInput label={"Modell"}/>
            <HrOptional/>
            <LabeledInput label={"Km óra állás"}/>
            <LabeledInput label={"Átlagfogyasztás"}/>
        </Modal>
    )
}