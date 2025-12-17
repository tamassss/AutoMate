import "./modal.css" 
import backIcon from "../../assets/icons/back.png"

export default function Modal({title, children, onClose}){
    return(
        <div>
            <img src={backIcon} onClick={onClose}/> 
            <h3>{title}</h3>
            {children}
        </div>
    )
}