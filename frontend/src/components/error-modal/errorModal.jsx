import xIcon from "../../assets/icons/x-icon.png";

import "./errorModal.css"

export default function ErrorModal({onClose, title, description}){
    return(
        <div className="error-div" onClose={() => onClose()}>
            <div className="error-close-img-div">
                <img src={xIcon} onClick={() => onClose()} className="error-close-img"/>
            </div>
            <div className="error-content p-3">
                <div className="error-text-div">
                    <p className="error-text">{title}</p>
                </div>
                <div className="error-description-div">
                    <p className="error-description">{description}</p>
                </div>
            </div>
        </div>
    )
}