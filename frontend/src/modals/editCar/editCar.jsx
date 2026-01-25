import Button from "../../components/button/button"
import HrOptional from "../../components/hr-optional/hrOptional"
import LabeledInput from "../../components/labeledInput/labeledInput"
import Modal from "../../components/modal/modal"
import "./editCar.css"

export default function EditCar({onClose}){
    return(
        <Modal title="Autó módosítás" onClose={onClose} footer={<Button text={"Módosítás"}/>}>
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