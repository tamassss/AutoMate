import Button from "../../components/button/button"
import HrOptional from "../../components/hr-optional/hrOptional"
import LabeledInput from "../../components/labeledInput/labeledInput"
import Modal from "../../components/modal/modal"
import "./addCar.css"

export default function AddCar({onClose}){
    return(
        <Modal title="Autó hozzáadása" columns={1} onClose={onClose} footer={<Button text={"Hozzáadás"}/>}>
            <LabeledInput label={"Márka"}/>
            <LabeledInput label={"Modell"}/>
            <HrOptional/>
            <LabeledInput label={"Km óra állás"}/>
            <LabeledInput label={"Átlagfogyasztás"}/>
        </Modal>
    )
}