import Button from "../../../components/button/button"
import LabeledInput from "../../../components/labeledInput/labeledInput"
import Modal from "../../../components/modal/modal"
import "./addCar.css"

export default function AddCar({onClose}){
    return(
        <Modal title="Autó hozzáadása" onClose={onClose}>
            <LabeledInput label={"Márka"}/>
            <LabeledInput label={"Modell"}/>
            <hr className="full-width"/>
            <LabeledInput label={"Évjárat"}/>
            <LabeledInput label={"Km óra állás"}/>
            <LabeledInput label={"Teljesítmény"}/>
            <LabeledInput label={"Átlagfogyasztás"}/>
            <LabeledInput label={"Üzemanyag"}/>
            <LabeledInput label={"Tank mérete"}/>
            <Button
                text={"Hozzáadás"}
            />
        </Modal>
    )
}