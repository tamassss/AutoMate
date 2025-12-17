import Button from "../../../components/button/button"
import LabeledInput from "../../../components/labeledInput/labeledInput"
import Modal from "../../../components/modal/modal"

import "./settings.css"

export default function Settings({onClose}){
    return(
        <Modal title={"Beállítások"} onClose={onClose}>
            <LabeledInput label={"Felhasználónév"}/>
            <LabeledInput label={"Keresztnév"}/>
            <LabeledInput label={"E-mail cím"}/>
            <LabeledInput label={"Jelszó"}/>
            <Button text={"Megváltoztatás"}/>
        </Modal>
    )
}