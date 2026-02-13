import xIcon from "../../assets/icons/x-icon.png";

import "./successModal.css"

export default function SuccessModal({onClose, title, description}){
    return(
        <div className="success-div" onClick={() => onClose()}>
            <div className="success-close-img-div">
                <img src={xIcon} onClick={() => onClose()} className="success-close-img"/>
            </div>
            <div className="success-content p-3">
                <div className="success-text-div">
                    <p className="success-text">{title}</p>
                </div>
                <div className="success-description-div">
                    <p className="success-description">{description}</p>
                </div>
            </div>
        </div>
    )
}