import Button from "../../components/button/button";
import Modal from "../../components/modal/modal";
import "./deleteGasStation.css"

export default function DeleteGasStation({onClose, helyseg, cim}){
    return(
        <Modal columns={2} onClose={onClose} title={"Biztosan törlöd?"}>
            <p className="full-width"><span className="gas-station-location">{helyseg} {cim}</span> benzinkút törlése</p>
            <Button
                text={"Mégse"}
            />

            <Button
                text={"Törlés"}
            />
        </Modal>
    )
    
}