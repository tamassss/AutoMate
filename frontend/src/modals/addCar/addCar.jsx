import Button from "../../components/button/button"
import HrOptional from "../../components/hr-optional/hrOptional"
import LabeledInput from "../../components/labeledInput/labeledInput"
import Modal from "../../components/modal/modal"
import "./addCar.css"

export default function AddCar({onClose}){
    return(
        <Modal title="Autó hozzáadása" onClose={onClose} footer={<Button text={"Hozzáadás"}/>}>
            <LabeledInput label={"Márka"}/>
            <LabeledInput label={"Modell"}/>
            <HrOptional/>
            <LabeledInput label={"Évjárat"}/>
            <LabeledInput label={"Km óra állás"}/>
            <LabeledInput label={"Teljesítmény"}/>
            <LabeledInput label={"Átlagfogyasztás"}/>
            <LabeledInput label={"Üzemanyag"}/>
            <LabeledInput label={"Tank mérete"}/>
        </Modal>
    )
}